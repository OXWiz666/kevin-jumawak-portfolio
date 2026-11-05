# Kevin Jumawak Portfolio

A Next.js App Router portfolio for Lord Kevin Francis G. Jumawak, built from the supplied floating-sidebar portfolio design system.

## Run locally

```powershell
npm install --legacy-peer-deps
npm run dev
```

## GitHub activity

Create `.env.local` with a GitHub personal access token to enable the contribution calendar:

```text
GITHUB_TOKEN=github_pat_...
```

The token is read only on the server. GitHub GraphQL contribution data and GitHub REST repository data are cached for 12 hours. Without a token, rate-limit capacity, or a valid response, the GitHub section remains usable and displays a graceful unavailable state.

## Shared “Hit Me” counter

The compact sidebar hammer is designed to be shared globally. It records only aggregate totals: no visitor identity, email address, IP address, or event log is stored.

1. Create or choose a Supabase project, then apply [the SQL migration](./supabase/migrations/20261021140000_portfolio_hit_counts.sql) in its SQL editor or migration workflow.
2. Copy `.env.example` to `.env.local` and set these server-only values:

   ```text
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

3. Restart the development server and visit `GET /api/hits` to confirm it returns `{ "kind": "success", "totals": ... }`.

Never expose the service-role key in a `NEXT_PUBLIC_` variable. Until both server-side values are configured, the sidebar stays usable and shows the counter as unavailable.
