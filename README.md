# Card Optimizer · Singapore

> A dyslexia-friendly credit card optimizer for Singapore, updated with 2026 card rates.

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-3-06B6D4?logo=tailwindcss&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-8a8375)

Tell the app how much you're about to spend and on what, and it recommends the best card from your wallet. Scoped to the cards you actually own, with live tracking of monthly caps and minimum spend requirements.

---

## What's new in v2 (April 2026)

- **Dyslexia-friendly typography.** Atkinson Hyperlegible font (a research-backed typeface by the Braille Institute), with Verdana and Tahoma as system fallbacks. Generous 1.6 line-height, 18px base font size, and warm off-white background (#fbf8f1) to reduce visual stress.
- **Wallet-first onboarding.** First-time users must select the cards they actually hold before seeing any recommendations. This ensures advice is personalized from the start.
- **2026 card data.** All 16 cards now reflect current rates from The MileLion's 2026 Strategy (10 Jan 2026) and LobangSis. Notably: DBS yuu Card with 10 mpd, OCBC Rewards 6 mpd e-commerce promo, HSBC Revolution cap boost, UOB Preferred Platinum Visa's split sub-caps.
- **Optional unowned card suggestions.** Toggle on/off — when enabled, the app will surface cards you don't own that would significantly outperform your wallet for a given spend.
- **Accessibility improvements.** Clear focus rings, high contrast, respect for `prefers-reduced-motion`, proper ARIA labels, and keyboard navigation.

---

## Features

- **Wallet management** — only cards you own appear in recommendations
- **Monthly spend tracker** — auto-promotes next best card when primary hits its cap
- **Minimum spend watch** — tells you how far to go before unlocking each card's bonus
- **Automatic month reset** — wipes tracking on the 1st of each month
- **Runner-up + unowned suggestion** — secondary recommendations when useful
- **Zero backend** — all data stays in your browser, fully private

---

## Quick start

Requires [Node.js 18+](https://nodejs.org).

```bash
npm install
npm run dev
```

Open `http://localhost:5173`.

---

## Deploy to Vercel

### 1. Push to GitHub (via GitHub Desktop)

Open the `card-optimizer` folder in GitHub Desktop → Publish Repository.

### 2. Connect to Vercel

1. Sign in at [vercel.com](https://vercel.com) with your GitHub account
2. **Add New → Project**
3. Import your `card-optimizer` repo
4. Click **Deploy** (settings auto-detected)

### 3. Future updates

Any `git push` auto-deploys within ~60 seconds.

---

## Updating card data

Card definitions live in `src/App.jsx` at the top (`CARDS_DATA` constant). To add or update a card:

1. Update the array
2. Commit and push
3. Vercel redeploys automatically

Sources used for the current dataset:
- [The MileLion's 2026 Credit Card Strategy](https://milelion.com/2026/01/10/the-milelions-2026-credit-card-strategy/) (10 Jan 2026)
- [LobangSis credit card reviews](https://lobangsis.com/)

> ⚠️ Card terms change frequently. Always verify against the issuer's T&Cs before making decisions.

---

## Accessibility

The UI is designed to be usable by people with dyslexia and other reading differences:

- **Font**: Atkinson Hyperlegible (open-source, designed for readability), with Verdana/Tahoma fallbacks
- **Size**: 18px base; large 2xl/3xl/4xl sizes for key numbers and headings
- **Spacing**: 1.6 line-height globally, generous padding on all interactive elements
- **Color**: Warm off-white background (avoids stark white); dark sage text for high contrast
- **Motion**: Respects `prefers-reduced-motion`
- **Focus**: 3px visible focus ring on all keyboard-focused elements
- **Semantic HTML**: Proper labels, ARIA roles, button semantics throughout

---

## Disclaimer

For personal financial planning only. Not financial advice. Card terms change without notice; the author makes no guarantees about the accuracy of recommendations. Verify with the card issuer before making decisions.

---

## License

[MIT](./LICENSE)
