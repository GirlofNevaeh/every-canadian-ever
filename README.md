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

No environment variables are required. The site does not use a database.
