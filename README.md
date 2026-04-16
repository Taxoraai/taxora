# CryptoTax Skills

AI-powered crypto tax calculation skill for LLM CLI tools.

## Supported LLM CLIs

| CLI | Skill Location |
|-----|----------------|
| Claude Code | `~/.claude/skills/cryptotax/` |
| Cursor | `.cursor/skills/cryptotax/` |
| Continue | `.continue/skills/cryptotax/` |
| Aider | `.aider/skills/cryptotax/` |
| GPT-CLI | `.gpt/skills/cryptotax/` |

## Installation

```bash
# Clone the repo
git clone https://github.com/yourusername/cryptotax-skills.git

# Install for Claude Code
cp -r cryptotax-skills/skill ~/.claude/skills/cryptotax

# Install dependencies (for standalone CLI use)
cd cryptotax-skills
npm install
```

## Usage

### As LLM Skill
```
/cryptotax 0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045 --year 2024 --country "United States"
```

### As Standalone CLI
```bash
npx cryptotax calculate 0x... --year 2024 --country "United States" --method FIFO
```

## Supported Countries (50+)

Full tax rule coverage for:
- Americas: USA, Canada, Brazil, Mexico, Argentina, Chile, Colombia, Peru
- Europe: UK, Germany, France, Spain, Italy, Netherlands, Switzerland, etc.
- Asia: India, Japan, South Korea, Singapore, Hong Kong, etc.
- Middle East: UAE, Saudi Arabia, Israel
- Africa: South Africa, Nigeria, Kenya, Egypt
- Oceania: Australia, New Zealand

## Features

- **Real blockchain data**: Fetches transactions from Ethereum, Bitcoin, Solana, and L2s
- **Accurate pricing**: Historical prices from CoinGecko
- **Cost basis methods**: FIFO, HIFO, Average Cost
- **Country-specific rules**: Long/short term rates, loss offsetting, special taxes
- **Multiple export formats**: JSON, CSV, PDF

## Environment Variables

```bash
ALCHEMY_API_KEY=       # For EVM chains + Solana
COINGECKO_API_KEY=     # Optional, for higher rate limits + full historical data
```

## Limitations (Free Tier)

- **CoinGecko**: Free tier only supports last 365 days of price history
  - Use `--year 2025` or `--year 2026` (not older)
  - Paid plan required for full historical data
- **Rate limits**: ~30 requests/minute on CoinGecko free tier

## License

MIT
