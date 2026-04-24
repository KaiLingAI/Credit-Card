import React, { useState, useMemo, useEffect } from "react";

// ─────────────────────────────────────────────────────────────
// CARD DATA — Updated for 2026
// Sources: MileLion 2026 Credit Card Strategy (10 Jan 2026) + LobangSis card reviews
// Last verified: 23 April 2026
//
// IMPORTANT: Card terms change frequently. Always verify current rates
// with the issuer before making decisions.
// ─────────────────────────────────────────────────────────────
const CARDS_DATA = {
  schemaVersion: "2.0",
  currency: "SGD",
  lastUpdated: "2026-04-23",
  milesValuation: 0.015,
  cards: [
    {
      id: "citi-rewards",
      cardName: "Citi Rewards Card",
      issuer: "Citibank",
      rewardType: "Miles",
      baseEarnRate: { rate: 0.4, unit: "miles_per_sgd" },
      bonusEarnRates: [
        {
          rate: 4.0,
          unit: "miles_per_sgd",
          eligibleCategories: ["Online Shopping", "Food Delivery", "Entertainment", "Ride-hailing", "Atome"],
          conditions: "Max S$1,000 per statement month. Excludes travel (airlines, hotels, cruises, car rental). Excludes in-app mobile wallets.",
        },
      ],
      minMonthlySpend: 0,
      monthlySpendCap: 1000,
      capPeriod: "statement",
      notes: "Points valid 5 years. 11 transfer partners. Best for online non-travel spend.",
    },
    {
      id: "dbs-womans-world",
      cardName: "DBS Woman's World Card",
      issuer: "DBS",
      rewardType: "Miles",
      baseEarnRate: { rate: 0.4, unit: "miles_per_sgd" },
      bonusEarnRates: [
        {
          rate: 4.0,
          unit: "miles_per_sgd",
          eligibleCategories: ["Online Shopping", "Flights", "Hotels", "Food Delivery", "Entertainment", "Atome"],
          conditions: "Max S$1,000 per calendar month (nerfed from S$2K in Aug 2025).",
        },
      ],
      minMonthlySpend: 0,
      monthlySpendCap: 1000,
      capPeriod: "calendar",
      notes: "Points valid 1 year. 4 transfer partners. Unlike Citi Rewards, covers travel online bookings.",
    },
    {
      id: "dbs-yuu",
      cardName: "DBS yuu Card (Visa/Amex)",
      issuer: "DBS",
      rewardType: "Miles",
      baseEarnRate: { rate: 0.4, unit: "miles_per_sgd" },
      bonusEarnRates: [
        {
          rate: 10.0,
          unit: "miles_per_sgd",
          eligibleCategories: ["Groceries", "Dining", "Food Delivery", "Transport", "Telco", "Pharmacy"],
          conditions: "Min S$800 per calendar month. Must transact at 4+ participating merchants (Cold Storage, Giant, foodpanda, Guardian, Singtel, 7-Eleven, CHAGEE, Gojek, SimplyGo, etc.). Cap also S$800.",
        },
      ],
      minMonthlySpend: 800,
      monthlySpendCap: 800,
      capPeriod: "calendar",
      notes: "10 mpd is the highest earn rate available in SG — but only at yuu merchants.",
    },
    {
      id: "hsbc-revolution",
      cardName: "HSBC Revolution Card",
      issuer: "HSBC",
      rewardType: "Miles",
      baseEarnRate: { rate: 0.4, unit: "miles_per_sgd" },
      bonusEarnRates: [
        {
          rate: 4.0,
          unit: "miles_per_sgd",
          eligibleCategories: ["Dining", "Atome", "Flights", "Hotels", "Online Shopping", "Entertainment", "Transport"],
          conditions: "Cap S$1,500 per calendar month (boosted rate ends 31 Mar 2026, reverts to S$1,000). No min spend. Excludes fast food (MCC 5814).",
        },
      ],
      minMonthlySpend: 0,
      monthlySpendCap: 1500,
      capPeriod: "calendar",
      notes: "No annual fee. HSBC points are highly flexible — 16 airline + 4 hotel transfer partners.",
    },
    {
      id: "krisflyer-uob",
      cardName: "KrisFlyer UOB Credit Card",
      issuer: "UOB",
      rewardType: "Miles",
      baseEarnRate: { rate: 1.2, unit: "miles_per_sgd" },
      bonusEarnRates: [
        {
          rate: 3.0,
          unit: "miles_per_sgd",
          eligibleCategories: ["Flights", "Hotels"],
          conditions: "SIA Group (SQ, Scoot, KrisShop, Kris+, Pelago). Uncapped. Min S$1,000/year SIA Group spend to unlock 3 mpd on general.",
        },
      ],
      minMonthlySpend: 0,
      monthlySpendCap: null,
      capPeriod: "none",
      notes: "Uncapped 3 mpd on SIA Group. Earns direct KrisFlyer miles (no conversion fee).",
    },
    {
      id: "maybank-world-mc",
      cardName: "Maybank World Mastercard",
      issuer: "Maybank",
      rewardType: "Miles",
      baseEarnRate: { rate: 0.4, unit: "miles_per_sgd" },
      bonusEarnRates: [
        {
          rate: 4.0,
          unit: "miles_per_sgd",
          eligibleCategories: ["Petrol"],
          conditions: "Uncapped 4 mpd at all petrol stations in SG (in-person only). Shell has extra 15% discount.",
        },
        {
          rate: 3.2,
          unit: "miles_per_sgd",
          eligibleCategories: ["Foreign Currency"],
          conditions: "Min S$4,000/month. 2.8 mpd if spend is S$800-S$4,000. Uncapped.",
        },
      ],
      minMonthlySpend: 0,
      monthlySpendCap: null,
      capPeriod: "none",
      notes: "Best uncapped option for petrol and big-ticket FCY. TREATS points.",
    },
    {
      id: "maybank-xl-rewards",
      cardName: "Maybank XL Rewards Card",
      issuer: "Maybank",
      rewardType: "Miles",
      baseEarnRate: { rate: 0.4, unit: "miles_per_sgd" },
      bonusEarnRates: [
        {
          rate: 4.0,
          unit: "miles_per_sgd",
          eligibleCategories: ["Dining", "Flights", "Hotels", "Foreign Currency", "Online Shopping", "Entertainment"],
          conditions: "Min S$500, max S$1,000 per calendar month. Launched Jul 2025.",
        },
      ],
      minMonthlySpend: 500,
      monthlySpendCap: 1000,
      capPeriod: "calendar",
      notes: "Strong all-rounder. Utilities no longer earn from Dec 2025.",
    },
    {
      id: "ocbc-rewards",
      cardName: "OCBC Rewards Card",
      issuer: "OCBC",
      rewardType: "Miles",
      baseEarnRate: { rate: 0.4, unit: "miles_per_sgd" },
      bonusEarnRates: [
        {
          rate: 6.0,
          unit: "miles_per_sgd",
          eligibleCategories: ["Online Shopping"],
          conditions: "Shopee, Lazada, Taobao, TikTok Shop, Watsons only. Cap S$1,000/calendar month. Promo extended to 30 Jun 2026.",
        },
        {
          rate: 4.0,
          unit: "miles_per_sgd",
          eligibleCategories: ["Dining"],
          conditions: "HeyMax vouchers also qualify. Cap S$1,110 per calendar month combined.",
        },
      ],
      minMonthlySpend: 0,
      monthlySpendCap: 1110,
      capPeriod: "calendar",
      notes: "6 mpd promo for e-commerce is outstanding while it lasts.",
    },
    {
      id: "uob-preferred-platinum-visa",
      cardName: "UOB Preferred Platinum Visa",
      issuer: "UOB",
      rewardType: "Miles",
      baseEarnRate: { rate: 0.4, unit: "miles_per_sgd" },
      bonusEarnRates: [
        {
          rate: 4.0,
          unit: "miles_per_sgd",
          eligibleCategories: ["Mobile Contactless", "Transport"],
          conditions: "S$600 cap per calendar month for mobile contactless (Apple/Google/Samsung Pay). Split cap since Oct 2025.",
        },
        {
          rate: 4.0,
          unit: "miles_per_sgd",
          eligibleCategories: ["Online Shopping", "Food Delivery", "Entertainment", "Groceries"],
          conditions: "Separate S$600 cap per calendar month for selected online transactions.",
        },
      ],
      minMonthlySpend: 0,
      monthlySpendCap: 1200,
      capPeriod: "calendar",
      notes: "Two separate S$600 sub-caps. Physical card does NOT earn bonus — must use mobile wallet.",
    },
    {
      id: "uob-visa-signature",
      cardName: "UOB Visa Signature",
      issuer: "UOB",
      rewardType: "Miles",
      baseEarnRate: { rate: 0.4, unit: "miles_per_sgd" },
      bonusEarnRates: [
        {
          rate: 4.0,
          unit: "miles_per_sgd",
          eligibleCategories: ["Contactless", "Transport", "Petrol"],
          conditions: "Min S$1,000, max S$1,200 per statement month (SGD contactless category).",
        },
        {
          rate: 4.0,
          unit: "miles_per_sgd",
          eligibleCategories: ["Foreign Currency"],
          conditions: "Min S$1,000, max S$1,200 per statement month (FCY category — separate sub-cap).",
        },
      ],
      minMonthlySpend: 1000,
      monthlySpendCap: 2400,
      capPeriod: "statement",
      notes: "Two S$1,200 sub-caps (SGD contactless + FCY). Min spend applies per sub-cap.",
    },
    {
      id: "uob-ladys-solitaire",
      cardName: "UOB Lady's Solitaire",
      issuer: "UOB",
      rewardType: "Miles",
      baseEarnRate: { rate: 0.4, unit: "miles_per_sgd" },
      bonusEarnRates: [
        {
          rate: 4.0,
          unit: "miles_per_sgd",
          eligibleCategories: ["Dining", "Online Shopping", "Transport", "Entertainment", "Beauty", "Travel"],
          conditions: "Max S$750 per calendar month across each of 2 chosen categories (S$1,500 total). Split sub-caps since Aug 2025.",
        },
      ],
      minMonthlySpend: 0,
      monthlySpendCap: 1500,
      capPeriod: "calendar",
      notes: "Choose 2 bonus categories quarterly. Extra 2 mpd with UOB Lady's Savings Account + S$10K deposit.",
    },
    {
      id: "amex-krisflyer-ascend",
      cardName: "AMEX KrisFlyer Ascend",
      issuer: "American Express",
      rewardType: "Miles",
      baseEarnRate: { rate: 1.2, unit: "miles_per_sgd" },
      bonusEarnRates: [
        {
          rate: 2.0,
          unit: "miles_per_sgd",
          eligibleCategories: ["Flights", "Ride-hailing"],
          conditions: "SIA/Scoot/KrisShop uncapped; Grab capped S$200/calendar month.",
        },
      ],
      minMonthlySpend: 0,
      monthlySpendCap: null,
      capPeriod: "none",
      notes: "Includes KrisFlyer Elite Gold fast-track and 1 free Hilton night. Annual fee S$397.85.",
    },
    {
      id: "maybank-horizon",
      cardName: "Maybank Horizon Visa Signature",
      issuer: "Maybank",
      rewardType: "Miles",
      baseEarnRate: { rate: 0.4, unit: "miles_per_sgd" },
      bonusEarnRates: [
        {
          rate: 2.8,
          unit: "miles_per_sgd",
          eligibleCategories: ["Flights", "Foreign Currency"],
          conditions: "Min S$800/month. Cap S$10,000/month. Air tickets + uncapped FCY.",
        },
      ],
      minMonthlySpend: 800,
      monthlySpendCap: 10000,
      capPeriod: "calendar",
      notes: "Good for big-ticket flight purchases where other caps are insufficient.",
    },
    {
      id: "stanchart-smart",
      cardName: "StanChart Smart Card",
      issuer: "Standard Chartered",
      rewardType: "Miles",
      baseEarnRate: { rate: 0.4, unit: "miles_per_sgd" },
      bonusEarnRates: [
        {
          rate: 9.3,
          unit: "miles_per_sgd",
          eligibleCategories: ["Transport", "Entertainment", "EV Charging"],
          conditions: "Min S$1,500 per statement month for 9.3 mpd. 7.4 mpd if spend is S$800-S$1,500. Streaming, public transport, EV charging, fast food only.",
        },
      ],
      minMonthlySpend: 800,
      monthlySpendCap: null,
      capPeriod: "statement",
      notes: "Uncapped 9.3 mpd if you can hit the S$1,500 min spend on niche categories.",
    },
    {
      id: "citi-cashback",
      cardName: "Citi Cash Back Card",
      issuer: "Citibank",
      rewardType: "Cashback",
      baseEarnRate: { rate: 0.25, unit: "percent" },
      bonusEarnRates: [
        {
          rate: 8.0,
          unit: "percent",
          eligibleCategories: ["Petrol", "Ride-hailing"],
          conditions: "Min S$800 per statement month. Also 6% on Dining & Groceries.",
        },
        {
          rate: 6.0,
          unit: "percent",
          eligibleCategories: ["Dining", "Groceries"],
          conditions: "Min S$800 per statement month. Cashback capped at S$80/statement month total.",
        },
      ],
      minMonthlySpend: 800,
      monthlySpendCap: 1000,
      capPeriod: "statement",
      notes: "For cashback lovers. Max effective S$80 cashback requires ~S$1,000+ spend in bonus categories.",
    },
  ],
};

