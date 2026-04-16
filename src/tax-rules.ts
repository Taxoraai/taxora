/**
 * Country-specific cryptocurrency tax rules
 *
 * Sources:
 * - Official government tax authority websites
 * - Big 4 accounting firm crypto tax guides
 * - Last updated: 2024
 */

export type TaxRule = {
  country: string;
  code: string;

  // Capital gains rates
  shortTermRate: number;      // Held < 1 year (or country-specific threshold)
  longTermRate: number;       // Held >= 1 year
  holdingPeriodDays: number;  // Days to qualify for long-term (default 365)

  // Income tax on airdrops/staking
  incomeRate: number;

  // Special rules
  allowsLossOffset: boolean;  // Can offset gains with losses
  lossCarryForward: number;   // Years to carry forward losses (0 = none, -1 = unlimited)
  taxFreeThreshold: number;   // Annual exempt amount in USD
  longTermExempt: boolean;    // Long-term gains tax-free (e.g., Germany)

  // Flat tax regimes
  flatRate?: number;          // If set, overrides short/long term rates

  // Special taxes
  additionalTaxes?: {
    name: string;
    rate: number;
    description: string;
  }[];

  // Cost basis methods allowed
  allowedMethods: ('FIFO' | 'HIFO' | 'Avg')[];
  defaultMethod: 'FIFO' | 'HIFO' | 'Avg';

  // Notes
  notes?: string;
};

