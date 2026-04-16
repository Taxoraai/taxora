#!/usr/bin/env node
/**
 * CryptoTax CLI
 *
 * Calculate cryptocurrency taxes from command line.
 * Works standalone or as an LLM skill.
 */

import { fetchWalletTransactions } from "./fetchers";
import { fetchHistoricalPrices } from "./prices";
import { buildTokenMapping, getCoingeckoId } from "./tokens";
import { TaxEngine } from "./tax-engine";
import { getTaxRules, calculateTax } from "./tax-rules";
import type { PricePoint, CostBasisMethod } from "./types";

// Parse command line arguments
function parseArgs(): {
  wallet: string;
  year: number;
  country: string;
  method: CostBasisMethod;
  chains: string[];
  output: "json" | "csv" | "summary";
} {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes("--help") || args.includes("-h")) {
    console.log(`
CryptoTax CLI - Calculate cryptocurrency taxes

Usage:
  cryptotax <wallet_address> [options]

Options:
  --year <year>        Tax year (default: current year)
  --country <country>  Tax jurisdiction (default: "United States")
  --method <method>    Cost basis: FIFO, HIFO, or Avg (default: FIFO)
  --chains <chains>    Comma-separated chains (default: auto-detect)
  --output <format>    json, csv, or summary (default: summary)

Examples:
  cryptotax 0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045 --year 2024 --country "United States"
  cryptotax bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh --country Canada --method HIFO
  cryptotax 5tzFkiKscXHK5ZXCGbXZxdw7gTjjD1mBwuoFbhUvuAi9 --country India --output json

Environment Variables:
  ALCHEMY_API_KEY      Required for EVM chains and Solana
  COINGECKO_API_KEY    Optional, for higher rate limits
`);
    process.exit(0);
  }

  const wallet = args[0];
  let year = new Date().getFullYear();
  let country = "United States";
  let method: CostBasisMethod = "FIFO";
  let chains: string[] = [];
  let output: "json" | "csv" | "summary" = "summary";

  for (let i = 1; i < args.length; i++) {
    switch (args[i]) {
      case "--year":
        year = parseInt(args[++i], 10);
        break;
      case "--country":
        country = args[++i];
        break;
      case "--method":
        method = args[++i].toUpperCase() as CostBasisMethod;
        break;
      case "--chains":
        chains = args[++i].split(",").map((c) => c.trim());
        break;
      case "--output":
        output = args[++i] as "json" | "csv" | "summary";
        break;
    }
  }

  // Auto-detect chain from wallet format
  if (chains.length === 0) {
    if (wallet.startsWith("0x") && wallet.length === 42) {
      chains = ["Ethereum"];
    } else if (wallet.startsWith("bc1") || /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/.test(wallet)) {
      chains = ["Bitcoin"];
    } else if (/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(wallet)) {
      chains = ["Solana"];
    } else {
      chains = ["Ethereum"]; // Default
    }
  }

  return { wallet, year, country, method, chains, output };
}

