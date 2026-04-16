/**
 * Core types for CryptoTax skill
 */

// ============ Cost Basis Method ============

export type CostBasisMethod = "FIFO" | "HIFO" | "Avg";

// ============ Transaction Types ============

export type TxType = "Swap" | "Transfer" | "Yield" | "Airdrop" | "Bridge";

/** Processed transaction for display */
export type Tx = {
  id: string;
  hash: string;
  date: string;           // YYYY-MM-DD
  ts: number;             // Unix ms
  token: string;          // ETH, USDC, etc.
  contract: string;       // 0x…
  type: TxType;
  amount: number;         // Signed: + receive, − send
  costBasis: number;      // USD (per-tx for disposals)
  proceeds: number;       // USD (per-tx for disposals)
  heldDays: number;       // Days held before disposal
  isDisposal: boolean;    // Counts as a sale
  isIncome: boolean;      // Airdrop/yield → income
};

// ============ Totals ============

export type Totals = {
  proceeds: number;
  costBasis: number;
  gains: number;          // Positive only
  losses: number;         // Positive number representing losses
  netGains: number;       // gains - losses
  income: number;
  airdrops: { count: number; total: number };
  yieldEvents: { count: number; total: number };
  longTermGains: number;
  shortTermGains: number;
};

// ============ Raw Transaction from Blockchain ============

/** Raw transaction from blockchain API (chain-agnostic) */
export type RawTx = {
  hash: string;
  blockNumber: number;
  timestamp: number;          // Unix seconds
  from: string;
  to: string;
  token: string;              // Symbol (ETH, USDC, etc.)
  tokenAddress: string;       // Contract address (0x0 for native)
  amount: number;             // Always positive
  direction: "in" | "out";    // Relative to the wallet
  chain: string;              // "Ethereum", "Bitcoin", "Solana", etc.
  type?: "swap" | "transfer" | "yield" | "airdrop" | "bridge" | "nft" | "unknown";
};

// ============ Price Types ============

/** Historical price data point */
export type PricePoint = {
  tokenId: string;            // CoinGecko ID
  date: string;               // YYYY-MM-DD
  priceUsd: number;
};

/** Price lookup request */
export type PriceRequest = {
  tokenId: string;            // CoinGecko ID
  date: string;               // YYYY-MM-DD
};

// ============ Tax Lot Accounting ============

/** An acquisition lot (when crypto was acquired with cost basis) */
export type AcquisitionLot = {
  id: string;
  txHash: string;
  date: string;               // YYYY-MM-DD
  timestamp: number;          // Unix ms
  token: string;
  tokenAddress: string;
  amount: number;             // Remaining amount in lot
  originalAmount: number;     // Original acquisition amount
  costBasisPerUnit: number;   // USD per unit at acquisition
  totalCostBasis: number;     // amount * costBasisPerUnit
  chain: string;
  isIncome: boolean;          // true for airdrops/yield (taxable as income)
  incomeType?: "airdrop" | "yield" | "staking" | "mining";
};

/** A disposal event with matched acquisition lots */
export type DisposalEvent = {
  id: string;
  txHash: string;
  date: string;               // YYYY-MM-DD
  timestamp: number;          // Unix ms
  token: string;
  tokenAddress: string;
  amount: number;             // Amount disposed
  proceeds: number;           // USD value at disposal
  proceedsPerUnit: number;    // USD per unit at disposal
  chain: string;

  // Matched lots
  matchedLots: {
    lotId: string;
    amount: number;           // Amount taken from this lot
    costBasis: number;        // Cost basis for this portion
    heldDays: number;         // Days held
    isLongTerm: boolean;      // >= 365 days
  }[];

  // Calculated
  totalCostBasis: number;
  gain: number;               // proceeds - costBasis (can be negative = loss)
  isLongTerm: boolean;        // true if ALL matched lots are long-term
};

/** Token metadata for price lookups */
export type TokenInfo = {
  symbol: string;
  address: string;
  chain: string;
  coingeckoId: string | null;
  decimals: number;
};

/** Processed transaction for display */
export type ProcessedTx = Tx & {
  matchedLots?: DisposalEvent["matchedLots"];
};