export const TAX_RULES: Record<string, TaxRule> = {
  // ═══════════════════════════════════════════════════════════════
  // AMERICAS
  // ═══════════════════════════════════════════════════════════════

  "United States": {
    country: "United States",
    code: "us",
    shortTermRate: 0.37,      // Up to 37% (ordinary income rates)
    longTermRate: 0.20,       // 0/15/20% based on income bracket
    holdingPeriodDays: 365,
    incomeRate: 0.37,
    allowsLossOffset: true,
    lossCarryForward: -1,     // Unlimited, $3k/year against ordinary income
    taxFreeThreshold: 0,
    longTermExempt: false,
    allowedMethods: ['FIFO', 'HIFO', 'Avg'],
    defaultMethod: 'FIFO',
    notes: "Wash sale rules may apply. Form 8949 required.",
  },

  "Canada": {
    country: "Canada",
    code: "ca",
    shortTermRate: 0.27,      // 50% inclusion rate × marginal rate
    longTermRate: 0.27,       // Same - no preferential long-term rate
    holdingPeriodDays: 365,
    incomeRate: 0.54,         // Full amount taxed as income
    allowsLossOffset: true,
    lossCarryForward: -1,
    taxFreeThreshold: 0,
    longTermExempt: false,
    allowedMethods: ['FIFO', 'Avg'],
    defaultMethod: 'Avg',     // ACB (Adjusted Cost Base) is standard
    notes: "50% of capital gains are taxable. Superficial loss rules apply.",
  },

  "Mexico": {
    country: "Mexico",
    code: "mx",
    shortTermRate: 0.35,
    longTermRate: 0.10,
    holdingPeriodDays: 365,
    incomeRate: 0.35,
    allowsLossOffset: true,
    lossCarryForward: 10,
    taxFreeThreshold: 0,
    longTermExempt: false,
    allowedMethods: ['FIFO', 'Avg'],
    defaultMethod: 'FIFO',
  },

  "Brazil": {
    country: "Brazil",
    code: "br",
    shortTermRate: 0.225,     // 15-22.5% progressive
    longTermRate: 0.15,
    holdingPeriodDays: 365,
    incomeRate: 0.275,
    allowsLossOffset: true,
    lossCarryForward: 0,
    taxFreeThreshold: 35000,  // ~R$35k/month exempt
    longTermExempt: false,
    allowedMethods: ['FIFO'],
    defaultMethod: 'FIFO',
    notes: "Monthly sales under R$35,000 are tax-free.",
  },

  "Argentina": {
    country: "Argentina",
    code: "ar",
    shortTermRate: 0.15,
    longTermRate: 0.15,
    holdingPeriodDays: 365,
    incomeRate: 0.35,
    allowsLossOffset: false,
    lossCarryForward: 0,
    taxFreeThreshold: 0,
    longTermExempt: false,
    allowedMethods: ['FIFO'],
    defaultMethod: 'FIFO',
    notes: "Cedular tax on capital gains. Complex inflation adjustments.",
  },

  "Chile": {
    country: "Chile",
    code: "cl",
    shortTermRate: 0.40,      // Marginal rate up to 40%
    longTermRate: 0.10,       // Único rate for long-term
    holdingPeriodDays: 365,
    incomeRate: 0.40,
    allowsLossOffset: true,
    lossCarryForward: 3,
    taxFreeThreshold: 0,
    longTermExempt: false,
    allowedMethods: ['FIFO', 'Avg'],
    defaultMethod: 'FIFO',
  },

  "Colombia": {
    country: "Colombia",
    code: "co",
    shortTermRate: 0.15,
    longTermRate: 0.10,
    holdingPeriodDays: 730,   // 2 years for long-term
    incomeRate: 0.39,
    allowsLossOffset: true,
    lossCarryForward: 12,
    taxFreeThreshold: 0,
    longTermExempt: false,
    allowedMethods: ['FIFO'],
    defaultMethod: 'FIFO',
  },

  "Peru": {
    country: "Peru",
    code: "pe",
    shortTermRate: 0.05,
    longTermRate: 0.05,
    holdingPeriodDays: 365,
    incomeRate: 0.30,
    allowsLossOffset: true,
    lossCarryForward: 4,
    taxFreeThreshold: 0,
    longTermExempt: false,
    allowedMethods: ['FIFO'],
    defaultMethod: 'FIFO',
    notes: "5% flat rate on capital gains from securities.",
  },

  // ═══════════════════════════════════════════════════════════════
  // EUROPE
  // ═══════════════════════════════════════════════════════════════

  "United Kingdom": {
    country: "United Kingdom",
    code: "gb",
    shortTermRate: 0.20,      // 10/20% based on income band
    longTermRate: 0.20,       // Same rates
    holdingPeriodDays: 365,
    incomeRate: 0.45,
    allowsLossOffset: true,
    lossCarryForward: -1,
    taxFreeThreshold: 6000,   // £6,000 annual exempt (2024-25)
    longTermExempt: false,
    allowedMethods: ['FIFO', 'Avg'],
    defaultMethod: 'Avg',     // Share pooling is standard
    notes: "Same-day and 30-day bed & breakfast rules apply.",
  },

  "Germany": {
    country: "Germany",
    code: "de",
    shortTermRate: 0.45,      // Up to 45% + solidarity surcharge
    longTermRate: 0.00,       // TAX FREE after 1 year!
    holdingPeriodDays: 365,
    incomeRate: 0.45,
    allowsLossOffset: true,
    lossCarryForward: -1,
    taxFreeThreshold: 600,    // €600 Freigrenze
    longTermExempt: true,     // KEY: Long-term is tax-free
    allowedMethods: ['FIFO'],
    defaultMethod: 'FIFO',
    notes: "Held >1 year = completely tax-free. Under €600 annual gains also exempt.",
  },

  "France": {
    country: "France",
    code: "fr",
    shortTermRate: 0.30,      // Flat tax (PFU)
    longTermRate: 0.30,
    holdingPeriodDays: 365,
    incomeRate: 0.30,
    allowsLossOffset: true,
    lossCarryForward: 0,      // Same year only
    taxFreeThreshold: 305,    // €305 annual exempt
    longTermExempt: false,
    flatRate: 0.30,           // 30% flat tax on all crypto gains
    allowedMethods: ['FIFO', 'Avg'],
    defaultMethod: 'FIFO',
    notes: "30% flat tax (12.8% income + 17.2% social contributions).",
  },

  "Spain": {
    country: "Spain",
    code: "es",
    shortTermRate: 0.28,      // 19-28% progressive
    longTermRate: 0.28,
    holdingPeriodDays: 365,
    incomeRate: 0.47,
    allowsLossOffset: true,
    lossCarryForward: 4,
    taxFreeThreshold: 0,
    longTermExempt: false,
    allowedMethods: ['FIFO'],
    defaultMethod: 'FIFO',
    notes: "Modelo 720 foreign asset declaration required for >€50k.",
  },

  "Italy": {
    country: "Italy",
    code: "it",
    shortTermRate: 0.26,
    longTermRate: 0.26,
    holdingPeriodDays: 365,
    incomeRate: 0.26,
    allowsLossOffset: true,
    lossCarryForward: 4,
    taxFreeThreshold: 2000,   // €2,000 de minimis
    longTermExempt: false,
    flatRate: 0.26,
    allowedMethods: ['FIFO', 'HIFO', 'Avg'],
    defaultMethod: 'FIFO',
    notes: "26% substitute tax. Gains under €2,000 may be exempt.",
  },

  "Netherlands": {
    country: "Netherlands",
    code: "nl",
    shortTermRate: 0.36,      // Box 3 deemed return
    longTermRate: 0.36,
    holdingPeriodDays: 365,
    incomeRate: 0.495,
    allowsLossOffset: false,  // Box 3 doesn't allow
    lossCarryForward: 0,
    taxFreeThreshold: 57000,  // ~€57k tax-free (Box 3 threshold)
    longTermExempt: false,
    allowedMethods: ['Avg'],
    defaultMethod: 'Avg',
    notes: "Taxed on deemed return (Box 3), not actual gains. Complex calculation.",
  },

  "Belgium": {
    country: "Belgium",
    code: "be",
    shortTermRate: 0.33,      // Speculative gains
    longTermRate: 0.00,       // Normal management = tax-free
    holdingPeriodDays: 365,
    incomeRate: 0.50,
    allowsLossOffset: false,
    lossCarryForward: 0,
    taxFreeThreshold: 0,
    longTermExempt: true,     // If "good householder" management
    allowedMethods: ['FIFO'],
    defaultMethod: 'FIFO',
    notes: "Tax-free if 'normal management'. Speculative trading taxed at 33%.",
  },

  "Switzerland": {
    country: "Switzerland",
    code: "ch",
    shortTermRate: 0.00,      // Generally tax-free for individuals
    longTermRate: 0.00,
    holdingPeriodDays: 365,
    incomeRate: 0.40,         // If classified as professional trader
    allowsLossOffset: false,
    lossCarryForward: 0,
    taxFreeThreshold: 0,
    longTermExempt: true,
    allowedMethods: ['FIFO'],
    defaultMethod: 'FIFO',
    notes: "Tax-free for private investors. Professional traders taxed as income.",
  },

  "Austria": {
    country: "Austria",
    code: "at",
    shortTermRate: 0.275,
    longTermRate: 0.275,
    holdingPeriodDays: 365,
    incomeRate: 0.275,
    allowsLossOffset: true,
    lossCarryForward: 0,
    taxFreeThreshold: 0,
    longTermExempt: false,
    flatRate: 0.275,
    allowedMethods: ['FIFO', 'Avg'],
    defaultMethod: 'FIFO',
    notes: "27.5% flat tax (KESt) on all crypto gains since March 2022.",
  },

  "Ireland": {
    country: "Ireland",
    code: "ie",
    shortTermRate: 0.33,
    longTermRate: 0.33,
    holdingPeriodDays: 365,
    incomeRate: 0.52,
    allowsLossOffset: true,
    lossCarryForward: -1,
    taxFreeThreshold: 1270,   // €1,270 annual exempt
    longTermExempt: false,
    allowedMethods: ['FIFO'],
    defaultMethod: 'FIFO',
    notes: "33% CGT. €1,270 annual exemption.",
  },

  "Portugal": {
    country: "Portugal",
    code: "pt",
    shortTermRate: 0.28,
    longTermRate: 0.00,       // Tax-free after 1 year
    holdingPeriodDays: 365,
    incomeRate: 0.28,
    allowsLossOffset: false,
    lossCarryForward: 0,
    taxFreeThreshold: 0,
    longTermExempt: true,
    allowedMethods: ['FIFO'],
    defaultMethod: 'FIFO',
    notes: "Short-term gains taxed at 28%. Long-term (>365 days) tax-free.",
  },

  "Sweden": {
    country: "Sweden",
    code: "se",
    shortTermRate: 0.30,
    longTermRate: 0.30,
    holdingPeriodDays: 365,
    incomeRate: 0.52,
    allowsLossOffset: true,
    lossCarryForward: 6,
    taxFreeThreshold: 0,
    longTermExempt: false,
    allowedMethods: ['Avg'],
    defaultMethod: 'Avg',
    notes: "30% flat capital gains tax. Average cost method required.",
  },

  "Norway": {
    country: "Norway",
    code: "no",
    shortTermRate: 0.22,
    longTermRate: 0.22,
    holdingPeriodDays: 365,
    incomeRate: 0.46,
    allowsLossOffset: true,
    lossCarryForward: -1,
    taxFreeThreshold: 0,
    longTermExempt: false,
    allowedMethods: ['FIFO'],
    defaultMethod: 'FIFO',
    notes: "22% flat rate. Must report to Skatteetaten.",
  },

  "Denmark": {
    country: "Denmark",
    code: "dk",
    shortTermRate: 0.42,      // Progressive up to 42%
    longTermRate: 0.42,
    holdingPeriodDays: 365,
    incomeRate: 0.56,
    allowsLossOffset: true,
    lossCarryForward: -1,
    taxFreeThreshold: 0,
    longTermExempt: false,
    allowedMethods: ['FIFO'],
    defaultMethod: 'FIFO',
    notes: "Taxed as capital income (27-42% progressive).",
  },

  "Finland": {
    country: "Finland",
    code: "fi",
    shortTermRate: 0.34,      // 30/34% progressive
    longTermRate: 0.34,
    holdingPeriodDays: 365,
    incomeRate: 0.34,
    allowsLossOffset: true,
    lossCarryForward: 5,
    taxFreeThreshold: 1000,   // €1,000 annual sales exempt
    longTermExempt: false,
    allowedMethods: ['FIFO'],
    defaultMethod: 'FIFO',
    notes: "30% on first €30k gains, 34% above. Sales under €1k/year exempt.",
  },

  "Poland": {
    country: "Poland",
    code: "pl",
    shortTermRate: 0.19,
    longTermRate: 0.19,
    holdingPeriodDays: 365,
    incomeRate: 0.32,
    allowsLossOffset: true,
    lossCarryForward: 5,
    taxFreeThreshold: 0,
    longTermExempt: false,
    flatRate: 0.19,
    allowedMethods: ['FIFO'],
    defaultMethod: 'FIFO',
    notes: "19% flat tax on capital gains.",
  },

  "Czech Republic": {
    country: "Czech Republic",
    code: "cz",
    shortTermRate: 0.15,
    longTermRate: 0.00,       // Tax-free after 3 years
    holdingPeriodDays: 1095,  // 3 years!
    incomeRate: 0.23,
    allowsLossOffset: true,
    lossCarryForward: 5,
    taxFreeThreshold: 100000, // CZK 100,000 (~$4,000)
    longTermExempt: true,
    allowedMethods: ['FIFO'],
    defaultMethod: 'FIFO',
    notes: "Tax-free if held >3 years OR annual gains <CZK 100,000.",
  },

  "Greece": {
    country: "Greece",
    code: "gr",
    shortTermRate: 0.15,
    longTermRate: 0.15,
    holdingPeriodDays: 365,
    incomeRate: 0.44,
    allowsLossOffset: true,
    lossCarryForward: 5,
    taxFreeThreshold: 0,
    longTermExempt: false,
    allowedMethods: ['FIFO'],
    defaultMethod: 'FIFO',
    notes: "15% flat rate on capital gains.",
  },

  "Turkey": {
    country: "Turkey",
    code: "tr",
    shortTermRate: 0.00,      // Currently not taxed (as of 2024)
    longTermRate: 0.00,
    holdingPeriodDays: 365,
    incomeRate: 0.40,
    allowsLossOffset: false,
    lossCarryForward: 0,
    taxFreeThreshold: 0,
    longTermExempt: true,
    allowedMethods: ['FIFO'],
    defaultMethod: 'FIFO',
    notes: "Currently no capital gains tax on crypto. Regulations may change.",
  },

  // ═══════════════════════════════════════════════════════════════
  // ASIA
  // ═══════════════════════════════════════════════════════════════

  "India": {
    country: "India",
    code: "in",
    shortTermRate: 0.30,
    longTermRate: 0.30,       // No preferential rate
    holdingPeriodDays: 365,
    incomeRate: 0.30,
    allowsLossOffset: false,  // KEY: Cannot offset losses
    lossCarryForward: 0,
    taxFreeThreshold: 0,
    longTermExempt: false,
    flatRate: 0.30,
    additionalTaxes: [
      { name: "TDS", rate: 0.01, description: "1% TDS on transfers over ₹10,000" },
      { name: "Surcharge", rate: 0.04, description: "4% health & education cess" },
    ],
    allowedMethods: ['FIFO'],
    defaultMethod: 'FIFO',
    notes: "Strict 30% flat tax. NO loss offsetting. 1% TDS on transfers.",
  },

  "Japan": {
    country: "Japan",
    code: "jp",
    shortTermRate: 0.55,      // Up to 55% (miscellaneous income)
    longTermRate: 0.55,       // No preferential rate
    holdingPeriodDays: 365,
    incomeRate: 0.55,
    allowsLossOffset: true,   // Only within miscellaneous income
    lossCarryForward: 3,
    taxFreeThreshold: 200000, // ¥200,000 (~$1,300)
    longTermExempt: false,
    allowedMethods: ['FIFO', 'Avg'],
    defaultMethod: 'Avg',     // Total average method preferred
    notes: "Taxed as miscellaneous income (up to 55%). ¥200,000 exempt threshold.",
  },

  "South Korea": {
    country: "South Korea",
    code: "kr",
    shortTermRate: 0.22,      // 20% + 2% local
    longTermRate: 0.22,
    holdingPeriodDays: 365,
    incomeRate: 0.45,
    allowsLossOffset: true,
    lossCarryForward: 5,
    taxFreeThreshold: 2500000, // KRW 2.5M (~$1,900)
    longTermExempt: false,
    allowedMethods: ['FIFO', 'Avg'],
    defaultMethod: 'FIFO',
    notes: "20% tax on gains over KRW 2.5M annually. Deferred to 2025.",
  },

  "Singapore": {
    country: "Singapore",
    code: "sg",
    shortTermRate: 0.00,      // No capital gains tax
    longTermRate: 0.00,
    holdingPeriodDays: 365,
    incomeRate: 0.22,         // If trading is business
    allowsLossOffset: false,
    lossCarryForward: 0,
    taxFreeThreshold: 0,
    longTermExempt: true,
    allowedMethods: ['FIFO'],
    defaultMethod: 'FIFO',
    notes: "No capital gains tax for individuals. Business trading taxed as income.",
  },

  "Hong Kong": {
    country: "Hong Kong",
    code: "hk",
    shortTermRate: 0.00,      // No capital gains tax
    longTermRate: 0.00,
    holdingPeriodDays: 365,
    incomeRate: 0.17,         // If trading is business
    allowsLossOffset: false,
    lossCarryForward: 0,
    taxFreeThreshold: 0,
    longTermExempt: true,
    allowedMethods: ['FIFO'],
    defaultMethod: 'FIFO',
    notes: "No capital gains tax. Business profits taxed at 16.5%.",
  },

  "Taiwan": {
    country: "Taiwan",
    code: "tw",
    shortTermRate: 0.00,      // Currently exempt
    longTermRate: 0.00,
    holdingPeriodDays: 365,
    incomeRate: 0.40,
    allowsLossOffset: false,
    lossCarryForward: 0,
    taxFreeThreshold: 0,
    longTermExempt: true,
    allowedMethods: ['FIFO'],
    defaultMethod: 'FIFO',
    notes: "Crypto gains currently not taxed. Regulations evolving.",
  },

  "China": {
    country: "China",
    code: "cn",
    shortTermRate: 0.20,      // If declared
    longTermRate: 0.20,
    holdingPeriodDays: 365,
    incomeRate: 0.45,
    allowsLossOffset: true,
    lossCarryForward: 0,
    taxFreeThreshold: 0,
    longTermExempt: false,
    allowedMethods: ['FIFO'],
    defaultMethod: 'FIFO',
    notes: "Crypto trading banned for residents. Complex legal status.",
  },

  "Indonesia": {
    country: "Indonesia",
    code: "id",
    shortTermRate: 0.001,     // 0.1% transaction tax
    longTermRate: 0.001,
    holdingPeriodDays: 365,
    incomeRate: 0.35,
    allowsLossOffset: false,
    lossCarryForward: 0,
    taxFreeThreshold: 0,
    longTermExempt: false,
    flatRate: 0.001,          // 0.1% flat on each trade
    allowedMethods: ['FIFO'],
    defaultMethod: 'FIFO',
    notes: "0.1% VAT + 0.1% income tax on each crypto transaction.",
  },

  "Philippines": {
    country: "Philippines",
    code: "ph",
    shortTermRate: 0.15,
    longTermRate: 0.15,
    holdingPeriodDays: 365,
    incomeRate: 0.35,
    allowsLossOffset: true,
    lossCarryForward: 3,
    taxFreeThreshold: 0,
    longTermExempt: false,
    allowedMethods: ['FIFO'],
    defaultMethod: 'FIFO',
    notes: "15% final tax on capital gains. Regulations still developing.",
  },

  "Vietnam": {
    country: "Vietnam",
    code: "vn",
    shortTermRate: 0.00,      // No clear framework yet
    longTermRate: 0.00,
    holdingPeriodDays: 365,
    incomeRate: 0.35,
    allowsLossOffset: false,
    lossCarryForward: 0,
    taxFreeThreshold: 0,
    longTermExempt: true,
    allowedMethods: ['FIFO'],
    defaultMethod: 'FIFO',
    notes: "No clear crypto tax framework. Trading technically illegal but unenforced.",
  },

  "Thailand": {
    country: "Thailand",
    code: "th",
    shortTermRate: 0.15,
    longTermRate: 0.15,
    holdingPeriodDays: 365,
    incomeRate: 0.35,
    allowsLossOffset: true,
    lossCarryForward: 0,
    taxFreeThreshold: 0,
    longTermExempt: false,
    allowedMethods: ['FIFO'],
    defaultMethod: 'FIFO',
    notes: "15% withholding tax on gains. Losses can offset gains within same year.",
  },

  "Malaysia": {
    country: "Malaysia",
    code: "my",
    shortTermRate: 0.00,      // Generally tax-free
    longTermRate: 0.00,
    holdingPeriodDays: 365,
    incomeRate: 0.28,         // If trading is business
    allowsLossOffset: false,
    lossCarryForward: 0,
    taxFreeThreshold: 0,
    longTermExempt: true,
    allowedMethods: ['FIFO'],
    defaultMethod: 'FIFO',
    notes: "No capital gains tax. Active trading may be taxed as income.",
  },

  "Pakistan": {
    country: "Pakistan",
    code: "pk",
    shortTermRate: 0.15,
    longTermRate: 0.15,
    holdingPeriodDays: 365,
    incomeRate: 0.35,
    allowsLossOffset: true,
    lossCarryForward: 3,
    taxFreeThreshold: 0,
    longTermExempt: false,
    allowedMethods: ['FIFO'],
    defaultMethod: 'FIFO',
    notes: "15% tax on capital gains. Crypto legal status unclear.",
  },

  "Bangladesh": {
    country: "Bangladesh",
    code: "bd",
    shortTermRate: 0.15,
    longTermRate: 0.15,
    holdingPeriodDays: 365,
    incomeRate: 0.30,
    allowsLossOffset: true,
    lossCarryForward: 0,
    taxFreeThreshold: 0,
    longTermExempt: false,
    allowedMethods: ['FIFO'],
    defaultMethod: 'FIFO',
    notes: "Crypto officially banned but widely used. Tax treatment unclear.",
  },

  // ═══════════════════════════════════════════════════════════════
  // MIDDLE EAST
  // ═══════════════════════════════════════════════════════════════

  "UAE": {
    country: "UAE",
    code: "ae",
    shortTermRate: 0.00,      // No personal income tax
    longTermRate: 0.00,
    holdingPeriodDays: 365,
    incomeRate: 0.00,
    allowsLossOffset: false,
    lossCarryForward: 0,
    taxFreeThreshold: 0,
    longTermExempt: true,
    allowedMethods: ['FIFO'],
    defaultMethod: 'FIFO',
    notes: "No personal income or capital gains tax. Crypto-friendly jurisdiction.",
  },

  "Saudi Arabia": {
    country: "Saudi Arabia",
    code: "sa",
    shortTermRate: 0.00,      // No personal income tax
    longTermRate: 0.00,
    holdingPeriodDays: 365,
    incomeRate: 0.00,
    allowsLossOffset: false,
    lossCarryForward: 0,
    taxFreeThreshold: 0,
    longTermExempt: true,
    allowedMethods: ['FIFO'],
    defaultMethod: 'FIFO',
    notes: "No personal income tax. Crypto trading discouraged but not taxed.",
  },

  "Israel": {
    country: "Israel",
    code: "il",
    shortTermRate: 0.25,
    longTermRate: 0.25,
    holdingPeriodDays: 365,
    incomeRate: 0.50,
    allowsLossOffset: true,
    lossCarryForward: -1,
    taxFreeThreshold: 0,
    longTermExempt: false,
    allowedMethods: ['FIFO'],
    defaultMethod: 'FIFO',
    notes: "25% capital gains tax. Must report foreign assets.",
  },

  // ═══════════════════════════════════════════════════════════════
  // AFRICA
  // ═══════════════════════════════════════════════════════════════

  "South Africa": {
    country: "South Africa",
    code: "za",
    shortTermRate: 0.18,      // 40% × 45% max marginal
    longTermRate: 0.18,
    holdingPeriodDays: 365,
    incomeRate: 0.45,
    allowsLossOffset: true,
    lossCarryForward: -1,
    taxFreeThreshold: 40000,  // R40,000 annual exclusion
    longTermExempt: false,
    allowedMethods: ['FIFO', 'Avg'],
    defaultMethod: 'FIFO',
    notes: "40% of gains included in income. R40k annual exclusion.",
  },

  "Nigeria": {
    country: "Nigeria",
    code: "ng",
    shortTermRate: 0.10,
    longTermRate: 0.10,
    holdingPeriodDays: 365,
    incomeRate: 0.24,
    allowsLossOffset: true,
    lossCarryForward: 4,
    taxFreeThreshold: 0,
    longTermExempt: false,
    allowedMethods: ['FIFO'],
    defaultMethod: 'FIFO',
    notes: "10% CGT. Crypto banned by central bank but widely used.",
  },

  "Kenya": {
    country: "Kenya",
    code: "ke",
    shortTermRate: 0.15,      // 15% CGT
    longTermRate: 0.15,
    holdingPeriodDays: 365,
    incomeRate: 0.30,
    allowsLossOffset: true,
    lossCarryForward: 0,
    taxFreeThreshold: 0,
    longTermExempt: false,
    allowedMethods: ['FIFO'],
    defaultMethod: 'FIFO',
    notes: "15% capital gains tax introduced. 3% digital asset tax proposed.",
  },

  "Egypt": {
    country: "Egypt",
    code: "eg",
    shortTermRate: 0.225,
    longTermRate: 0.225,
    holdingPeriodDays: 365,
    incomeRate: 0.225,
    allowsLossOffset: true,
    lossCarryForward: 3,
    taxFreeThreshold: 0,
    longTermExempt: false,
    allowedMethods: ['FIFO'],
    defaultMethod: 'FIFO',
    notes: "22.5% tax rate. Crypto status unclear, consider as capital gains.",
  },

  // ═══════════════════════════════════════════════════════════════
  // OCEANIA
  // ═══════════════════════════════════════════════════════════════

  "Australia": {
    country: "Australia",
    code: "au",
    shortTermRate: 0.47,      // Marginal rate
    longTermRate: 0.235,      // 50% CGT discount after 12 months
    holdingPeriodDays: 365,
    incomeRate: 0.47,
    allowsLossOffset: true,
    lossCarryForward: -1,
    taxFreeThreshold: 0,
    longTermExempt: false,
    allowedMethods: ['FIFO', 'HIFO', 'Avg'],
    defaultMethod: 'FIFO',
    notes: "50% CGT discount for assets held >12 months. Personal use asset exemption for items <$10k.",
  },

  "New Zealand": {
    country: "New Zealand",
    code: "nz",
    shortTermRate: 0.39,      // Marginal rate if taxable
    longTermRate: 0.39,
    holdingPeriodDays: 365,
    incomeRate: 0.39,
    allowsLossOffset: true,
    lossCarryForward: -1,
    taxFreeThreshold: 0,
    longTermExempt: false,
    allowedMethods: ['FIFO', 'Avg'],
    defaultMethod: 'FIFO',
    notes: "No official CGT but may be taxed as income if trading with profit intent.",
  },
};

