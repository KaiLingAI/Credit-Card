import React, { useState, useMemo, useEffect } from "react";

// ─────────────────────────────────────────────────────────────
// CARD DATA — Updated for 2026
// Sources: MileLion 2026 Credit Card Strategy (10 Jan 2026) + LobangSis card reviews
// Last verified: 23 April 2026
//
// IMPORTANT: Card terms change frequently. Always verify current rates
// with the issuer before making decisions.
// ─────────────────────────────────────────────────────────────
// Card status flags:
//   "recommended" — actively in MileLion's 2026 rotation, worth holding
//   "premium"     — high annual fee but valuable for specific users (lounge, uncapped, etc.)
//   "avoid"       — MileLion explicitly says don't bother; earn rates nerfed, not competitive
const CARDS_DATA = {
  schemaVersion: "3.0",
  currency: "SGD",
  lastUpdated: "2026-04-24",
  milesValuation: 0.015,
  cards: [
    {
      id: "citi-rewards",
      status: "recommended",
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
      status: "recommended",
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
      status: "recommended",
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
      status: "recommended",
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
      status: "recommended",
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
      status: "recommended",
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
      status: "recommended",
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
      status: "recommended",
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
      status: "recommended",
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
      status: "recommended",
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
      status: "recommended",
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
      status: "premium",
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
      status: "recommended",
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
      status: "recommended",
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
      status: "recommended",
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

    // ═══════════════════════════════════════════════════════════
    // PREMIUM CARDS — high annual fee, but valuable for certain users
    // ═══════════════════════════════════════════════════════════
    {
      id: "uob-prvi-miles",
      status: "premium",
      cardName: "UOB PRVI Miles",
      issuer: "UOB",
      rewardType: "Miles",
      baseEarnRate: { rate: 1.4, unit: "miles_per_sgd" },
      bonusEarnRates: [
        {
          rate: 2.4,
          unit: "miles_per_sgd",
          eligibleCategories: ["Foreign Currency"],
          conditions: "Uncapped 2.4 mpd on all FCY spend. Also 6 mpd on selected airlines/hotels via UOB Travel.",
        },
        {
          rate: 6.0,
          unit: "miles_per_sgd",
          eligibleCategories: ["Flights", "Hotels"],
          conditions: "Only when booked via UOB Travel portal.",
        },
      ],
      minMonthlySpend: 0,
      monthlySpendCap: null,
      capPeriod: "none",
      annualFee: 261.60,
      notes: "Classic uncapped general spender. 1.4 mpd everywhere local, 2.4 mpd on FCY.",
    },
    {
      id: "citi-prestige",
      status: "premium",
      cardName: "Citi Prestige Card",
      issuer: "Citibank",
      rewardType: "Miles",
      baseEarnRate: { rate: 1.3, unit: "miles_per_sgd" },
      bonusEarnRates: [
        {
          rate: 2.0,
          unit: "miles_per_sgd",
          eligibleCategories: ["Foreign Currency"],
          conditions: "Uncapped 2 mpd on all FCY.",
        },
      ],
      minMonthlySpend: 0,
      monthlySpendCap: null,
      capPeriod: "none",
      annualFee: 648.00,
      notes: "Nerfed Jul 2025: lounge visits cut to 12/year, AF up 20%. 4th night free at hotels. Citi ThankYou points.",
    },
    {
      id: "stanchart-beyond",
      status: "premium",
      cardName: "StanChart Beyond Card",
      issuer: "Standard Chartered",
      rewardType: "Miles",
      baseEarnRate: { rate: 1.5, unit: "miles_per_sgd" },
      bonusEarnRates: [
        {
          rate: 3.0,
          unit: "miles_per_sgd",
          eligibleCategories: ["Foreign Currency"],
          conditions: "Base 3 mpd FCY (4 mpd for Priority Private; 3.5 mpd for Priority Banking).",
        },
        {
          rate: 8.0,
          unit: "miles_per_sgd",
          eligibleCategories: ["Dining"],
          conditions: "Priority Private customers only — 8 mpd on FCY dining.",
        },
      ],
      minMonthlySpend: 0,
      monthlySpendCap: null,
      capPeriod: "none",
      annualFee: 1635.00,
      notes: "Ultra-premium. S$20K min spend for welcome bonus. Worth it only for high-spenders who maximize FCY usage.",
    },
    {
      id: "hsbc-premier",
      status: "premium",
      cardName: "HSBC Premier Mastercard",
      issuer: "HSBC",
      rewardType: "Miles",
      baseEarnRate: { rate: 1.68, unit: "miles_per_sgd" },
      bonusEarnRates: [
        {
          rate: 2.76,
          unit: "miles_per_sgd",
          eligibleCategories: ["Foreign Currency"],
          conditions: "Buffed Aug 2025. Unlimited lounge access. Requires HSBC Premier banking relationship.",
        },
      ],
      minMonthlySpend: 0,
      monthlySpendCap: null,
      capPeriod: "none",
      annualFee: 0,
      notes: "Free with HSBC Premier. Uncapped 1.68 mpd local / 2.76 mpd FCY. Unlimited lounge access for cardholder.",
    },
    {
      id: "amex-platinum-charge",
      status: "premium",
      cardName: "AMEX Platinum Charge",
      issuer: "American Express",
      rewardType: "Miles",
      baseEarnRate: { rate: 1.0, unit: "miles_per_sgd" },
      bonusEarnRates: [
        {
          rate: 2.0,
          unit: "miles_per_sgd",
          eligibleCategories: ["Foreign Currency", "Flights", "Hotels"],
          conditions: "2 mpd on eligible travel and FCY spend (small conversion block: 400 pts = 250 miles).",
        },
      ],
      minMonthlySpend: 0,
      monthlySpendCap: null,
      capPeriod: "none",
      annualFee: 1744.00,
      notes: "Ultra-premium charge card. Extensive lounge access, Fine Hotels & Resorts, elite status matches. MR points.",
    },
    {
      id: "dbs-altitude-visa",
      status: "premium",
      cardName: "DBS Altitude Visa",
      issuer: "DBS",
      rewardType: "Miles",
      baseEarnRate: { rate: 1.2, unit: "miles_per_sgd" },
      bonusEarnRates: [
        {
          rate: 3.0,
          unit: "miles_per_sgd",
          eligibleCategories: ["Flights", "Hotels"],
          conditions: "3 mpd on online flight/hotel bookings (Kaligo, Expedia for DBS).",
        },
      ],
      minMonthlySpend: 0,
      monthlySpendCap: null,
      capPeriod: "none",
      annualFee: 196.20,
      notes: "Classic travel card. 1.2 mpd everywhere, 3 mpd on online travel. AF waivable first year.",
    },

    // ═══════════════════════════════════════════════════════════
    // AVOID — MileLion explicitly says don't bother. Listed so users
    // who already hold them can flag them and get warnings.
    // ═══════════════════════════════════════════════════════════
    {
      id: "hsbc-travelone",
      status: "avoid",
      cardName: "HSBC TravelOne Card",
      issuer: "HSBC",
      rewardType: "Miles",
      baseEarnRate: { rate: 1.2, unit: "miles_per_sgd" },
      bonusEarnRates: [
        {
          rate: 2.4,
          unit: "miles_per_sgd",
          eligibleCategories: ["Foreign Currency"],
          conditions: "2.4 mpd on FCY. Not competitive with Maybank World MC or XL Rewards.",
        },
      ],
      minMonthlySpend: 0,
      monthlySpendCap: null,
      capPeriod: "none",
      annualFee: 196.20,
      notes: "⚠️ AVOID: MileLion's 2026 strategy doesn't recommend this card. Better alternatives exist — HSBC Revolution for 4 mpd categories, Maybank World MC for uncapped FCY.",
    },
    {
      id: "chocolate-visa",
      status: "avoid",
      cardName: "Chocolate Visa Card",
      issuer: "Chocolate Finance",
      rewardType: "Miles",
      baseEarnRate: { rate: 1.0, unit: "miles_per_sgd" },
      bonusEarnRates: [
        {
          rate: 1.0,
          unit: "miles_per_sgd",
          eligibleCategories: ["Foreign Currency"],
          conditions: "1 mpd uncapped on FCY, but capped at 100 miles/month for 'bill payments' (utilities, insurance, healthcare).",
        },
      ],
      minMonthlySpend: 0,
      monthlySpendCap: null,
      capPeriod: "none",
      annualFee: 0,
      notes: "⚠️ AVOID (MileLion calls it 'junk card'): Nerfed Jul 2025 from 2 mpd to 1 mpd. Only useful for no-FCY-fee overseas spend or charity/education (no cap applies).",
    },
    {
      id: "amex-highflyer",
      status: "avoid",
      cardName: "AMEX HighFlyer",
      issuer: "American Express",
      rewardType: "Miles",
      baseEarnRate: { rate: 1.2, unit: "miles_per_sgd" },
      bonusEarnRates: [
        {
          rate: 2.0,
          unit: "miles_per_sgd",
          eligibleCategories: ["Flights"],
          conditions: "2 mpd on SIA Group — same as KrisFlyer Ascend but no lounge perks.",
        },
      ],
      minMonthlySpend: 0,
      monthlySpendCap: null,
      capPeriod: "none",
      annualFee: 343.98,
      notes: "⚠️ AVOID: Nerfed Apr 2025 — earn rates cut, annual fee hiked. Very few reasons to hold this over KrisFlyer Ascend.",
    },
    {
      id: "maybank-manu",
      status: "avoid",
      cardName: "Maybank Manchester United Card",
      issuer: "Maybank",
      rewardType: "Miles",
      baseEarnRate: { rate: 0.4, unit: "miles_per_sgd" },
      bonusEarnRates: [
        {
          rate: 1.2,
          unit: "miles_per_sgd",
          eligibleCategories: ["Foreign Currency"],
          conditions: "Earn rate devalued after Man United's poor 2024/25 season — very weak compared to Maybank World MC.",
        },
      ],
      minMonthlySpend: 0,
      monthlySpendCap: null,
      capPeriod: "none",
      annualFee: 196.20,
      notes: "⚠️ AVOID (MileLion: 'epic devaluation' Apr 2025). Keep only for fandom. Use Maybank World MC or XL Rewards instead.",
    },

    // ═══════════════════════════════════════════════════════════
    // POPULAR CARDS — broad market coverage from SingSaver directory
    // Data accuracy varies; cards marked dataQuality:"partial" need
    // verification against issuer T&Cs before relying on.
    // ═══════════════════════════════════════════════════════════

    // —— CITIBANK ——
    {
      id: "citi-premiermiles",
      status: "recommended",
      cardName: "Citi PremierMiles Card",
      issuer: "Citibank",
      rewardType: "Miles",
      baseEarnRate: { rate: 1.2, unit: "miles_per_sgd" },
      bonusEarnRates: [
        {
          rate: 2.2,
          unit: "miles_per_sgd",
          eligibleCategories: ["Foreign Currency"],
          conditions: "Uncapped 2.2 mpd on all FCY spend. Miles never expire. 11 airline/hotel transfer partners.",
        },
      ],
      minMonthlySpend: 0,
      monthlySpendCap: null,
      capPeriod: "none",
      annualFee: 196.20,
      notes: "Classic uncapped miles card. 2 free Priority Pass lounge visits/year. Miles never expire.",
    },
    {
      id: "citi-cashback-plus",
      status: "recommended",
      cardName: "Citi Cash Back+ Card",
      issuer: "Citibank",
      rewardType: "Cashback",
      baseEarnRate: { rate: 1.6, unit: "percent" },
      bonusEarnRates: [
        {
          rate: 1.6,
          unit: "percent",
          eligibleCategories: ["All"],
          conditions: "Uncapped 1.6% on all spend. No min spend, no category restrictions.",
        },
      ],
      minMonthlySpend: 0,
      monthlySpendCap: null,
      capPeriod: "none",
      annualFee: 196.20,
      notes: "Fuss-free cashback. 1.6% everywhere, uncapped, cashback never expires.",
    },
    {
      id: "citi-smrt",
      status: "recommended",
      cardName: "Citi SMRT Card",
      issuer: "Citibank",
      rewardType: "Cashback",
      baseEarnRate: { rate: 0.3, unit: "percent" },
      bonusEarnRates: [
        {
          rate: 5.0,
          unit: "percent",
          eligibleCategories: ["Transport", "Groceries", "Online Shopping"],
          conditions: "5% on SimplyGo transport, selected groceries, and online shopping.",
        },
      ],
      minMonthlySpend: 500,
      monthlySpendCap: 400,
      capPeriod: "calendar",
      annualFee: 196.20,
      dataQuality: "partial",
      notes: "Transport + lifestyle cashback. Verify specific category caps with Citibank.",
    },
    {
      id: "citi-m1-platinum",
      status: "recommended",
      cardName: "Citi M1 Platinum Visa",
      issuer: "Citibank",
      rewardType: "Cashback",
      baseEarnRate: { rate: 0.3, unit: "percent" },
      bonusEarnRates: [
        {
          rate: 10.0,
          unit: "percent",
          eligibleCategories: ["Telco"],
          conditions: "10% rebate on M1 telco bills. Must be M1 subscriber to get full benefit.",
        },
      ],
      minMonthlySpend: 0,
      monthlySpendCap: null,
      capPeriod: "none",
      annualFee: 196.20,
      dataQuality: "partial",
      notes: "Niche — only makes sense for M1 subscribers.",
    },
    {
      id: "citi-clear",
      status: "avoid",
      cardName: "Citi Clear Card",
      issuer: "Citibank",
      rewardType: "Miles",
      baseEarnRate: { rate: 1.0, unit: "miles_per_sgd" },
      bonusEarnRates: [],
      minMonthlySpend: 0,
      monthlySpendCap: null,
      capPeriod: "none",
      annualFee: 30.52,
      dataQuality: "partial",
      notes: "Entry-level card, very low earn rate. Better options exist.",
    },

    // —— HSBC ——
    {
      id: "hsbc-live-plus",
      status: "recommended",
      cardName: "HSBC Live+ Card",
      issuer: "HSBC",
      rewardType: "Cashback",
      baseEarnRate: { rate: 0.3, unit: "percent" },
      bonusEarnRates: [
        {
          rate: 8.0,
          unit: "percent",
          eligibleCategories: ["Dining", "Entertainment", "Online Shopping"],
          conditions: "8% on dining, entertainment, shopping (local + overseas). Min S$600/month.",
        },
        {
          rate: 5.0,
          unit: "percent",
          eligibleCategories: ["Petrol"],
          conditions: "5% on fuel at Caltex and Shell Singapore.",
        },
      ],
      minMonthlySpend: 600,
      monthlySpendCap: 250,
      capPeriod: "quarter",
      annualFee: 196.20,
      notes: "Cashback capped at S$250/quarter. Need min S$600/month for 3 months in a quarter.",
    },
    {
      id: "hsbc-advance",
      status: "recommended",
      cardName: "HSBC Advance Card",
      issuer: "HSBC",
      rewardType: "Cashback",
      baseEarnRate: { rate: 1.5, unit: "percent" },
      bonusEarnRates: [
        {
          rate: 2.5,
          unit: "percent",
          eligibleCategories: ["All"],
          conditions: "2.5% cashback on all spend for HSBC Advance banking customers (with S$2K/month min spend).",
        },
      ],
      minMonthlySpend: 0,
      monthlySpendCap: null,
      capPeriod: "none",
      annualFee: 196.20,
      dataQuality: "partial",
      notes: "1.5% default; 2.5% if you're an HSBC Advance banking customer and hit min spend.",
    },

    // —— UOB ——
    {
      id: "uob-one",
      status: "recommended",
      cardName: "UOB One Card",
      issuer: "UOB",
      rewardType: "Cashback",
      baseEarnRate: { rate: 0.3, unit: "percent" },
      bonusEarnRates: [
        {
          rate: 10.0,
          unit: "percent",
          eligibleCategories: ["Food Delivery", "Ride-hailing", "Transport", "Online Shopping"],
          conditions: "10% on McDonald's, Grab, SimplyGo, Shopee. Requires S$2K/month spend across 10+ transactions per month for all 3 months of quarter.",
        },
        {
          rate: 8.0,
          unit: "percent",
          eligibleCategories: ["Groceries"],
          conditions: "8% on groceries (same min spend + quarter consistency rules).",
        },
        {
          rate: 4.33,
          unit: "percent",
          eligibleCategories: ["Utilities"],
          conditions: "4.33% on SP utility bills.",
        },
        {
          rate: 3.33,
          unit: "percent",
          eligibleCategories: ["All"],
          conditions: "3.33% baseline on all other retail spend with min spend requirements met.",
        },
      ],
      minMonthlySpend: 600,
      monthlySpendCap: 200,
      capPeriod: "quarter",
      annualFee: 196.20,
      notes: "Rebates paid quarterly. Very popular for consistent spenders. Requires 10+ transactions/month.",
    },
    {
      id: "uob-evol",
      status: "recommended",
      cardName: "UOB EVOL Card",
      issuer: "UOB",
      rewardType: "Cashback",
      baseEarnRate: { rate: 0.3, unit: "percent" },
      bonusEarnRates: [
        {
          rate: 8.0,
          unit: "percent",
          eligibleCategories: ["Online Shopping", "Mobile Contactless"],
          conditions: "8% cashback on online shopping + mobile wallets. Min S$600/month.",
        },
      ],
      minMonthlySpend: 600,
      monthlySpendCap: 60,
      capPeriod: "calendar",
      annualFee: 196.20,
      dataQuality: "partial",
      notes: "Digital lifestyle card. Capped at S$60/month cashback.",
    },
    {
      id: "uob-absolute-cashback",
      status: "recommended",
      cardName: "UOB Absolute Cashback Card",
      issuer: "UOB",
      rewardType: "Cashback",
      baseEarnRate: { rate: 1.7, unit: "percent" },
      bonusEarnRates: [
        {
          rate: 1.7,
          unit: "percent",
          eligibleCategories: ["All"],
          conditions: "Unlimited 1.7% cashback on all spend including hospital, education, insurance, utilities — which most cards exclude.",
        },
      ],
      minMonthlySpend: 0,
      monthlySpendCap: null,
      capPeriod: "none",
      annualFee: 196.20,
      notes: "Best card for 'excluded' categories. Hospital bills, education, insurance premiums all earn 1.7%.",
    },
    {
      id: "uob-ladys",
      status: "recommended",
      cardName: "UOB Lady's Card",
      issuer: "UOB",
      rewardType: "Miles",
      baseEarnRate: { rate: 0.4, unit: "miles_per_sgd" },
      bonusEarnRates: [
        {
          rate: 4.0,
          unit: "miles_per_sgd",
          eligibleCategories: ["Dining", "Online Shopping", "Transport", "Entertainment", "Beauty", "Travel"],
          conditions: "4 mpd on 1 chosen bonus category (vs Solitaire's 2 categories). Max S$1,000/calendar month on that category.",
        },
      ],
      minMonthlySpend: 0,
      monthlySpendCap: 1000,
      capPeriod: "calendar",
      annualFee: 196.20,
      notes: "Choose 1 bonus category quarterly. Single-category S$1K cap often more useful than Solitaire's 2×S$750.",
    },
    {
      id: "uob-preferred-visa",
      status: "recommended",
      cardName: "UOB Preferred Visa Card",
      issuer: "UOB",
      rewardType: "Miles",
      baseEarnRate: { rate: 0.4, unit: "miles_per_sgd" },
      bonusEarnRates: [
        {
          rate: 4.0,
          unit: "miles_per_sgd",
          eligibleCategories: ["Online Shopping"],
          conditions: "4 mpd on selected online transactions. Similar to Preferred Platinum Visa but Visa version.",
        },
      ],
      minMonthlySpend: 0,
      monthlySpendCap: 1000,
      capPeriod: "calendar",
      annualFee: 196.20,
      dataQuality: "partial",
      notes: "Less commonly held; most prefer the Preferred Platinum Visa.",
    },
    {
      id: "singtel-uob",
      status: "recommended",
      cardName: "Singtel-UOB Card",
      issuer: "UOB",
      rewardType: "Cashback",
      baseEarnRate: { rate: 0.3, unit: "percent" },
      bonusEarnRates: [
        {
          rate: 12.0,
          unit: "percent",
          eligibleCategories: ["Telco"],
          conditions: "Up to 12% rebate on Singtel bills for Singtel customers.",
        },
        {
          rate: 5.0,
          unit: "percent",
          eligibleCategories: ["Online Shopping", "Dining"],
          conditions: "5% on selected online/dining with min spend.",
        },
      ],
      minMonthlySpend: 500,
      monthlySpendCap: null,
      capPeriod: "calendar",
      annualFee: 196.20,
      dataQuality: "partial",
      notes: "Best if you're already a Singtel subscriber.",
    },
    {
      id: "uob-unionpay",
      status: "recommended",
      cardName: "UOB UnionPay Platinum Card",
      issuer: "UOB",
      rewardType: "Cashback",
      baseEarnRate: { rate: 2.0, unit: "percent" },
      bonusEarnRates: [
        {
          rate: 2.0,
          unit: "percent",
          eligibleCategories: ["All"],
          conditions: "Unlimited 2% cashback on all UnionPay transactions.",
        },
      ],
      minMonthlySpend: 0,
      monthlySpendCap: null,
      capPeriod: "none",
      annualFee: 196.20,
      dataQuality: "partial",
      notes: "Higher min income (S$40K). Useful for China/UnionPay-network spend.",
    },
    {
      id: "uob-visa-infinite-metal",
      status: "premium",
      cardName: "UOB Visa Infinite Metal Card",
      issuer: "UOB",
      rewardType: "Miles",
      baseEarnRate: { rate: 1.4, unit: "miles_per_sgd" },
      bonusEarnRates: [
        {
          rate: 2.4,
          unit: "miles_per_sgd",
          eligibleCategories: ["Foreign Currency"],
          conditions: "Uncapped 2.4 mpd on FCY. Similar to PRVI Miles but premium benefits.",
        },
      ],
      minMonthlySpend: 0,
      monthlySpendCap: null,
      capPeriod: "none",
      annualFee: 654.00,
      notes: "Premium metal card. Lounge access, limo transfers, premium dining benefits.",
    },

    // —— DBS / POSB ——
    {
      id: "dbs-live-fresh",
      status: "recommended",
      cardName: "DBS Live Fresh Card",
      issuer: "DBS",
      rewardType: "Cashback",
      baseEarnRate: { rate: 0.3, unit: "percent" },
      bonusEarnRates: [
        {
          rate: 9.25,
          unit: "percent",
          eligibleCategories: ["Online Shopping", "Mobile Contactless"],
          conditions: "Up to 9.25% on online + visa contactless spend. Min S$800/month.",
        },
      ],
      minMonthlySpend: 800,
      monthlySpendCap: 75,
      capPeriod: "calendar",
      annualFee: 196.20,
      dataQuality: "partial",
      notes: "Young adult cashback card. Capped monthly.",
    },
    {
      id: "dbs-live-fresh-student",
      status: "recommended",
      cardName: "DBS Live Fresh Student Card",
      issuer: "DBS",
      rewardType: "Cashback",
      baseEarnRate: { rate: 0.3, unit: "percent" },
      bonusEarnRates: [
        {
          rate: 10.0,
          unit: "percent",
          eligibleCategories: ["Online Shopping", "Mobile Contactless"],
          conditions: "Up to 10% cashback on online + contactless for students. No income requirement.",
        },
      ],
      minMonthlySpend: 0,
      monthlySpendCap: 50,
      capPeriod: "calendar",
      annualFee: 196.20,
      dataQuality: "partial",
      notes: "Student card, no income requirement. AF usually waived.",
    },
    {
      id: "posb-everyday",
      status: "recommended",
      cardName: "POSB Everyday Card",
      issuer: "POSB",
      rewardType: "Cashback",
      baseEarnRate: { rate: 0.3, unit: "percent" },
      bonusEarnRates: [
        {
          rate: 10.0,
          unit: "percent",
          eligibleCategories: ["Groceries"],
          conditions: "10% cashback at Sheng Siong. 8% at Cold Storage, Giant, Guardian. 5% at Watsons.",
        },
        {
          rate: 5.0,
          unit: "percent",
          eligibleCategories: ["Dining"],
          conditions: "5% on dining + other partners.",
        },
      ],
      minMonthlySpend: 0,
      monthlySpendCap: 50,
      capPeriod: "calendar",
      annualFee: 196.20,
      notes: "Popular with families. Strong at local groceries.",
    },
    {
      id: "dbs-yuu-amex",
      status: "recommended",
      cardName: "DBS yuu American Express Card",
      issuer: "DBS",
      rewardType: "Miles",
      baseEarnRate: { rate: 0.4, unit: "miles_per_sgd" },
      bonusEarnRates: [
        {
          rate: 10.0,
          unit: "percent",
          eligibleCategories: ["Groceries", "Dining", "Food Delivery", "Transport", "Telco", "Pharmacy"],
          conditions: "AMEX variant of yuu card. Same 10 mpd at yuu merchants. Min/cap S$800/month.",
        },
      ],
      minMonthlySpend: 800,
      monthlySpendCap: 800,
      capPeriod: "calendar",
      annualFee: 196.20,
      notes: "AMEX variant of DBS yuu Visa. Same mechanics.",
    },
    {
      id: "dbs-altitude-amex",
      status: "premium",
      cardName: "DBS Altitude AMEX Card",
      issuer: "DBS",
      rewardType: "Miles",
      baseEarnRate: { rate: 1.3, unit: "miles_per_sgd" },
      bonusEarnRates: [
        {
          rate: 2.2,
          unit: "miles_per_sgd",
          eligibleCategories: ["Foreign Currency", "Flights", "Hotels"],
          conditions: "2.2 mpd on FCY and online travel. Slightly better base rate than Visa variant.",
        },
      ],
      minMonthlySpend: 0,
      monthlySpendCap: null,
      capPeriod: "none",
      annualFee: 196.20,
      notes: "AMEX variant of Altitude. Higher base rate (1.3 vs 1.2) but AMEX acceptance less universal.",
    },
    {
      id: "dbs-vantage",
      status: "premium",
      cardName: "DBS Vantage Visa Infinite",
      issuer: "DBS",
      rewardType: "Miles",
      baseEarnRate: { rate: 1.5, unit: "miles_per_sgd" },
      bonusEarnRates: [
        {
          rate: 2.2,
          unit: "miles_per_sgd",
          eligibleCategories: ["Foreign Currency"],
          conditions: "2.2 mpd on FCY spend. Premium travel card with lounge access.",
        },
      ],
      minMonthlySpend: 0,
      monthlySpendCap: null,
      capPeriod: "none",
      annualFee: 599.50,
      dataQuality: "partial",
      notes: "Premium DBS card. Lounge access, travel benefits, S$120K min income.",
    },
    {
      id: "dbs-womans-card",
      status: "recommended",
      cardName: "DBS Woman's Card",
      issuer: "DBS",
      rewardType: "Miles",
      baseEarnRate: { rate: 0.4, unit: "miles_per_sgd" },
      bonusEarnRates: [
        {
          rate: 2.0,
          unit: "miles_per_sgd",
          eligibleCategories: ["Online Shopping"],
          conditions: "2 mpd on online shopping. Lower tier than Woman's World Card.",
        },
      ],
      minMonthlySpend: 0,
      monthlySpendCap: null,
      capPeriod: "none",
      annualFee: 163.50,
      dataQuality: "partial",
      notes: "Standard Woman's Card. Lower earn rate than Woman's World variant.",
    },
    {
      id: "dbs-takashimaya-visa",
      status: "recommended",
      cardName: "DBS Takashimaya Visa",
      issuer: "DBS",
      rewardType: "Cashback",
      baseEarnRate: { rate: 0.17, unit: "percent" },
      bonusEarnRates: [
        {
          rate: 5.0,
          unit: "percent",
          eligibleCategories: ["Groceries", "Online Shopping"],
          conditions: "5% rebate at Takashimaya department store.",
        },
      ],
      minMonthlySpend: 0,
      monthlySpendCap: null,
      capPeriod: "none",
      annualFee: 196.20,
      dataQuality: "partial",
      notes: "Niche — only useful if you shop at Takashimaya regularly.",
    },
    {
      id: "dbs-takashimaya-amex",
      status: "recommended",
      cardName: "DBS Takashimaya AMEX",
      issuer: "DBS",
      rewardType: "Cashback",
      baseEarnRate: { rate: 0.17, unit: "percent" },
      bonusEarnRates: [
        {
          rate: 6.0,
          unit: "percent",
          eligibleCategories: ["Groceries", "Online Shopping"],
          conditions: "6% rebate at Takashimaya (AMEX variant gives slightly more).",
        },
      ],
      minMonthlySpend: 0,
      monthlySpendCap: null,
      capPeriod: "none",
      annualFee: 196.20,
      dataQuality: "partial",
      notes: "AMEX variant of Takashimaya card.",
    },
    {
      id: "dbs-esso",
      status: "recommended",
      cardName: "DBS Esso Card",
      issuer: "DBS",
      rewardType: "Cashback",
      baseEarnRate: { rate: 0.3, unit: "percent" },
      bonusEarnRates: [
        {
          rate: 21.6,
          unit: "percent",
          eligibleCategories: ["Petrol"],
          conditions: "Up to 21.6% fuel savings at Esso (combining card rebate + Smiles loyalty).",
        },
      ],
      minMonthlySpend: 0,
      monthlySpendCap: null,
      capPeriod: "none",
      annualFee: 196.20,
      dataQuality: "partial",
      notes: "Niche petrol card — only worth holding if you drive frequently AND prefer Esso.",
    },

    // —— OCBC ——
    {
      id: "ocbc-infinity",
      status: "recommended",
      cardName: "OCBC INFINITY Cashback Card",
      issuer: "OCBC",
      rewardType: "Cashback",
      baseEarnRate: { rate: 1.6, unit: "percent" },
      bonusEarnRates: [
        {
          rate: 1.6,
          unit: "percent",
          eligibleCategories: ["All"],
          conditions: "Unlimited 1.6% on all spend, no min spend, no cap. Cashback auto-credited to OCBC Infinity Account.",
        },
      ],
      minMonthlySpend: 0,
      monthlySpendCap: null,
      capPeriod: "none",
      annualFee: 196.20,
      notes: "Simple, uncapped 1.6%. Good pairing with OCBC Infinity savings account.",
    },
    {
      id: "ocbc-365",
      status: "recommended",
      cardName: "OCBC 365 Card",
      issuer: "OCBC",
      rewardType: "Cashback",
      baseEarnRate: { rate: 0.25, unit: "percent" },
      bonusEarnRates: [
        {
          rate: 6.0,
          unit: "percent",
          eligibleCategories: ["Petrol"],
          conditions: "6% cashback on fuel + 22.92% discount at Caltex (18% instant).",
        },
        {
          rate: 5.0,
          unit: "percent",
          eligibleCategories: ["Dining"],
          conditions: "5% cashback on dining (local + overseas + food delivery).",
        },
        {
          rate: 3.0,
          unit: "percent",
          eligibleCategories: ["Groceries", "Telco", "Utilities", "Ride-hailing", "Entertainment", "Pharmacy", "EV Charging"],
          conditions: "3% on groceries, private hire/taxi, recurring telco/electricity, streaming, pharmacy, EV charging.",
        },
      ],
      minMonthlySpend: 800,
      monthlySpendCap: 80,
      capPeriod: "calendar",
      annualFee: 196.20,
      notes: "S$80/month cap with S$800 min spend. S$160 cap with S$1,600 min spend. 2-year AF waiver.",
    },
    {
      id: "ocbc-90n-mc",
      status: "recommended",
      cardName: "OCBC 90°N Mastercard",
      issuer: "OCBC",
      rewardType: "Miles",
      baseEarnRate: { rate: 1.3, unit: "miles_per_sgd" },
      bonusEarnRates: [
        {
          rate: 2.1,
          unit: "miles_per_sgd",
          eligibleCategories: ["Foreign Currency"],
          conditions: "2.1 mpd on FCY spend. No miles expiry. Small conversion block (1K points = 1K miles).",
        },
      ],
      minMonthlySpend: 0,
      monthlySpendCap: null,
      capPeriod: "none",
      annualFee: 196.20,
      notes: "Flexible miles card. 90°N miles have small conversion blocks, helpful for avoiding orphan points.",
    },
    {
      id: "ocbc-90n-visa",
      status: "recommended",
      cardName: "OCBC 90°N Visa Card",
      issuer: "OCBC",
      rewardType: "Miles",
      baseEarnRate: { rate: 1.3, unit: "miles_per_sgd" },
      bonusEarnRates: [
        {
          rate: 2.1,
          unit: "miles_per_sgd",
          eligibleCategories: ["Foreign Currency"],
          conditions: "Visa variant of 90°N Mastercard. Same earn rates.",
        },
      ],
      minMonthlySpend: 0,
      monthlySpendCap: null,
      capPeriod: "none",
      annualFee: 196.20,
      notes: "Visa variant of 90°N Mastercard.",
    },
    {
      id: "ocbc-frank",
      status: "recommended",
      cardName: "OCBC Frank Card",
      issuer: "OCBC",
      rewardType: "Cashback",
      baseEarnRate: { rate: 0.3, unit: "percent" },
      bonusEarnRates: [
        {
          rate: 10.0,
          unit: "percent",
          eligibleCategories: ["Online Shopping", "Mobile Contactless"],
          conditions: "10% cashback on online + mobile wallet spend. Min S$800/month.",
        },
        {
          rate: 6.0,
          unit: "percent",
          eligibleCategories: ["Foreign Currency"],
          conditions: "6% cashback on overseas spend.",
        },
      ],
      minMonthlySpend: 800,
      monthlySpendCap: 75,
      capPeriod: "calendar",
      annualFee: 196.20,
      dataQuality: "partial",
      notes: "Young adult / Gen-Z cashback card. Capped at S$75/month.",
    },
    {
      id: "ocbc-nxt",
      status: "avoid",
      cardName: "OCBC NXT Card",
      issuer: "OCBC",
      rewardType: "Cashback",
      baseEarnRate: { rate: 0.5, unit: "percent" },
      bonusEarnRates: [
        {
          rate: 1.0,
          unit: "percent",
          eligibleCategories: ["All"],
          conditions: "1% cashback on all spend. Low rate compared to alternatives.",
        },
      ],
      minMonthlySpend: 0,
      monthlySpendCap: null,
      capPeriod: "none",
      annualFee: 163.50,
      dataQuality: "partial",
      notes: "Low earn rate. Consider OCBC INFINITY (1.6%) or Absolute Cashback (1.7%) instead.",
    },

    // —— STANDARD CHARTERED ——
    {
      id: "stanchart-simply-cash",
      status: "recommended",
      cardName: "StanChart Simply Cash Card",
      issuer: "Standard Chartered",
      rewardType: "Cashback",
      baseEarnRate: { rate: 1.5, unit: "percent" },
      bonusEarnRates: [
        {
          rate: 1.5,
          unit: "percent",
          eligibleCategories: ["All"],
          conditions: "Unlimited 1.5% cashback, no min spend, no cap.",
        },
      ],
      minMonthlySpend: 0,
      monthlySpendCap: null,
      capPeriod: "none",
      annualFee: 196.20,
      notes: "Simplest cashback option. Lower rate than OCBC INFINITY (1.6%) or UOB Absolute (1.7%).",
    },
    {
      id: "stanchart-journey",
      status: "recommended",
      cardName: "StanChart Journey Card",
      issuer: "Standard Chartered",
      rewardType: "Miles",
      baseEarnRate: { rate: 1.2, unit: "miles_per_sgd" },
      bonusEarnRates: [
        {
          rate: 3.0,
          unit: "miles_per_sgd",
          eligibleCategories: ["Foreign Currency", "Flights"],
          conditions: "3 mpd on FCY + travel. 2 mpd on other local travel.",
        },
      ],
      minMonthlySpend: 0,
      monthlySpendCap: null,
      capPeriod: "none",
      annualFee: 196.20,
      dataQuality: "partial",
      notes: "Travel-focused miles card. Good FCY rate.",
    },
    {
      id: "stanchart-rewards-plus",
      status: "recommended",
      cardName: "StanChart Rewards+ Card",
      issuer: "Standard Chartered",
      rewardType: "Miles",
      baseEarnRate: { rate: 0.4, unit: "miles_per_sgd" },
      bonusEarnRates: [
        {
          rate: 4.0,
          unit: "miles_per_sgd",
          eligibleCategories: ["Online Shopping", "Mobile Contactless"],
          conditions: "10 points/dollar (4 mpd) on selected online shopping and mobile contactless.",
        },
      ],
      minMonthlySpend: 0,
      monthlySpendCap: 1000,
      capPeriod: "calendar",
      annualFee: 196.20,
      dataQuality: "partial",
      notes: "Replaces older StanChart rewards cards. Similar tier to HSBC Revolution.",
    },
    {
      id: "stanchart-visa-infinite",
      status: "premium",
      cardName: "StanChart Visa Infinite Card",
      issuer: "Standard Chartered",
      rewardType: "Miles",
      baseEarnRate: { rate: 1.0, unit: "miles_per_sgd" },
      bonusEarnRates: [
        {
          rate: 3.0,
          unit: "miles_per_sgd",
          eligibleCategories: ["Foreign Currency"],
          conditions: "3 mpd on FCY. S$150K min income. Lounge access.",
        },
      ],
      minMonthlySpend: 0,
      monthlySpendCap: null,
      capPeriod: "none",
      annualFee: 599.50,
      dataQuality: "partial",
      notes: "Older Visa Infinite — being eclipsed by StanChart Beyond Card for most high-spenders.",
    },

    // —— CIMB ——
    {
      id: "cimb-world-mc",
      status: "recommended",
      cardName: "CIMB World Mastercard",
      issuer: "CIMB",
      rewardType: "Cashback",
      baseEarnRate: { rate: 1.0, unit: "percent" },
      bonusEarnRates: [
        {
          rate: 2.0,
          unit: "percent",
          eligibleCategories: ["Foreign Currency", "Flights", "Hotels", "Dining"],
          conditions: "2% on FCY, travel, dining. No annual fee ever.",
        },
      ],
      minMonthlySpend: 0,
      monthlySpendCap: null,
      capPeriod: "none",
      annualFee: 0,
      notes: "Popular no-AF card. 2% on overseas + travel + dining is solid for cashback lovers.",
    },
    {
      id: "cimb-visa-signature",
      status: "recommended",
      cardName: "CIMB Visa Signature Card",
      issuer: "CIMB",
      rewardType: "Cashback",
      baseEarnRate: { rate: 0.2, unit: "percent" },
      bonusEarnRates: [
        {
          rate: 10.0,
          unit: "percent",
          eligibleCategories: ["Beauty", "Pharmacy", "Groceries"],
          conditions: "10% on beauty, pharmacy, groceries with min S$500/month.",
        },
      ],
      minMonthlySpend: 500,
      monthlySpendCap: 100,
      capPeriod: "calendar",
      annualFee: 0,
      dataQuality: "partial",
      notes: "No annual fee. Good for beauty/pharmacy/groceries.",
    },
    {
      id: "cimb-visa-infinite",
      status: "premium",
      cardName: "CIMB Visa Infinite Card",
      issuer: "CIMB",
      rewardType: "Cashback",
      baseEarnRate: { rate: 1.0, unit: "percent" },
      bonusEarnRates: [
        {
          rate: 3.0,
          unit: "percent",
          eligibleCategories: ["Foreign Currency"],
          conditions: "Unlimited 3% on FCY. S$120K min income. No annual fee.",
        },
      ],
      minMonthlySpend: 2000,
      monthlySpendCap: null,
      capPeriod: "calendar",
      annualFee: 0,
      notes: "No AF premium card. Requires S$2K/month spend for 3% FCY rate. S$120K min income.",
    },

    // —— AMEX ——
    {
      id: "amex-true-cashback",
      status: "recommended",
      cardName: "AMEX True Cashback Card",
      issuer: "American Express",
      rewardType: "Cashback",
      baseEarnRate: { rate: 1.5, unit: "percent" },
      bonusEarnRates: [
        {
          rate: 3.0,
          unit: "percent",
          eligibleCategories: ["Foreign Currency"],
          conditions: "3% cashback on FCY spend for first 6 months (then 1.5%).",
        },
      ],
      minMonthlySpend: 0,
      monthlySpendCap: null,
      capPeriod: "none",
      annualFee: 174.40,
      notes: "Simple unlimited cashback. Rate after intro period: 1.5% everywhere.",
    },
    {
      id: "amex-krisflyer-cc",
      status: "recommended",
      cardName: "AMEX KrisFlyer Credit Card",
      issuer: "American Express",
      rewardType: "Miles",
      baseEarnRate: { rate: 1.1, unit: "miles_per_sgd" },
      bonusEarnRates: [
        {
          rate: 2.0,
          unit: "miles_per_sgd",
          eligibleCategories: ["Flights"],
          conditions: "2 mpd on SIA Group (SQ, Scoot, KrisShop). Direct KrisFlyer miles.",
        },
      ],
      minMonthlySpend: 0,
      monthlySpendCap: null,
      capPeriod: "none",
      annualFee: 179.85,
      notes: "Cheaper alternative to KrisFlyer Ascend (no lounge perks). Direct KF miles, no conversion fee.",
    },
    {
      id: "amex-platinum-cc",
      status: "premium",
      cardName: "AMEX Platinum Credit Card",
      issuer: "American Express",
      rewardType: "Miles",
      baseEarnRate: { rate: 2.0, unit: "miles_per_sgd" },
      bonusEarnRates: [
        {
          rate: 10.0,
          unit: "miles_per_sgd",
          eligibleCategories: ["Dining"],
          conditions: "Up to 10 Membership Rewards points/dollar on select categories (promotional).",
        },
      ],
      minMonthlySpend: 0,
      monthlySpendCap: null,
      capPeriod: "none",
      annualFee: 327.00,
      dataQuality: "partial",
      notes: "Mid-tier AMEX (not the Platinum Charge). MR points + some lounge access.",
    },

    // —— MAYBANK ——
    {
      id: "maybank-fnf",
      status: "recommended",
      cardName: "Maybank Family & Friends Card",
      issuer: "Maybank",
      rewardType: "Cashback",
      baseEarnRate: { rate: 0.22, unit: "percent" },
      bonusEarnRates: [
        {
          rate: 8.0,
          unit: "percent",
          eligibleCategories: ["Groceries", "Dining", "Transport", "Telco", "Pharmacy"],
          conditions: "8% cashback on 5 selected categories with min S$800/month.",
        },
      ],
      minMonthlySpend: 800,
      monthlySpendCap: 80,
      capPeriod: "calendar",
      annualFee: 196.20,
      dataQuality: "partial",
      notes: "Popular multi-category cashback card.",
    },
    {
      id: "maybank-platinum",
      status: "avoid",
      cardName: "Maybank Platinum Visa Card",
      issuer: "Maybank",
      rewardType: "Cashback",
      baseEarnRate: { rate: 0.4, unit: "percent" },
      bonusEarnRates: [
        {
          rate: 3.33,
          unit: "percent",
          eligibleCategories: ["All"],
          conditions: "3.33% on all spend with conditions.",
        },
      ],
      minMonthlySpend: 0,
      monthlySpendCap: null,
      capPeriod: "none",
      annualFee: 20.00,
      dataQuality: "partial",
      notes: "Low AF but weak earn rates. Better alternatives exist.",
    },
    {
      id: "maybank-barcelona",
      status: "avoid",
      cardName: "Maybank FC Barcelona Card",
      issuer: "Maybank",
      rewardType: "Cashback",
      baseEarnRate: { rate: 1.6, unit: "percent" },
      bonusEarnRates: [],
      minMonthlySpend: 0,
      monthlySpendCap: null,
      capPeriod: "none",
      annualFee: 130.80,
      dataQuality: "partial",
      notes: "Niche fandom card. 1.6% is just OK — better alternatives at similar AF.",
    },
    {
      id: "maybank-xl-cashback",
      status: "recommended",
      cardName: "Maybank XL Cashback Card",
      issuer: "Maybank",
      rewardType: "Cashback",
      baseEarnRate: { rate: 0.2, unit: "percent" },
      bonusEarnRates: [
        {
          rate: 5.0,
          unit: "percent",
          eligibleCategories: ["Dining", "Foreign Currency", "Entertainment"],
          conditions: "5% cashback on dining, shopping, travel, entertainment. Min S$500/month.",
        },
      ],
      minMonthlySpend: 500,
      monthlySpendCap: 100,
      capPeriod: "calendar",
      annualFee: 87.20,
      dataQuality: "partial",
      notes: "Cashback variant of XL Rewards Card. Low AF.",
    },

    // —— TRUST BANK ——
    {
      id: "trust-cashback",
      status: "recommended",
      cardName: "Trust Cashback Card",
      issuer: "Trust Bank",
      rewardType: "Cashback",
      baseEarnRate: { rate: 1.0, unit: "percent" },
      bonusEarnRates: [
        {
          rate: 15.0,
          unit: "percent",
          eligibleCategories: ["Groceries"],
          conditions: "Up to 15% at FairPrice (stacked). 1% elsewhere. No AF.",
        },
      ],
      minMonthlySpend: 0,
      monthlySpendCap: 300,
      capPeriod: "calendar",
      annualFee: 0,
      dataQuality: "partial",
      notes: "No annual fee. Best at NTUC FairPrice. Instant issuance via Trust app.",
    },
    {
      id: "trust-link",
      status: "recommended",
      cardName: "Trust Link / NTUC Link Card",
      issuer: "Trust Bank",
      rewardType: "Cashback",
      baseEarnRate: { rate: 0.22, unit: "percent" },
      bonusEarnRates: [
        {
          rate: 21.0,
          unit: "percent",
          eligibleCategories: ["Groceries"],
          conditions: "Up to 21% at FairPrice (combining card cashback + Link points + promos).",
        },
      ],
      minMonthlySpend: 0,
      monthlySpendCap: 300,
      capPeriod: "calendar",
      annualFee: 0,
      dataQuality: "partial",
      notes: "NTUC Link integration. Best at FairPrice if you stack promos.",
    },

    // —— BOC ——
    {
      id: "boc-elite-miles",
      status: "recommended",
      cardName: "BOC Elite Miles World Mastercard",
      issuer: "Bank of China",
      rewardType: "Miles",
      baseEarnRate: { rate: 1.0, unit: "miles_per_sgd" },
      bonusEarnRates: [
        {
          rate: 2.8,
          unit: "miles_per_sgd",
          eligibleCategories: ["Foreign Currency", "Online Shopping"],
          conditions: "2.8 mpd on FCY + online. Up to 8.8 mpd with promos (Sep 2025 enhancement).",
        },
      ],
      minMonthlySpend: 0,
      monthlySpendCap: null,
      capPeriod: "none",
      annualFee: 203.30,
      notes: "Enhanced Sep 2025 with 6 mpd bonus for many categories. Watch for ongoing promos.",
    },
    {
      id: "boc-sheng-siong",
      status: "recommended",
      cardName: "BOC Sheng Siong Card",
      issuer: "Bank of China",
      rewardType: "Cashback",
      baseEarnRate: { rate: 0.3, unit: "percent" },
      bonusEarnRates: [
        {
          rate: 12.0,
          unit: "percent",
          eligibleCategories: ["Groceries"],
          conditions: "Up to 12% cashback at Sheng Siong outlets.",
        },
      ],
      minMonthlySpend: 0,
      monthlySpendCap: 90,
      capPeriod: "calendar",
      annualFee: 32.10,
      dataQuality: "partial",
      notes: "Niche — only useful if you shop at Sheng Siong regularly. Very low AF.",
    },
    {
      id: "boc-family",
      status: "recommended",
      cardName: "BOC Family Card",
      issuer: "Bank of China",
      rewardType: "Cashback",
      baseEarnRate: { rate: 0.3, unit: "percent" },
      bonusEarnRates: [
        {
          rate: 10.0,
          unit: "percent",
          eligibleCategories: ["Groceries", "Dining", "Online Shopping"],
          conditions: "Up to 10% cashback on groceries + dining + online.",
        },
      ],
      minMonthlySpend: 0,
      monthlySpendCap: 100,
      capPeriod: "calendar",
      annualFee: 205.20,
      dataQuality: "partial",
      notes: "Family-focused cashback.",
    },
    {
      id: "boc-zaobao",
      status: "recommended",
      cardName: "BOC Zaobao Card",
      issuer: "Bank of China",
      rewardType: "Cashback",
      baseEarnRate: { rate: 1.5, unit: "percent" },
      bonusEarnRates: [
        {
          rate: 10.0,
          unit: "percent",
          eligibleCategories: ["Dining", "Online Shopping"],
          conditions: "Up to 10% on dining + online with qualifying spend.",
        },
      ],
      minMonthlySpend: 0,
      monthlySpendCap: 100,
      capPeriod: "calendar",
      annualFee: 205.20,
      dataQuality: "partial",
      notes: "Niche card tied to Zaobao publication.",
    },
    {
      id: "boc-visa-infinite",
      status: "premium",
      cardName: "BOC Visa Infinite Card",
      issuer: "Bank of China",
      rewardType: "Cashback",
      baseEarnRate: { rate: 1.6, unit: "percent" },
      bonusEarnRates: [
        {
          rate: 1.8,
          unit: "percent",
          eligibleCategories: ["Foreign Currency"],
          conditions: "1.8% cashback on overseas spend. Priority Pass lounge access.",
        },
      ],
      minMonthlySpend: 0,
      monthlySpendCap: null,
      capPeriod: "none",
      annualFee: 374.50,
      dataQuality: "partial",
      notes: "Premium BOC card. S$120K min income. Lounge access.",
    },

    // —— DCS ——
    {
      id: "dcs-flex",
      status: "recommended",
      cardName: "DCS Flex Visa Platinum Card",
      issuer: "DCS",
      rewardType: "Cashback",
      baseEarnRate: { rate: 0.3, unit: "percent" },
      bonusEarnRates: [
        {
          rate: 8.0,
          unit: "percent",
          eligibleCategories: ["Dining", "Online Shopping"],
          conditions: "Up to 8% cashback on flexible categories.",
        },
      ],
      minMonthlySpend: 0,
      monthlySpendCap: null,
      capPeriod: "none",
      annualFee: 130.80,
      dataQuality: "partial",
      notes: "DCS = Diners Club Singapore. Lower acceptance than Visa/MC but still usable.",
    },
    {
      id: "dcs-ultimate-mc",
      status: "recommended",
      cardName: "DCS Ultimate Platinum Mastercard",
      issuer: "DCS",
      rewardType: "Cashback",
      baseEarnRate: { rate: 2.0, unit: "percent" },
      bonusEarnRates: [
        {
          rate: 2.0,
          unit: "percent",
          eligibleCategories: ["All"],
          conditions: "Flat 2% unlimited cashback on all spend.",
        },
      ],
      minMonthlySpend: 0,
      monthlySpendCap: null,
      capPeriod: "none",
      annualFee: 196.20,
      dataQuality: "partial",
      notes: "Flat 2% everywhere. Competitive with UOB Absolute (1.7%).",
    },
    {
      id: "dcs-ultimate-upi",
      status: "recommended",
      cardName: "DCS Ultimate Platinum UnionPay",
      issuer: "DCS",
      rewardType: "Cashback",
      baseEarnRate: { rate: 2.0, unit: "percent" },
      bonusEarnRates: [
        {
          rate: 2.0,
          unit: "percent",
          eligibleCategories: ["All"],
          conditions: "Flat 2% unlimited cashback. UnionPay variant.",
        },
      ],
      minMonthlySpend: 0,
      monthlySpendCap: null,
      capPeriod: "none",
      annualFee: 196.20,
      dataQuality: "partial",
      notes: "UnionPay version of DCS Ultimate. Good for China/UnionPay merchants.",
    },
    {
      id: "dcs-cashback",
      status: "recommended",
      cardName: "DCS CASHBACK Card",
      issuer: "DCS",
      rewardType: "Cashback",
      baseEarnRate: { rate: 5.0, unit: "percent" },
      bonusEarnRates: [
        {
          rate: 5.0,
          unit: "percent",
          eligibleCategories: ["All"],
          conditions: "5% cashback (usually with conditions/caps — verify).",
        },
      ],
      minMonthlySpend: 0,
      monthlySpendCap: null,
      capPeriod: "none",
      annualFee: 196.20,
      dataQuality: "partial",
      notes: "Verify exact cashback mechanics with DCS before relying on.",
    },
    {
      id: "dcs-donki",
      status: "recommended",
      cardName: "DCS DON DON DONKI Card",
      issuer: "DCS",
      rewardType: "Cashback",
      baseEarnRate: { rate: 0.5, unit: "percent" },
      bonusEarnRates: [
        {
          rate: 5.0,
          unit: "percent",
          eligibleCategories: ["Groceries"],
          conditions: "5% cashback at Don Don Donki stores.",
        },
      ],
      minMonthlySpend: 0,
      monthlySpendCap: null,
      capPeriod: "none",
      annualFee: 196.20,
      dataQuality: "partial",
      notes: "Niche — only useful if you shop at Don Don Donki regularly.",
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
    status: card.status,
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
  // For unowned suggestions, filter out "avoid" cards — no point recommending cards MileLion says don't bother with
  const unownedPool = CARDS_DATA.cards.filter((c) => !ownedCards.includes(c.id) && c.status !== "avoid");

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
const StatusBadge = ({ status }) => {
  if (status === "recommended") return null; // default, no badge needed
  const config = {
    premium: { label: "Premium", bg: "bg-[#d4a574]/20", text: "text-[#7a5a2e]", border: "border-[#d4a574]" },
    avoid: { label: "⚠ Avoid", bg: "bg-[#c87a7a]/20", text: "text-[#8a3a3a]", border: "border-[#c87a7a]" },
  };
  const c = config[status];
  if (!c) return null;
  return (
    <span className={`inline-block px-2 py-0.5 text-[10px] sm:text-xs font-bold uppercase tracking-wider rounded ${c.bg} ${c.text} border ${c.border}`}>
      {c.label}
    </span>
  );
};

// Helper: group cards by status for display
const GROUPED_CARDS = {
  recommended: CARDS_DATA.cards.filter((c) => c.status === "recommended" || !c.status),
  premium: CARDS_DATA.cards.filter((c) => c.status === "premium"),
  avoid: CARDS_DATA.cards.filter((c) => c.status === "avoid"),
};

const CARD_GROUP_LABELS = {
  recommended: { title: "Core cards (MileLion 2026 rotation)", subtitle: "Best everyday earn rates" },
  premium: { title: "Premium cards", subtitle: "High annual fee, but valuable for certain users" },
  avoid: { title: "Cards to avoid", subtitle: "MileLion says these aren't worth holding. Tick them here only if you already have them so we can warn you." },
};

// Reusable card picker that shows grouped sections with status badges, plus search
const CardPickerGroups = ({ ownedCards, onToggleCard, compact = false }) => {
  const [search, setSearch] = useState("");

  const query = search.trim().toLowerCase();
  const filterFn = (card) => {
    if (!query) return true;
    return (
      card.cardName.toLowerCase().includes(query) ||
      card.issuer.toLowerCase().includes(query) ||
      (card.rewardType || "").toLowerCase().includes(query)
    );
  };

  const filtered = {
    recommended: GROUPED_CARDS.recommended.filter(filterFn),
    premium: GROUPED_CARDS.premium.filter(filterFn),
    avoid: GROUPED_CARDS.avoid.filter(filterFn),
  };

  const totalMatches = filtered.recommended.length + filtered.premium.length + filtered.avoid.length;

  return (
    <div>
      {/* Search box — essential at 70+ cards */}
      <div className="mb-5 relative">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search your cards by name or bank…"
          className="w-full px-4 py-3 pl-10 text-sm sm:text-base text-[#2d3a2d] bg-white border-2 border-[#c4b8a8] rounded-lg focus:border-[#5a6b5a] focus:outline-none"
          aria-label="Search cards"
        />
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8a8375] text-base pointer-events-none">🔍</span>
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8a8375] hover:text-[#2d3a2d] text-sm font-bold"
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
        {query && (
          <p className="text-xs text-[#5a5648] mt-2">
            {totalMatches} {totalMatches === 1 ? "match" : "matches"} · <strong>{ownedCards.length}</strong> in your wallet
          </p>
        )}
      </div>

      <div className="space-y-6">
        {["recommended", "premium", "avoid"].map((statusKey) => {
          const group = filtered[statusKey];
          if (group.length === 0) return null;
          const meta = CARD_GROUP_LABELS[statusKey];
          return (
            <div key={statusKey}>
              <div className="mb-2 sm:mb-3">
                <h4 className={`text-sm sm:text-base font-bold ${statusKey === "avoid" ? "text-[#8a3a3a]" : "text-[#2d3a2d]"}`}>
                  {meta.title}
                </h4>
                <p className="text-xs sm:text-sm text-[#5a5648] mt-0.5">{meta.subtitle}</p>
              </div>
              <div className="space-y-2">
                {group.map((card) => {
                  const owned = ownedCards.includes(card.id);
                  return (
                    <button
                      key={card.id}
                      onClick={() => onToggleCard(card.id)}
                      aria-pressed={owned}
                      className={`w-full flex items-center justify-between p-3 sm:p-4 border-2 rounded-lg text-left transition-colors ${
                        owned
                          ? statusKey === "avoid"
                            ? "border-[#c87a7a] bg-[#c87a7a]/10"
                            : "border-[#5a6b5a] bg-[#e8e2d5]"
                          : "border-[#c4b8a8] bg-white hover:border-[#8a8375]"
                      }`}
                    >
                      <div className="flex-1 pr-3 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="text-sm sm:text-base font-bold text-[#2d3a2d] leading-tight">{card.cardName}</span>
                          <StatusBadge status={card.status} />
                          {card.dataQuality === "partial" && (
                            <span className="text-[10px] sm:text-xs text-[#8a8375] italic">(verify T&Cs)</span>
                          )}
                        </div>
                        <div className="text-xs sm:text-sm text-[#5a5648]">
                          {card.issuer} · {card.rewardType}
                        </div>
                      </div>
                      <div
                        className={`w-5 h-5 sm:w-6 sm:h-6 border-2 rounded flex items-center justify-center flex-shrink-0 ${
                          owned
                            ? statusKey === "avoid"
                              ? "border-[#c87a7a] bg-[#c87a7a]"
                              : "border-[#5a6b5a] bg-[#5a6b5a]"
                            : "border-[#c4b8a8] bg-white"
                        }`}
                      >
                        {owned && <span className="text-white text-xs sm:text-sm font-bold">✓</span>}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}

        {query && totalMatches === 0 && (
          <div className="text-center py-8 text-[#5a5648]">
            <p className="text-base italic mb-2">No cards match "{search}"</p>
            <button onClick={() => setSearch("")} className="text-sm font-bold text-[#5a6b5a] underline">
              Clear search
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

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
          <CardPickerGroups ownedCards={ownedCards} onToggleCard={onToggleCard} />
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
        <div className="flex items-center gap-2">
          <StatusBadge status={result.status} />
          <p className="text-xs sm:text-sm font-bold text-[#5a5648]">{result.issuer}</p>
        </div>
      </div>

      {result.status === "avoid" && (
        <div className="mb-4 p-3 bg-[#c87a7a]/10 border-2 border-[#c87a7a] rounded-lg">
          <p className="text-xs sm:text-sm font-bold text-[#8a3a3a]">
            ⚠️ This card is on the "avoid" list. Consider better alternatives in your wallet, or see "Consider Adding" suggestions below.
          </p>
        </div>
      )}

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

      <div className="mb-6 max-h-[50vh] overflow-y-auto pr-1">
        <CardPickerGroups ownedCards={ownedCards} onToggleCard={onToggleCard} />
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
                Also suggest cards I don't own that would earn significantly more (excludes cards MileLion says to avoid)
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