// All categories surfaced in the dropdown
const CATEGORIES = [
  "Dining",
  "Groceries",
  "Food Delivery",
  "Online Shopping",
  "Mobile Contactless",
  "Contactless",
  "Transport",
  "Ride-hailing",
  "Petrol",
  "Flights",
  "Hotels",
  "Foreign Currency",
  "Atome",
  "Entertainment",
  "Telco",
  "Pharmacy",
  "Beauty",
  "Travel",
  "EV Charging",
];

const STORAGE_KEY = "cardOptimizer:userState:v2";

// ─────────────────────────────────────────────────────────────
// CORE LOGIC
// ─────────────────────────────────────────────────────────────
function findBestBonusTier(card, category) {
  if (!card.bonusEarnRates?.length) return null;
  const matches = card.bonusEarnRates.filter((tier) => {
    const cats = tier.eligibleCategories || [];
    return cats.includes("All") || cats.some((c) => c.toLowerCase() === category.toLowerCase());
  });
  if (!matches.length) return null;
  return matches.reduce((best, curr) => (curr.rate > best.rate ? curr : best));
}

function evaluateCard(card, amount, category, milesValuation, preference, alreadySpent) {
  const tier = findBestBonusTier(card, category);
  if (!tier) return { cardId: card.id, cardName: card.cardName, eligible: false };

  if (preference === "Miles" && card.rewardType !== "Miles") return { cardId: card.id, eligible: false };
  if (preference === "Cashback" && card.rewardType !== "Cashback") return { cardId: card.id, eligible: false };

  const spendCap = card.monthlySpendCap ?? Infinity;
  const remainingCap = Math.max(0, spendCap - alreadySpent);
  const bonusSpend = Math.min(amount, remainingCap);
  const baseSpend = amount - bonusSpend;
  const partiallyCapped = baseSpend > 0 && bonusSpend > 0;

  const bonusRate = tier.rate;
  const baseRate = card.baseEarnRate.rate;

  let bonusReward, baseReward, totalNative, totalSGD;
  if (card.rewardType === "Cashback") {
    bonusReward = (bonusSpend * bonusRate) / 100;
    baseReward = (baseSpend * baseRate) / 100;
    totalNative = bonusReward + baseReward;
    totalSGD = totalNative;
  } else {
    bonusReward = bonusSpend * bonusRate;
    baseReward = baseSpend * baseRate;
    totalNative = bonusReward + baseReward;
    totalSGD = totalNative * milesValuation;
  }

  return {
    cardId: card.id,
    cardName: card.cardName,
    issuer: card.issuer,
    rewardType: card.rewardType,
    eligible: true,
    bonusRate,
    baseRate,
    bonusSpend,
    baseSpend,
    partiallyCapped,
    remainingCap: spendCap === Infinity ? null : remainingCap,
    totalNative: parseFloat(totalNative.toFixed(2)),
    totalReturnSGD: parseFloat(totalSGD.toFixed(2)),
    nativeUnit: card.rewardType === "Cashback" ? "SGD" : "miles",
    minMonthlySpend: card.minMonthlySpend,
    monthlySpendCap: card.monthlySpendCap,
    capPeriod: card.capPeriod,
    conditions: tier.conditions,
    notes: card.notes,
  };
}