/**
 * Get tax rules for a country
 */
export function getTaxRules(country: string): TaxRule {
  return TAX_RULES[country] ?? {
    // Default rules for unknown countries
    country,
    code: "xx",
    shortTermRate: 0.20,
    longTermRate: 0.20,
    holdingPeriodDays: 365,
    incomeRate: 0.20,
    allowsLossOffset: true,
    lossCarryForward: 0,
    taxFreeThreshold: 0,
    longTermExempt: false,
    allowedMethods: ['FIFO', 'HIFO', 'Avg'],
    defaultMethod: 'FIFO',
    notes: "Default rates applied. Please verify with local tax authority.",
  };
}

/**
 * Calculate tax based on country rules
 */
export function calculateTax(
  country: string,
  shortTermGains: number,
  longTermGains: number,
  losses: number,
  income: number,
): {
  totalTax: number;
  shortTermTax: number;
  longTermTax: number;
  incomeTax: number;
  netGains: number;
  effectiveRate: number;
  breakdown: string[];
} {
  const rules = getTaxRules(country);
  const breakdown: string[] = [];

  // Apply loss offset if allowed
  let netShortTerm = shortTermGains;
  let netLongTerm = longTermGains;
  let remainingLosses = losses;

  if (rules.allowsLossOffset && losses > 0) {
    // Offset short-term gains first
    const shortTermOffset = Math.min(netShortTerm, remainingLosses);
    netShortTerm -= shortTermOffset;
    remainingLosses -= shortTermOffset;
    if (shortTermOffset > 0) {
      breakdown.push(`Offset $${shortTermOffset.toFixed(0)} losses against short-term gains`);
    }

    // Then offset long-term gains
    const longTermOffset = Math.min(netLongTerm, remainingLosses);
    netLongTerm -= longTermOffset;
    remainingLosses -= longTermOffset;
    if (longTermOffset > 0) {
      breakdown.push(`Offset $${longTermOffset.toFixed(0)} losses against long-term gains`);
    }

    if (remainingLosses > 0 && rules.lossCarryForward !== 0) {
      breakdown.push(`$${remainingLosses.toFixed(0)} losses available for carry-forward`);
    }
  } else if (!rules.allowsLossOffset && losses > 0) {
    breakdown.push(`${country}: Loss offsetting NOT allowed`);
  }

  // Apply tax-free threshold
  let totalGains = netShortTerm + netLongTerm;
  if (rules.taxFreeThreshold > 0 && totalGains <= rules.taxFreeThreshold) {
    breakdown.push(`Under ${country} tax-free threshold ($${rules.taxFreeThreshold})`);
    return {
      totalTax: 0,
      shortTermTax: 0,
      longTermTax: 0,
      incomeTax: income * rules.incomeRate,
      netGains: totalGains,
      effectiveRate: 0,
      breakdown,
    };
  }

  // Calculate taxes
  let shortTermTax = 0;
  let longTermTax = 0;
  let incomeTax = income * rules.incomeRate;

  if (rules.flatRate !== undefined) {
    // Flat tax regime
    shortTermTax = netShortTerm * rules.flatRate;
    longTermTax = netLongTerm * rules.flatRate;
    breakdown.push(`${country} flat rate: ${(rules.flatRate * 100).toFixed(1)}%`);
  } else {
    // Short-term gains
    shortTermTax = netShortTerm * rules.shortTermRate;
    if (netShortTerm > 0) {
      breakdown.push(`Short-term gains: $${netShortTerm.toFixed(0)} × ${(rules.shortTermRate * 100).toFixed(1)}% = $${shortTermTax.toFixed(0)}`);
    }

    // Long-term gains
    if (rules.longTermExempt) {
      longTermTax = 0;
      if (netLongTerm > 0) {
        breakdown.push(`Long-term gains: $${netLongTerm.toFixed(0)} (TAX-FREE in ${country})`);
      }
    } else {
      longTermTax = netLongTerm * rules.longTermRate;
      if (netLongTerm > 0) {
        breakdown.push(`Long-term gains: $${netLongTerm.toFixed(0)} × ${(rules.longTermRate * 100).toFixed(1)}% = $${longTermTax.toFixed(0)}`);
      }
    }
  }

  // Income tax
  if (income > 0) {
    breakdown.push(`Crypto income: $${income.toFixed(0)} × ${(rules.incomeRate * 100).toFixed(1)}% = $${incomeTax.toFixed(0)}`);
  }

  // Additional taxes (e.g., India TDS)
  let additionalTax = 0;
  if (rules.additionalTaxes) {
    for (const tax of rules.additionalTaxes) {
      const amount = (shortTermGains + longTermGains + income) * tax.rate;
      additionalTax += amount;
      breakdown.push(`${tax.name}: ${tax.description} = $${amount.toFixed(0)}`);
    }
  }

  const totalTax = shortTermTax + longTermTax + incomeTax + additionalTax;
  const totalTaxable = netShortTerm + netLongTerm + income;
  const effectiveRate = totalTaxable > 0 ? totalTax / totalTaxable : 0;

  return {
    totalTax,
    shortTermTax,
    longTermTax,
    incomeTax,
    netGains: netShortTerm + netLongTerm,
    effectiveRate,
    breakdown,
  };
}
