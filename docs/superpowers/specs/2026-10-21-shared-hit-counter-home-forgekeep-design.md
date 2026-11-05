# Shared Hit Counter and ForgeKeep Portfolio Redesign

## Purpose

Refresh the personal portfolio without replacing its floating-sidebar, monochrome editorial design system. The work adds a shared global hit counter, makes the sidebar interaction more expressive, rebuilds the homepage composition, and completes the ForgeKeep project presentation with verified content and official visual assets.

## Scope

- Persist a global hit count and a calendar-month hit count in Supabase.
- Keep the Supabase service credential server-only and expose a narrow Next.js route for reads and increments.
- Make the compact sidebar hammer control show the total, animate a hammer impact and count flight, and show the current-month count above the footer.
- Rebuild the homepage hero around a larger portrait, factual identity details, and a wider editorial composition.
- Use the official ForgeKeep logo and Open Graph image in the project row and project detail page.
- Replace ForgeKeep placeholders with verified functionality and implementation information.
- Preserve reduced-motion behavior, keyboard accessibility, mobile drawer behavior, light/dark tokens, and existing routes.

## Non-goals

- No authentication, account system, visitor profiling, or personal data collection.
- No fabricated product metrics, customers, screenshots, implementation challenges, or achievements.
- No replacement of the supplied floating-sidebar portfolio design system.

## Shared Hit Counter

### Data model

Create a `portfolio_hit_counts` table with one row for each UTC calendar month:

- `month_start date primary key`
- `monthly_count bigint not null default 0`
- `lifetime_count bigint not null default 0`
- `updated_at timestamptz not null default now()`

The table is not directly accessible from the browser. Row-level security remains enabled with no public table policies. A database function atomically inserts or increments the current month row and returns both displayed values.

### Server boundary

- `GET /api/hits` returns the current totals, handling an unavailable Supabase configuration with a safe unavailable state.
- `POST /api/hits` performs a single atomic increment and returns refreshed totals.
- Both routes run server-side and use `SUPABASE_URL` plus `SUPABASE_SERVICE_ROLE_KEY`; neither variable is exposed with a `NEXT_PUBLIC_` prefix.
- The browser stores only a local timestamp to prevent accidental rapid repeats. No IP address, identity, or event log is stored.

### Sidebar interaction

The hammer button remains compact. It contains the current lifetime count and, when pressed, animates the hammer, impact burst, and an increment label that rises inside the button. The static text immediately above the footer reads `Hit this month` and displays the current month count. Loading, configuration error, and unavailable states remain visually calm and do not prevent navigation.

## Homepage redesign

### Layout

Increase the desktop content cap to approximately 920px while retaining the fixed floating sidebar. The hero uses a two-column editorial composition: a large portrait frame on the left and factual identity content on the right. At tablet and mobile widths it becomes one column, with the portrait first.

### Content

The hero includes Kevin Jumawak’s display name, full-stack developer role, location, a concise summary, availability/contact action, and verified details: BS Information Technology at STI College General Santos, graduation in 2026, and focus on product engineering, cloud architecture, and applied AI. It does not use invented numeric statistics.

Selected projects, stack, and GitHub retain their existing content but receive stronger section rhythm, tactile rows, and consistent entry transitions. Animations stay under 140ms for direct interaction and obey `prefers-reduced-motion`.

## ForgeKeep project presentation

### Visual assets

Use the ForgeKeep official logo at `https://www.forgekeep.online/forgekeep-icon.png` and official Open Graph image at `https://www.forgekeep.online/opengraph-image`. Asset alternate text describes the assets without asserting they are in-product screenshots.

### Verified content

The ForgeKeep detail page describes an MMORPG guild operations platform for boss schedules, attendance, member management, loot, inventory, DKP, accounting, Discord operations, OCR-supported attendance automation, and real-time data synchronization. The technology section includes verified tools from the supplied resume: Next.js, TypeScript, Supabase, PostgreSQL, Prisma, and Hono.js.

The live website remains the authoritative external link. Sections for challenges and lessons remain candid when supporting detail is not available; they do not receive invented claims.

## Accessibility and resilience

- Hammer and drawer controls use descriptive labels and real buttons.
- Count updates use an aria-live region.
- The close control remains keyboard reachable and gets an icon-based visual treatment.
- Remote ForgeKeep visual assets have graceful placeholders when unavailable.
- Supabase API failures preserve the UI and show an unavailable state rather than an incorrect count.

## Verification

- Unit-test data configuration, month-key normalization, and response validation.
- Test the API route’s unavailable and success behavior using injected fetch/database boundaries.
- Run all existing tests, lint, TypeScript validation, and the production build.
- Test desktop and mobile sidebar interaction, the reduced-motion fallback, the wider homepage layout, and ForgeKeep fallback visuals in the local preview.
