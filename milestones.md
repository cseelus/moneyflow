# Minimal milestone roadmap

## 1. MVP (week-end)
- Next.js page with "Connect wallet" (Phantom) → fetch SPL and SOL balances via Helius RPC, convert to USD with CoinGecko.
- Render a single stacked bar for "right now."

## 2. Add history (1-2 weeks)
- Supabase table daily_portfolio (user_id, ts, symbol, amount, usd_value).
- Scheduled Edge Function every hour: iterate wallets → write snapshot rows.
- Replace the single bar with Recharts + so you can pan/zoom through time.

## 3. Performance polish
- Wrap the bar list in from @tanstack/virtual so only 20–30 bars mount at once, keeping memory low.
- Use TanStack Query's refetchInterval for live price ticks without manual polling.

## 4. Multi-wallet & auth
- Store an array of wallet pubkeys per Supabase user row (simple JSONB column).
- Query balances in parallel with Promise.all + useQueries.

## 5. Chain & bank expansion
- Drop Ethereum support in by installing wagmi; reuse the same asset table, just new chain field.
- Add Plaid Link button for bank accounts; incoming webhook writes fiat balances to the same table.

## 6. Native apps
- Create an Expo monorepo package; reuse queries, Supabase SDK, and most components.
- Use react-native-svg + react-native-reanimated to port the Recharts logic (or swap for Victory Native).