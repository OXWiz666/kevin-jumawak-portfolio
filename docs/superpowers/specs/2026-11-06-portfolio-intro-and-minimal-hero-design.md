# Portfolio intro and minimal hero design

## Goal

Give the portfolio a quieter, Bryllim-inspired home identity without copying
its assets: a cardless monochrome portrait, spare inverted-outline sidebar
actions, and a first-load welcome that never reveals the page underneath
before the intro is ready.

## Scope

### Home portrait

- Replace the framed `home-portrait-card` composition with a free-standing
  portrait figure that uses the existing local avatar.
- Remove the card shell, lower caption panel, decorative corner controls, and
  duplicate framing layers.
- Retain a tiny editorial identifier and location only if they remain visually
  subordinate to the portrait; the portrait itself should sit in open space.
- Use a monochrome / halftone-like treatment made from CSS filters and blend
  layers, not a generated or copied image.
- Add one restrained interaction: a short entrance reveal plus a small hover
  shift. `prefers-reduced-motion` disables both.

### Sidebar actions

- Give Contact, Poke Me, the footer controls, and the sidebar reveal a shared
  monochrome treatment: transparent surface, one-pixel current-color outline,
  white/black foreground contrast determined by the active theme.
- Change the primary label to "Contact me" and preserve its copy-email and
  mailto fallback behavior.
- On hover and keyboard focus, invert the surface and text; on press, use a
  short scale/translation response. Keep the green availability signal only as
  status information, not as button chrome.

### First-load intro gate

- Render an initially opaque, accessible intro gate in the home page HTML so
  it covers the document before React hydration.
- Run a small synchronous bootstrap before hydration that bypasses the gate
  for a prior session or reduced-motion preference. A client component then
  owns the animation, skip action, focus behavior, session persistence, and
  fade-out.
- The home content must remain hidden from visual display while the gate is
  active. It remains structurally available for accessibility and search
  indexing; the dialog is modal while present.
- Keep intro behavior limited to the home route. Navigation within the app
  continues using the existing template view transitions.

## Component boundaries

- `components/pixel-pet-intro.tsx`: owns the intro lifecycle and exposes a
  stable root marker for browser tests; it no longer begins in an unguarded
  idle state.
- A small server-rendered home gate / bootstrap boundary supplies the initial
  cover and works without waiting for a client effect.
- `app/page.tsx`: contains the revised semantic portrait markup only.
- `components/sidebar.tsx`: changes only labels/classes needed for the shared
  action treatment; hit counting and theme handling stay unchanged.
- `app/globals.css`: replaces contradictory portrait overrides with a single
  final visual layer and defines the shared outline interactions.

## Verification

- Add focused unit tests for intro bootstrap decision behavior and update the
  route snapshot expectation from the old portrait-card class to the new
  portrait landmark.
- Add Playwright configuration and a first-load browser test using a fresh
  context. It must assert that the intro cover is visible immediately, the
  home hero is not visually exposed underneath, and the hero becomes visible
  after Skip.
- Exercise reduced-motion / returning-session bypass behavior in a separate
  browser test or unit test, depending on the smallest stable seam.
- Run the focused tests, full test suite, lint, production build, and
  Playwright test before handoff.

## Constraints and non-goals

- Do not import Bryllim images, copy its copywriting, or add a second profile
  identity.
- Do not redesign project pages or alter existing contact/hit-counter data
  behavior.
- Do not make first-load animation block keyboard dismissal; Escape, Enter,
  Space, and the visible Skip button retain their current intent.
