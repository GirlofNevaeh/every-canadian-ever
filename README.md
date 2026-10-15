# Every Canadian Ever

A reading site about Canada's provinces, territories, Indigenous nations, and prime ministers.

## Deploy on Vercel

Import this repository. Use these settings if Vercel does not fill them in:

| Setting | Value |
| --- | --- |
| Framework | Other |
| Node.js | 22 |
| Install command | `npm ci --omit=dev --no-audit --no-fund` |
| Build command | `npm run build` |
| Output | Leave empty. The build writes the Vercel Build Output API to `.vercel/output`. |

No environment variables are required to build. To take payment, set `STRIPE_SECRET_KEY` from the Every School Ever Stripe account. The one-time price is CA$9.99 (`price_1UQmITQOJmxJjHnmJ58rx6WJ`). Override it with `STRIPE_PRICE_ID` if you change the price.