function evaluateExpense({ amount, category, preference, milesValuation, ownedCards, monthlyUsage, includeUnowned }) {
  if (!amount || amount <= 0 || !category) return { best: null, runnerUp: null, unownedSuggestion: null };

  // Scope to wallet first (this is the priority)
  const walletPool = CARDS_DATA.cards.filter((c) => ownedCards.includes(c.id));
  const unownedPool = CARDS_DATA.cards.filter((c) => !ownedCards.includes(c.id));

  const walletResults = walletPool
    .map((c) => evaluateCard(c, amount, category, milesValuation, preference, monthlyUsage[c.id] || 0))
    .filter((r) => r.eligible)
    .sort((a, b) => b.totalReturnSGD - a.totalReturnSGD);

  let unownedSuggestion = null;
  if (includeUnowned && unownedPool.length > 0) {
    const unownedResults = unownedPool
      .map((c) => evaluateCard(c, amount, category, milesValuation, preference, 0))
      .filter((r) => r.eligible)
      .sort((a, b) => b.totalReturnSGD - a.totalReturnSGD);

    // Only suggest unowned if it would materially beat the best wallet card
    if (unownedResults[0]) {
      const bestWalletReturn = walletResults[0]?.totalReturnSGD ?? 0;
      if (unownedResults[0].totalReturnSGD > bestWalletReturn * 1.25) {
        unownedSuggestion = unownedResults[0];
      }
    }
  }

  return {
    best: walletResults[0] || null,
    runnerUp: walletResults[1] || null,
    unownedSuggestion,
    noWallet: walletPool.length === 0,
  };
}

