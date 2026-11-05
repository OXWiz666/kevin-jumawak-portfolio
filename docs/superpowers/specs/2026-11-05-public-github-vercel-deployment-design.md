# Public GitHub and Vercel Deployment Design

## Intent

Publish the existing Kevin Jumawak portfolio as a public GitHub repository and make its production site available at `kevinjumawak.vercel.app`.

## Goals

- Preserve the portfolio's current source and user-visible design.
- Create a new public GitHub repository named `kevin-jumawak-portfolio`.
- Publish the current `main` branch to that repository.
- Create a Vercel project connected to the repository and deploy the production build.
- Assign Vercel's project domain `kevinjumawak.vercel.app` when available.

## Non-goals

- No redesign or feature work.
- No publication of `.env`, credentials, development caches, or local-only files.
- No changes to an unrelated GitHub repository or Vercel project.

## Approaches

1. **New public repository from this working tree — selected.** It keeps the existing Git history, makes `main` the production branch, and is isolated from any prior remote.
2. Connect the working tree to a pre-existing repository. Rejected because no target repository was named and that could overwrite unrelated history.

## Delivery

1. Verify the intended source set, ensuring `.gitignore` excludes credentials and generated output.
2. Create a clean `main` history containing only publishable portfolio source, because the pre-existing local history tracks `.env`, `node_modules`, and `.next`.
3. Create the public GitHub repository, add it as `origin`, then push the clean `main` history.
4. Create and connect a Vercel project, deploy production, and map `kevinjumawak.vercel.app`.
5. Confirm the production deployment succeeds and the requested URL responds.

## Decisions and Constraints

- Repository name: `kevin-jumawak-portfolio`.
- Visibility: public, as explicitly requested.
- Primary branch: `main`, as explicitly requested.
- Project domain: `kevinjumawak.vercel.app`. Vercel canonicalizes generated domains to lowercase.
- Existing source changes are treated as the portfolio to publish; generated `.next` files and `node_modules` are excluded.
- The existing `.env` remains local and is not committed. It will also be absent from the new repository's history. The optional `GITHUB_TOKEN` is not required for a successful deployment; the site supports a graceful fallback.

## Verification

- Run lint, tests, TypeScript validation, and a production build before publishing.
- Confirm the GitHub repository is public and `main` contains the portfolio commit.
- Confirm the Vercel production deployment is ready and the requested domain resolves.
