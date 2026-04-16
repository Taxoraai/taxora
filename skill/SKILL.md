# CryptoTax Skill

Calculate cryptocurrency taxes with accurate country-specific rules.

## Trigger

Use this skill when the user asks to:
- Calculate crypto taxes
- Generate tax reports for cryptocurrency
- Determine capital gains/losses on crypto
- Export crypto transactions for tax filing

## Usage

```
/cryptotax <wallet_address> [options]

Options:
  --year <year>        Tax year (default: current year)
  --country <country>  Tax jurisdiction (default: "United States")
  --method <method>    Cost basis: FIFO, HIFO, or Avg (default: FIFO)
  --chains <chains>    Comma-separated chains (default: auto-detect)
  --output <format>    json, csv, or pdf (default: json)
```

## Examples

```
/cryptotax 0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045 --year 2024 --country "United States"
/cryptotax bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh --country Canada --method HIFO
/cryptotax 5tzFkiKscXHK5ZXCGbXZxdw7gTjjD1mBwuoFbhUvuAi9 --country India
```

## Workflow

1. **Detect chain** from wallet address format
2. **Fetch transactions** from blockchain APIs
3. **Get historical prices** for each transaction
4. **Apply tax rules** for the specified country
5. **Calculate gains/losses** using the cost basis method
6. **Generate report** in requested format

## Files

- `tax-rules.ts` - Country-specific tax rates and rules
- `tax-engine.ts` - FIFO/HIFO/Average cost basis calculation
- `fetchers/` - Blockchain transaction fetchers
- `prices.ts` - Historical price fetching
- `cli.ts` - Command-line interface

## Important Notes

- India: 30% flat tax, no loss offsetting, FIFO only
- Germany: Tax-free after 1 year holding period
- UAE/Singapore: No capital gains tax on crypto
- USA: Long-term (>1yr) vs short-term rates differ significantly