// ─────────────────────────────────────────────────────────────
// STORAGE
// ─────────────────────────────────────────────────────────────
function loadUserState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error("Load failed:", e);
  }
  return {
    ownedCards: [], // Empty by default — user sets up their wallet first
    monthlyUsage: {},
    month: new Date().toISOString().slice(0, 7),
    hasCompletedSetup: false,
  };
}

function saveUserState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error("Save failed:", e);
  }
}

// ─────────────────────────────────────────────────────────────
// UI COMPONENTS
// ─────────────────────────────────────────────────────────────
const PreferenceToggle = ({ value, onChange }) => {
  const options = [
    { id: "Auto", label: "Auto" },
    { id: "Miles", label: "Miles only" },
    { id: "Cashback", label: "Cashback only" },
  ];
  return (
    <div role="radiogroup" aria-label="Reward preference" className="flex flex-wrap gap-3">
      {options.map((opt) => {
        const active = value === opt.id;
        return (
          <button
            key={opt.id}
            role="radio"
            aria-checked={active}
            onClick={() => onChange(opt.id)}
            className={`px-5 py-3 rounded-lg border-2 font-bold transition-colors ${
              active
                ? "border-[#5a6b5a] bg-[#e8e2d5] text-[#2d3a2d]"
                : "border-[#c4b8a8] bg-white text-[#5a5648] hover:border-[#8a8375]"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
};

const SettingsDrawer = ({ open, onClose, ownedCards, monthlyUsage, onToggleCard, onUpdateUsage, onResetMonth }) => (
  <>
    <div
      className={`fixed inset-0 bg-[#2d3a2d]/60 transition-opacity duration-300 z-40 ${
        open ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      onClick={onClose}
      aria-hidden="true"
    />
    <aside
      className={`fixed top-0 right-0 h-full w-full sm:max-w-lg bg-[#fbf8f1] border-l-2 border-[#c4b8a8] z-50 transition-transform duration-300 overflow-y-auto ${
        open ? "translate-x-0" : "translate-x-full"
      }`}
      role="dialog"
      aria-label="Wallet and spending tracker"
    >
      <div className="px-5 py-8 sm:px-8 sm:py-10">
        <div className="flex items-start justify-between mb-8 sm:mb-10">
          <div>
            <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#5a6b5a] mb-2">Your Wallet</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#2d3a2d]">Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="text-2xl font-bold text-[#5a5648] hover:text-[#2d3a2d] px-3 py-1 rounded-lg hover:bg-[#e8e2d5]"
            aria-label="Close settings"
          >
            ✕
          </button>
        </div>

        {/* Wallet */}
        <section className="mb-10 sm:mb-12">
          <h3 className="text-base sm:text-lg font-bold text-[#2d3a2d] mb-2">Cards you hold</h3>
          <p className="text-sm sm:text-base text-[#5a5648] mb-5">
            Tick the cards you actually own. Recommendations will be scoped to your wallet.
          </p>
          <div className="space-y-3">
            {CARDS_DATA.cards.map((card) => {
              const owned = ownedCards.includes(card.id);
              return (
                <button
                  key={card.id}
                  onClick={() => onToggleCard(card.id)}
                  aria-pressed={owned}
                  className={`w-full flex items-center justify-between p-4 sm:p-5 border-2 rounded-lg text-left transition-colors ${
                    owned
                      ? "border-[#5a6b5a] bg-[#e8e2d5]"
                      : "border-[#c4b8a8] bg-white hover:border-[#8a8375]"
                  }`}
                >
                  <div className="flex-1 pr-3 min-w-0">
                    <div className="text-sm sm:text-base font-bold text-[#2d3a2d] mb-1 leading-tight">{card.cardName}</div>
                    <div className="text-xs sm:text-sm text-[#5a5648]">
                      {card.issuer} · {card.rewardType}
                    </div>
                  </div>
                  <div
                    className={`w-5 h-5 sm:w-6 sm:h-6 border-2 rounded flex items-center justify-center flex-shrink-0 ${
                      owned ? "border-[#5a6b5a] bg-[#5a6b5a]" : "border-[#c4b8a8] bg-white"
                    }`}
                  >
                    {owned && <span className="text-white text-xs sm:text-sm font-bold">✓</span>}
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Tracker */}
        <section>
          <div className="flex items-baseline justify-between mb-2 gap-3">
            <h3 className="text-base sm:text-lg font-bold text-[#2d3a2d]">This month's spend</h3>
            <button
              onClick={onResetMonth}
              className="text-xs sm:text-sm font-bold text-[#5a6b5a] hover:text-[#2d3a2d] underline underline-offset-4"
            >
              Reset all
            </button>
          </div>
          <p className="text-sm sm:text-base text-[#5a5648] mb-5">
            Log how much you've already spent on each card this month so we can track when caps are hit.
          </p>

          {ownedCards.length === 0 ? (
            <p className="text-sm sm:text-base text-[#5a5648] italic bg-white border-2 border-dashed border-[#c4b8a8] rounded-lg p-5">
              Select the cards you hold above to begin tracking.
            </p>
          ) : (
            <div className="space-y-5">
              {CARDS_DATA.cards
                .filter((c) => ownedCards.includes(c.id))
                .map((card) => {
                  const spent = monthlyUsage[card.id] || 0;
                  const cap = card.monthlySpendCap;
                  const pct = cap ? Math.min(100, (spent / cap) * 100) : 0;
                  const maxed = cap && spent >= cap;
                  const minMet = card.minMonthlySpend === 0 || spent >= card.minMonthlySpend;

                  return (
                    <div key={card.id} className="bg-white border-2 border-[#c4b8a8] rounded-lg p-4 sm:p-5">
                      <div className="flex items-baseline justify-between mb-3 gap-3 flex-wrap">
                        <label htmlFor={`spend-${card.id}`} className="text-sm sm:text-base font-bold text-[#2d3a2d] leading-tight">
                          {card.cardName}
                        </label>
                        <div className="flex items-center gap-2">
                          <span className="text-sm sm:text-base text-[#5a5648]">S$</span>
                          <input
                            id={`spend-${card.id}`}
                            type="number"
                            inputMode="decimal"
                            value={spent || ""}
                            onChange={(e) => onUpdateUsage(card.id, parseFloat(e.target.value) || 0)}
                            placeholder="0"
                            className="w-24 text-right text-sm sm:text-base font-bold text-[#2d3a2d] bg-[#fbf8f1] border-2 border-[#c4b8a8] rounded px-2 py-1 focus:border-[#5a6b5a] focus:outline-none"
                          />
                        </div>
                      </div>

                      {cap && (
                        <div className="mb-2">
                          <div className="h-3 bg-[#e8e2d5] rounded-full relative overflow-hidden">
                            <div
                              className={`absolute left-0 top-0 h-full rounded-full transition-all duration-300 ${
                                maxed ? "bg-[#a87d55]" : "bg-[#5a6b5a]"
                              }`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <div className="flex justify-between mt-2 text-xs sm:text-sm text-[#5a5648] gap-2">
                            <span className={maxed ? "font-bold text-[#a87d55]" : ""}>
                              {maxed ? "Cap reached" : `S$${(cap - spent).toFixed(0)} until cap`}
                            </span>
                            <span>Cap: S${cap.toLocaleString()}</span>
                          </div>
                        </div>
                      )}

                      {card.minMonthlySpend > 0 && (
                        <div className="mt-2 text-xs sm:text-sm">
                          {minMet ? (
                            <span className="text-[#5a6b5a] font-bold">✓ Minimum spend met</span>
                          ) : (
                            <span className="text-[#5a5648]">
                              <strong>S${(card.minMonthlySpend - spent).toFixed(0)}</strong> more needed to unlock bonus rate
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          )}
        </section>

        <p className="text-xs sm:text-sm text-[#5a5648] mt-8 sm:mt-10 pt-5 sm:pt-6 border-t-2 border-[#c4b8a8]">
          Your wallet and spending data are stored privately in your own browser. Nothing is shared with anyone else.
        </p>
      </div>
    </aside>
  </>
);

const ResultCard = ({ result, label, isPrimary, isUnownedSuggestion }) => {
  if (!result) {
    return (
      <div className="border-2 border-dashed border-[#c4b8a8] rounded-xl bg-white p-8">
        <p className="text-sm font-bold uppercase tracking-wider text-[#5a6b5a] mb-3">{label}</p>
        <p className="text-base text-[#5a5648]">No eligible card in your wallet for this combination.</p>
      </div>
    );
  }

  const borderColor = isUnownedSuggestion
    ? "border-[#a87d55]"
    : isPrimary
    ? "border-[#5a6b5a]"
    : "border-[#c4b8a8]";
  const bgColor = isUnownedSuggestion ? "bg-[#f5ede0]" : isPrimary ? "bg-[#e8e2d5]" : "bg-white";

  return (
    <div className={`border-2 ${borderColor} ${bgColor} rounded-xl p-5 sm:p-8`}>
      <div className="flex items-baseline justify-between mb-4 gap-3 flex-wrap">
        <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#5a6b5a]">{label}</p>
        <p className="text-xs sm:text-sm font-bold text-[#5a5648]">{result.issuer}</p>
      </div>

      {isUnownedSuggestion && (
        <div className="mb-4 p-3 bg-white border-2 border-[#a87d55] rounded-lg">
          <p className="text-xs sm:text-sm font-bold text-[#a87d55]">
            💡 You don't own this card — but it would earn significantly more.
          </p>
        </div>
      )}

      <h3 className="text-xl sm:text-2xl font-bold text-[#2d3a2d] mb-2 leading-tight">{result.cardName}</h3>
      <p className="text-sm sm:text-base text-[#5a5648] mb-5 sm:mb-6">
        {result.rewardType} · <strong>{result.bonusRate}{result.rewardType === "Cashback" ? "%" : " mpd"}</strong> on this category
      </p>

      <div className="border-t-2 border-[#c4b8a8] pt-5 sm:pt-6 mb-5 sm:mb-6 flex items-baseline justify-between gap-3">
        <p className="text-sm sm:text-base font-bold text-[#5a5648]">You'll earn</p>
        <div className="text-right">
          <p className="text-3xl sm:text-4xl font-bold text-[#2d3a2d]">S${result.totalReturnSGD.toFixed(2)}</p>
          {result.rewardType === "Miles" && (
            <p className="text-sm sm:text-base text-[#5a5648] mt-1">{result.totalNative.toLocaleString()} miles</p>
          )}
        </div>
      </div>

      <div className="space-y-3">
        {result.remainingCap != null && !result.partiallyCapped && (
          <div className="flex gap-3 items-start">
            <span className="text-[#5a6b5a] font-bold mt-0.5 flex-shrink-0">•</span>
            <p className="text-sm sm:text-base text-[#2d3a2d]">
              <strong>S${result.remainingCap.toFixed(0)}</strong> remaining before bonus cap
            </p>
          </div>
        )}

        {result.partiallyCapped && (
          <div className="flex gap-3 items-start">
            <span className="text-[#a87d55] font-bold mt-0.5 flex-shrink-0">•</span>
            <p className="text-sm sm:text-base text-[#2d3a2d]">
              Cap partially reached. <strong>S${result.baseSpend.toFixed(2)}</strong> earns base rate only.
            </p>
          </div>
        )}

        {result.minMonthlySpend > 0 && (
          <div className="flex gap-3 items-start">
            <span className="text-[#5a6b5a] font-bold mt-0.5 flex-shrink-0">•</span>
            <p className="text-sm sm:text-base text-[#2d3a2d]">
              Requires <strong>S${result.minMonthlySpend} minimum monthly spend</strong> to earn bonus rate
            </p>
          </div>
        )}

        {result.conditions && (
          <div className="flex gap-3 items-start">
            <span className="text-[#5a6b5a] font-bold mt-0.5 flex-shrink-0">•</span>
            <p className="text-sm sm:text-base text-[#5a5648]">{result.conditions}</p>
          </div>
        )}

        {result.notes && (
          <div className="flex gap-3 items-start">
            <span className="text-[#5a6b5a] font-bold mt-0.5 flex-shrink-0">•</span>
            <p className="text-sm sm:text-base text-[#5a5648] italic">{result.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Onboarding for new users — forces wallet setup
const OnboardingModal = ({ ownedCards, onToggleCard, onComplete }) => (
  <div className="fixed inset-0 bg-[#2d3a2d]/80 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
    <div className="bg-[#fbf8f1] border-2 border-[#5a6b5a] rounded-xl w-full max-w-xl my-4 p-5 sm:p-8 shadow-2xl">
      <h2 className="text-2xl sm:text-3xl font-bold text-[#2d3a2d] mb-3">Welcome</h2>
      <p className="text-base sm:text-lg text-[#2d3a2d] mb-2">
        Before we recommend anything, tell us which credit cards you currently hold.
      </p>
      <p className="text-sm sm:text-base text-[#5a5648] mb-6">
        Recommendations will prioritize cards in your wallet. You can change this anytime in Settings.
      </p>

      <div className="space-y-2 mb-6 max-h-[50vh] overflow-y-auto pr-1">
        {CARDS_DATA.cards.map((card) => {
          const owned = ownedCards.includes(card.id);
          return (
            <button
              key={card.id}
              onClick={() => onToggleCard(card.id)}
              aria-pressed={owned}
              className={`w-full flex items-center justify-between p-3 sm:p-4 border-2 rounded-lg text-left transition-colors ${
                owned
                  ? "border-[#5a6b5a] bg-[#e8e2d5]"
                  : "border-[#c4b8a8] bg-white hover:border-[#8a8375]"
              }`}
            >
              <div className="flex-1 pr-3 min-w-0">
                <div className="text-sm sm:text-base font-bold text-[#2d3a2d] leading-tight">{card.cardName}</div>
                <div className="text-xs sm:text-sm text-[#5a5648] mt-1">
                  {card.issuer} · {card.rewardType}
                </div>
              </div>
              <div
                className={`w-5 h-5 sm:w-6 sm:h-6 border-2 rounded flex items-center justify-center flex-shrink-0 ${
                  owned ? "border-[#5a6b5a] bg-[#5a6b5a]" : "border-[#c4b8a8] bg-white"
                }`}
              >
                {owned && <span className="text-white text-xs sm:text-sm font-bold">✓</span>}
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4 border-t-2 border-[#c4b8a8]">
        <p className="text-sm sm:text-base text-[#5a5648] text-center sm:text-left">
          <strong>{ownedCards.length}</strong> {ownedCards.length === 1 ? "card" : "cards"} selected
        </p>
        <button
          onClick={onComplete}
          disabled={ownedCards.length === 0}
          className="px-5 py-3 bg-[#5a6b5a] text-white font-bold rounded-lg hover:bg-[#2d3a2d] disabled:bg-[#c4b8a8] disabled:cursor-not-allowed transition-colors"
        >
          {ownedCards.length === 0 ? "Select at least one" : "Continue →"}
        </button>
      </div>
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────────────────────
export default function App() {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Dining");
  const [preference, setPreference] = useState("Auto");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [showUnowned, setShowUnowned] = useState(true);

  const [userState, setUserState] = useState(() => {
    const state = loadUserState();
    const currentMonth = new Date().toISOString().slice(0, 7);
    if (state.month !== currentMonth) {
      const reset = { ...state, monthlyUsage: {}, month: currentMonth };
      saveUserState(reset);
      return reset;
    }
    return state;
  });

  useEffect(() => {
    saveUserState(userState);
  }, [userState]);

  const toggleCard = (cardId) => {
    setUserState((s) => ({
      ...s,
      ownedCards: s.ownedCards.includes(cardId) ? s.ownedCards.filter((id) => id !== cardId) : [...s.ownedCards, cardId],
    }));
  };

  const updateUsage = (cardId, value) => {
    setUserState((s) => ({ ...s, monthlyUsage: { ...s.monthlyUsage, [cardId]: value } }));
  };

  const resetMonth = () => {
    setUserState((s) => ({ ...s, monthlyUsage: {}, month: new Date().toISOString().slice(0, 7) }));
  };

  const completeSetup = () => {
    setUserState((s) => ({ ...s, hasCompletedSetup: true }));
  };

  const result = useMemo(
    () =>
      evaluateExpense({
        amount: parseFloat(amount),
        category,
        preference,
        milesValuation: CARDS_DATA.milesValuation,
        ownedCards: userState.ownedCards,
        monthlyUsage: userState.monthlyUsage,
        includeUnowned: showUnowned,
      }),
    [amount, category, preference, userState, showUnowned]
  );

  const hasInput = amount && parseFloat(amount) > 0;

  return (
    <div className="min-h-screen bg-[#fbf8f1]">
      {/* Onboarding */}
      {!userState.hasCompletedSetup && (
        <OnboardingModal
          ownedCards={userState.ownedCards}
          onToggleCard={toggleCard}
          onComplete={completeSetup}
        />
      )}

      {/* Wallet button */}
      <button
        onClick={() => setSettingsOpen(true)}
        className="fixed top-4 right-4 sm:top-6 sm:right-6 z-30 px-3 py-2 sm:px-5 sm:py-3 border-2 border-[#5a6b5a] bg-white text-[#2d3a2d] text-sm sm:text-base font-bold rounded-lg hover:bg-[#e8e2d5] transition-colors shadow-sm"
        aria-label="Open wallet and tracker settings"
      >
        Wallet ({userState.ownedCards.length})
      </button>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16 pt-20 sm:pt-16">
        {/* Header */}
        <header className="mb-10 sm:mb-12">
          <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#5a6b5a] mb-3">
            Singapore · Credit Card Optimizer · 2026
          </p>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-[#2d3a2d] mb-4 sm:mb-6 leading-tight">
            Which card should I use?
          </h1>
          <p className="text-base sm:text-xl text-[#2d3a2d] max-w-2xl leading-relaxed">
            Tell us how much you're about to spend and on what. We'll recommend the best card from your wallet — updated with 2026 rates.
          </p>
        </header>

        {/* Form */}
        <section className="space-y-6 sm:space-y-8 mb-8 sm:mb-12 bg-white border-2 border-[#c4b8a8] rounded-xl p-5 sm:p-8">
          <div>
            <label htmlFor="amount-input" className="block text-sm sm:text-base font-bold text-[#2d3a2d] mb-3">
              1. How much are you spending?
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl sm:text-2xl font-bold text-[#5a5648]">
                S$
              </span>
              <input
                id="amount-input"
                type="number"
                inputMode="decimal"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full pl-14 pr-4 py-3 sm:py-4 text-xl sm:text-2xl font-bold text-[#2d3a2d] bg-[#fbf8f1] border-2 border-[#c4b8a8] rounded-lg focus:border-[#5a6b5a] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label htmlFor="category-select" className="block text-sm sm:text-base font-bold text-[#2d3a2d] mb-3">
              2. What category is this spend?
            </label>
            <select
              id="category-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 sm:py-4 text-lg sm:text-xl font-bold text-[#2d3a2d] bg-[#fbf8f1] border-2 border-[#c4b8a8] rounded-lg focus:border-[#5a6b5a] focus:outline-none cursor-pointer"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <p className="text-sm sm:text-base font-bold text-[#2d3a2d] mb-3">3. What do you prefer to earn?</p>
            <PreferenceToggle value={preference} onChange={setPreference} />
            <p className="text-xs sm:text-sm text-[#5a5648] mt-3">
              {preference === "Auto"
                ? "Miles are valued at S$0.015 each to compare fairly with cashback."
                : preference === "Miles"
                ? "Only miles-earning cards will be shown."
                : "Only cashback cards will be shown."}
            </p>
          </div>

          <div className="pt-2 border-t-2 border-[#c4b8a8]">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={showUnowned}
                onChange={(e) => setShowUnowned(e.target.checked)}
                className="mt-1 w-5 h-5 rounded border-2 border-[#c4b8a8] cursor-pointer flex-shrink-0"
              />
              <span className="text-sm sm:text-base text-[#2d3a2d]">
                Also show me cards I don't own that would earn significantly more
              </span>
            </label>
          </div>
        </section>

        {/* Results */}
        <section className="space-y-5">
          {result.noWallet ? (
            <div className="border-2 border-dashed border-[#c4b8a8] rounded-xl p-12 text-center bg-white">
              <p className="text-xl text-[#2d3a2d] mb-6">Your wallet is empty.</p>
              <button
                onClick={() => setSettingsOpen(true)}
                className="px-6 py-3 bg-[#5a6b5a] text-white font-bold rounded-lg hover:bg-[#2d3a2d]"
              >
                Add your cards
              </button>
            </div>
          ) : !hasInput ? (
            <div className="border-2 border-dashed border-[#c4b8a8] rounded-xl p-12 text-center bg-white">
              <p className="text-xl text-[#2d3a2d]">Enter an amount above to see your best card.</p>
            </div>
          ) : (
            <>
              <ResultCard result={result.best} label="Best Card in Your Wallet" isPrimary={true} />
              {result.runnerUp && <ResultCard result={result.runnerUp} label="Runner-up in Your Wallet" isPrimary={false} />}
              {result.unownedSuggestion && (
                <ResultCard result={result.unownedSuggestion} label="Consider Adding" isUnownedSuggestion={true} />
              )}
            </>
          )}
        </section>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t-2 border-[#c4b8a8]">
          <p className="text-base text-[#5a5648] mb-3">
            <strong>{userState.ownedCards.length}</strong> of <strong>{CARDS_DATA.cards.length}</strong> cards in your wallet · {userState.month}
          </p>
          <p className="text-sm text-[#5a5648] leading-relaxed">
            Card rates updated April 2026, based on The MileLion's 2026 Strategy and LobangSis. Card terms change frequently — always verify with the issuer before making decisions.
          </p>
        </footer>
      </div>

      <SettingsDrawer
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        ownedCards={userState.ownedCards}
        monthlyUsage={userState.monthlyUsage}
        onToggleCard={toggleCard}
        onUpdateUsage={updateUsage}
        onResetMonth={resetMonth}
      />
    </div>
  );
}