async function main() {
  const { wallet, year, country, method, chains, output } = parseArgs();

  console.error(`\nCryptoTax Calculator`);
  console.error(`═════════════════════════════════════��═`);
  console.error(`Wallet:  ${wallet.slice(0, 10)}...${wallet.slice(-6)}`);
  console.error(`Year:    ${year}`);
  console.error(`Country: ${country}`);
  console.error(`Method:  ${method}`);
  console.error(`Chains:  ${chains.join(", ")}`);
  console.error(`═══════════════════════════════════════\n`);

  // Validate country and method
  const rules = getTaxRules(country);
  if (!rules.allowedMethods.includes(method)) {
    console.error(`Error: ${country} only allows these methods: ${rules.allowedMethods.join(", ")}`);
    console.error(`Switching to ${rules.defaultMethod}`);
  }
  const effectiveMethod = rules.allowedMethods.includes(method) ? method : rules.defaultMethod;

  // Step 1: Fetch transactions
  console.error(`[1/4] Fetching transactions...`);
  const fetchResult = await fetchWalletTransactions(wallet, chains, year);

  if (fetchResult.errors.length > 0) {
    console.error(`Warnings: ${fetchResult.errors.join(", ")}`);
  }

  if (fetchResult.txs.length === 0) {
    console.error(`No transactions found for ${year}`);
    process.exit(1);
  }

  console.error(`      Found ${fetchResult.txs.length} transactions, ${fetchResult.tokens.size} tokens`);

  // Step 2: Fetch prices
  console.error(`[2/4] Fetching historical prices...`);
  const tokenToCoingecko = buildTokenMapping(Array.from(fetchResult.tokens));

  const priceRequests: { tokenId: string; date: string }[] = [];
  const seenPriceKeys = new Set<string>();

  for (const tx of fetchResult.txs) {
    const coingeckoId =
      tokenToCoingecko.get(tx.tokenAddress.toLowerCase()) ?? getCoingeckoId(tx.tokenAddress);
    if (!coingeckoId) continue;
    const date = new Date(tx.timestamp * 1000).toISOString().split("T")[0];
    const key = `${coingeckoId}:${date}`;
    if (seenPriceKeys.has(key)) continue;
    seenPriceKeys.add(key);
    priceRequests.push({ tokenId: coingeckoId, date });
  }

  const pricePoints = await fetchHistoricalPrices(priceRequests);
  console.error(`      Fetched ${pricePoints.length} price points`);

  // Step 3: Process with tax engine
  console.error(`[3/4] Calculating cost basis (${effectiveMethod})...`);

  const engine = new TaxEngine(effectiveMethod, year);
  engine.loadPrices(pricePoints);
  engine.processTransactions(fetchResult.txs, tokenToCoingecko);
  engine.matchDisposals();

  const totals = engine.summarize();
  const transactions = engine.getTransactions();

  // Step 4: Calculate taxes
  console.error(`[4/4] Applying ${country} tax rules...`);

  const taxResult = calculateTax(
    country,
    totals.shortTermGains,
    totals.longTermGains,
    totals.losses,
    totals.income
  );

  // Output results
  if (output === "json") {
    console.log(
      JSON.stringify(
        {
          wallet,
          year,
          country,
          method: effectiveMethod,
          transactions: transactions.length,
          summary: {
            totalProceeds: totals.proceeds,
            totalCostBasis: totals.costBasis,
            shortTermGains: totals.shortTermGains,
            longTermGains: totals.longTermGains,
            totalGains: totals.gains,
            totalLosses: totals.losses,
            netGains: totals.netGains,
            income: totals.income,
          },
          tax: {
            totalTax: taxResult.totalTax,
            shortTermTax: taxResult.shortTermTax,
            longTermTax: taxResult.longTermTax,
            incomeTax: taxResult.incomeTax,
            effectiveRate: taxResult.effectiveRate,
            breakdown: taxResult.breakdown,
          },
          rules: {
            shortTermRate: rules.shortTermRate,
            longTermRate: rules.longTermRate,
            longTermExempt: rules.longTermExempt,
            allowsLossOffset: rules.allowsLossOffset,
            notes: rules.notes,
          },
        },
        null,
        2
      )
    );
  } else if (output === "csv") {
    console.log("date,token,amount,cost_basis,proceeds,gain_loss,held_days,type,hash");
    for (const tx of transactions) {
      console.log(
        [
          tx.date,
          tx.token,
          tx.amount.toFixed(6),
          tx.costBasis.toFixed(2),
          tx.proceeds.toFixed(2),
          (tx.proceeds - tx.costBasis).toFixed(2),
          tx.heldDays,
          tx.type,
          tx.hash,
        ].join(",")
      );
    }
  } else {
    // Summary output
    console.log(`\n${"═".repeat(50)}`);
    console.log(`TAX SUMMARY - ${country} ${year}`);
    console.log(`${"═".repeat(50)}\n`);

    console.log(`CAPITAL GAINS`);
    console.log(`  Short-term gains:  $${totals.shortTermGains.toLocaleString("en-US", { maximumFractionDigits: 0 })}`);
    console.log(`  Long-term gains:   $${totals.longTermGains.toLocaleString("en-US", { maximumFractionDigits: 0 })}`);
    console.log(`  Total gains:       $${totals.gains.toLocaleString("en-US", { maximumFractionDigits: 0 })}`);
    console.log(`  Total losses:      $${totals.losses.toLocaleString("en-US", { maximumFractionDigits: 0 })}`);
    console.log(`  Net gains:         $${taxResult.netGains.toLocaleString("en-US", { maximumFractionDigits: 0 })}`);

    if (totals.income > 0) {
      console.log(`\nINCOME`);
      console.log(`  Airdrops:          $${totals.airdrops.total.toLocaleString("en-US", { maximumFractionDigits: 0 })} (${totals.airdrops.count} events)`);
      console.log(`  Staking/Yield:     $${totals.yieldEvents.total.toLocaleString("en-US", { maximumFractionDigits: 0 })} (${totals.yieldEvents.count} events)`);
      console.log(`  Total income:      $${totals.income.toLocaleString("en-US", { maximumFractionDigits: 0 })}`);
    }

    console.log(`\nTAX CALCULATION`);
    for (const line of taxResult.breakdown) {
      console.log(`  ${line}`);
    }

    console.log(`\n${"─".repeat(50)}`);
    console.log(`  ESTIMATED TAX DUE: $${taxResult.totalTax.toLocaleString("en-US", { maximumFractionDigits: 0 })}`);
    console.log(`  Effective rate:    ${(taxResult.effectiveRate * 100).toFixed(1)}%`);
    console.log(`${"─".repeat(50)}\n`);

    if (rules.notes) {
      console.log(`Note: ${rules.notes}\n`);
    }
  }
}

main().catch((err) => {
  console.error(`Error: ${err.message}`);
  process.exit(1);
});
