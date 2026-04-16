
<div align="center">

<h1>🌍 Taxora: Agentic Crypto Tax Skills for LLMs</h1>

<p><strong>The first multi-chain crypto tax calculator with native X Layer support. Built for Claude, Codex, Cursor, and beyond.</strong></p>

</div>

---

## 🛑 The Problem: Crypto Tax is Broken

Calculating crypto taxes manually is an absolute nightmare. The infrastructure is fundamentally broken for active users because:

- **Transaction Overload:** High-frequency activity (DeFi, trading, staking) causes traditional tax software to crash or charge exorbitant enterprise fees.
    
- **Cost Basis Destruction:** The moment funds bridge across chains or move to non-custodial wallets, centralized exchanges lose track of your cost basis.
    
- **AI Hallucinations:** Asking standard LLMs for tax advice often results in confidently incorrect financial guidance, leading to severe liabilities.
    
- **Illiquid Asset Blindspots:** Meme coins, obscure NFTs, and newly launched governance tokens often lack established fiat pricing, breaking automated reports.
    
- **The Audit Trap:** Regulators already possess extensive chain data. If your manual spreadsheets don't match the on-chain reality, an audit is almost guaranteed.
    

## ⚡ Meet Taxora

**Taxora is an Agentic Skill that gives Claude, Codex, and any underlying LLM the deterministic ability to calculate complex crypto tax accurately, at scale, and across every chain.**

By connecting an OKX Wallet, Taxora auto-detects all associated addresses (Ethereum, Solana, L2s) and provides a highly accurate tax breakdown in minutes. No spreadsheets. No guessing. No pain. Zero hallucinations.

### 💼 Agentic Wallet Integration Details

**Contract / Wallet:** `0xa0b3a5f9628a6455dd48db57b3586434b8bc283f`

---

## 🛠️ Core Mechanics: How Taxora Fixes Everything

Rather than relying on brittle CSV imports, Taxora operates natively on-chain as a 24/7 Agent Skill.

- **Direct On-Chain Crawling:** Bypasses centralized API rate limits to pull immutable transaction history directly from block explorers and RPC nodes.
    
- **Full Asset Lifecycle Tracking:** Follows the birth, bridging, wrapping, and death of an asset across multiple chains without losing the chronological cost basis.
    
- **Deterministic Legal Logic:** Replaces AI guessing with hard-coded, jurisdiction-specific tax logic. LLMs handle the natural language interface; Taxora handles the math.
    
- **DEX-Based Price Discovery:** When CoinGecko/CoinMarketCap fails, Taxora derives real Fair Market Value (FMV) directly from decentralized exchange liquidity pools.
    
- **Pre-Emptive Reconciliation:** Structures output dynamically to be instantly audit-ready for CPAs and tax authorities.
    

### 🕒 Real-Time Tax Awareness

Taxes are typically calculated _after_ the year ends, by which point the profits may have already been spent. Taxora runs perpetually in the background:

- **Live Liability Tracking:** Monitors your floating tax burden in real-time.
    
- **Disaster Prevention Alerts:** Notifies you before executing a trade that could trigger a devastating taxable event.
    
- **Smart "Tax Reserve" Prompts:** Automatically calculates and suggests setting aside fiat for impending tax bills. _(e.g., "You just made $50k. Your estimated tax is $15k. Don't ape it all back in.")_
    

---

## 🌍 A Global Crypto Tax Engine

Taxora natively understands and adapts to the immense complexity of international tax law across **50+ supported countries**.

- **Residency Tracking:** Automatically flags when you have triggered physical presence tests (e.g., >183 days) based on location metadata and transaction stamping.
    
- **Country-Specific Classification:** Dynamically adjusts rules for capital gains vs. income based on local jurisdictions (e.g., staking rewards in the US vs. the UK).
    
- **Local Exemptions:** Natively applies unique geopolitical tax loopholes (e.g., the German 1-year holding period exemption for tax-free crypto gains).
    
- **VAT/GST Mapping:** Correctly categorizes transactions that may be subject to Value-Added Tax or Goods and Services Tax depending on the counterparties.
    

---

## 🎯 Target Audience

- **Degens & High-Volume Traders:** Users executing 10,000+ transactions per month across multiple obscure EVM chains and Solana.
    
- **AI & Algorithmic Traders:** Automated systems that risk going "tax-bankrupt" by accumulating millions in micro-liabilities without reserving fiat.
    
- **Global Nomads:** Digital citizens navigating the overwhelming multi-country complexity of varying tax residencies and double-taxation treaties.
    

---

## 💻 Installation & Usage

Taxora integrates seamlessly into your existing developer environment and AI coding assistants.

### Supported LLM CLIs

|**Development Environment**|**Installation Directory**|
|---|---|
|**Claude Code**|`~/.claude/skills/cryptotax/`|
|**Cursor**|`.cursor/skills/cryptotax/`|
|**Continue**|`.continue/skills/cryptotax/`|
|**Aider**|`.aider/skills/cryptotax/`|
|**GPT-CLI**|`.gpt/skills/cryptotax/`|

### Quick Start Setup

Bash

```
# Clone the repository
git clone https://github.com/sandeepgehlawat/cryptotax-skills.git

# Install specifically for Claude Code
cp -r cryptotax-skills/skill ~/.claude/skills/cryptotax

# Navigate and install core dependencies
cd cryptotax-skills
npm install
```

### Environment Configuration

To unlock full historical data and multi-chain RPC access, set the following environment variables in your system:

Bash

```
export ALCHEMY_API_KEY="your_alchemy_key"   # Required for comprehensive EVM + Solana indexing
export COINGECKO_API_KEY="your_coingecko_key" # Required for deep historical asset pricing > 365 days
```

### Prompting the Skill (Inside LLM)

Plaintext

```
/cryptotax 0xa0b3a5f9628a6455dd48db57b3586434b8bc283f --year 2024 --country "United States" --method FIFO
```

### Standalone Node CLI Usage

Bash

```
npx cryptotax calculate 0xa0b3a5f9628a6455dd48db57b3586434b8bc283f --year 2024 --country "Germany" --method HIFO
```

---

## 🏗️ Taxora as Infrastructure: What Can Be Built?

Taxora is not merely a consumer product; it is foundational infrastructure. By providing accurate, real-time tax data, an entire ecosystem of secondary applications can be built on top:

- **Tax-Aware Trading Bots:** Automated systems that verify `(Expected Profit - Expected Tax > 0)` before executing any on-chain arbitrage or swap.
    
- **Audit Shield Agents:** Autonomous scripts that generate comprehensive legal memorandums and documentation for any transaction exceeding a specific fiat threshold.
    
- **DAO Shadow Accountants:** Automated compliance layers that handle tokenized payroll tracking, withholding taxes, and real-time treasury liability reporting for decentralized organizations.
    

---

## 🚧 Roadmap

Taxora is actively expanding. Upcoming milestones include:

1. **Consumer Frontend Experience:** A sleek web interface allowing non-technical users to connect their OKX Wallet (and others) with a single click.
    
2. **Expanded Multi-Chain Calculation:** Deeper native integration for complex L2 architectures, specific AppChains, and emerging non-EVM ecosystems.
    
3. **The Unified Dashboard:** A God-mode view consolidating every address, chain, and asset into one seamless, universally formatted PDF/CSV export.
    

---

## 🏁 The Endgame

The ultimate vision of Taxora is total abstraction. **You shouldn't have to calculate taxes anymore.** By embedding deterministic tax logic directly into the AI assistants and wallets you already use, tax compliance becomes entirely ambient.

Your AI just knows.
