# CLAUDE.md — Cerve Root Marketing Website

This file provides guidance to Claude Code when working with the `website/` sub-project.

## Overview

This is the **cerve.in** root marketing website — a Vite + React 18 single-page application that serves as the main landing page for the Cerve platform. It showcases the Cerve ecosystem (Seller Dashboard + Claw AI) and explains ONDC to potential sellers.

- **Domain**: `cerve.in`
- **Tech stack**: Vite 5 + React 18 + TailwindCSS v3 + Framer Motion 11 + React Router v6
- **Design system**: Dark theme matching the Claw website (`claw/`), with purple-cyan gradient accents
- **Deployment**: Built to `dist/`, served via nginx at `/usr/share/nginx/html/website`

## Development Commands

```bash
cd website/
npm install              # Install dependencies
npm run dev              # Start Vite dev server on port 5173
npm run build            # Production build to website/dist/
npm run preview          # Preview production build
npm test                 # Run Vitest in watch mode
npm run test:run         # Single test run
npm run test:coverage    # Coverage report (enforces 100% thresholds)
```

## Project Structure

```
website/
├── public/
│   └── cerve-logo.png           # Logo (shared with claw/)
├── src/
│   ├── components/
│   │   ├── home/                # Home page sections
│   │   │   ├── Hero.jsx         # Hero with headline, stats, CTAs
│   │   │   ├── Products.jsx     # Seller Dashboard + Claw AI cards
│   │   │   ├── Features.jsx     # 6 platform feature cards
│   │   │   ├── ONDC.jsx         # ONDC explainer + 3-step flow
│   │   │   ├── Categories.jsx   # 6 ONDC category cards (RET10-RET18)
│   │   │   └── CTA.jsx          # Final call-to-action
│   │   ├── layout/
│   │   │   ├── Layout.jsx       # Root layout with Outlet, scroll-to-top
│   │   │   ├── Navbar.jsx       # Fixed navbar with anchor scroll links
│   │   │   └── Footer.jsx       # Footer with platform links
│   │   └── shared/              # Reusable design system components
│   │       ├── AnimatedSection.jsx  # Scroll-triggered fade-up wrapper
│   │       ├── Button.jsx       # Gradient/secondary/outline button
│   │       ├── Card.jsx         # Hover-lift card with optional gradient border
│   │       ├── Icon.jsx         # SVG icon library (HeroIcons-based)
│   │       └── SectionHeading.jsx   # Section title + subtitle
│   ├── constants/
│   │   ├── features.js          # features[], categories[], ondcSteps[]
│   │   └── products.js          # products[] (Seller Dashboard, Claw AI)
│   ├── pages/
│   │   └── HomePage.jsx         # Composes all home sections
│   ├── __mocks__/
│   │   └── framer-motion.jsx    # Test mock: strips animation props
│   ├── __tests__/               # Mirrors src/ structure
│   ├── App.jsx                  # Routes with lazy loading
│   ├── main.jsx                 # React root entry point
│   ├── index.css                # Tailwind layers + custom utilities
│   └── test-setup.js            # Imports @testing-library/jest-dom
├── index.html                   # HTML entry with OG meta tags, Google Fonts
├── package.json
├── vite.config.js               # Build + test config with 100% coverage thresholds
├── tailwind.config.js           # cerve.* color tokens, gradients, fonts
└── postcss.config.js
```

## Design System

### Color Tokens (TailwindCSS `cerve.*` namespace)

| Token             | Hex       | Usage                          |
|-------------------|-----------|--------------------------------|
| `cerve-bg`        | `#0a0a0f` | Page background                |
| `cerve-card`      | `#12121a` | Card / elevated surface        |
| `cerve-elevated`  | `#1a1a2e` | Higher elevation surface       |
| `cerve-primary`   | `#6c5ce7` | Purple — primary interactive   |
| `cerve-secondary` | `#00d2ff` | Cyan — accent / highlight      |
| `cerve-text`      | `#e0e0e0` | Body text                      |
| `cerve-muted`     | `#8888aa` | Secondary / muted text         |
| `cerve-success`   | `#2EB086` | Success / check marks          |
| `cerve-danger`    | `#FF5959` | Error states                   |
| `cerve-blue`      | `#1c75bc` | Cerve brand blue               |

### Gradients

- `bg-cerve-gradient` → `linear-gradient(135deg, #6c5ce7, #00d2ff)` — Primary brand gradient
- `bg-cerve-gradient-hover` → lighter hover variant

### CSS Utility Classes (defined in `index.css`)

- `.text-gradient` — Apply purple-cyan gradient to text
- `.glow-primary` — Purple glow box-shadow
- `.glow-secondary` — Cyan glow box-shadow
- `.border-gradient` — Gradient border effect using pseudo-element mask

### Typography

- **Sans**: Inter (400–800) — headings and body
- **Mono**: JetBrains Mono (400–500) — code and category codes

### Design Patterns

- **Section spacing**: `py-24` standard section padding
- **Max width**: `max-w-7xl` (1280px) for content containers
- **Grid**: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` responsive pattern
- **Cards**: `rounded-xl`, `border border-white/5`, hover lift via Framer Motion (`y: -4, scale: 1.02`)
- **Animations**: Scroll-triggered fade-up (`AnimatedSection`), staggered delays (`i * 0.1`)
- **Responsive nav**: Desktop links + mobile hamburger, backdrop blur on scroll

### Shared with Claw

This design system mirrors `claw/` exactly (same colors, fonts, animation patterns). The only difference is the TailwindCSS namespace (`cerve.*` vs `claw.*`). When updating the design system, keep both projects in sync.

## Architecture

### Routing

Single-page app with one route (`/`). The `Navbar` uses anchor links (`#products`, `#features`, `#ondc`, `#categories`) with smooth scroll via `element.scrollIntoView()`.

### Component Patterns

- **Shared components** (`shared/`) are the design system primitives — use them consistently
- **Home sections** (`home/`) are page-level sections that compose shared components
- **Constants** (`constants/`) hold all content data — edit these to update page text
- **Layout** (`layout/`) wraps all pages with Navbar + Footer

### Button Rendering Logic

`Button` renders as:
- `<Link>` when `to` prop is provided (internal navigation)
- `<a target="_blank">` when `href` prop is provided (external links)
- `<button>` when neither is provided

### Icon Library

`Icon` component provides 21 SVG icons (HeroIcons-based). Renders fallback `sparkle` icon for unknown names. Add new icons by adding SVG path entries to the `icons` object in `Icon.jsx`.

Available icons: `store`, `sparkle`, `shield`, `globe`, `chart`, `bolt`, `grid`, `truck`, `search`, `currency`, `phone`, `brain`, `arrowRight`, `check`, `chevronDown`, `menu`, `x`, `github`, `users`, `layers`, `package`

## Deployment

### Docker (Multi-stage)

The website is built as Stage 3 in the root `Dockerfile`:
```
Stage 1: seller-builder (CRA)    → /usr/share/nginx/html/seller
Stage 2: claw-builder (Vite)     → /usr/share/nginx/html/claw
Stage 3: website-builder (Vite)  → /usr/share/nginx/html/website
Stage 4: nginx:alpine serves all three
```

### Nginx

Defined in root `nginx.conf`:
```nginx
server_name cerve.in;
root /usr/share/nginx/html/website;
try_files $uri $uri/ /index.html;
```

SSL certificates expected at `/etc/letsencrypt/live/cerve.in/`.

## Testing

### Framework

- **Vitest** + **React Testing Library** + **jsdom**
- Framer Motion mocked via Vite alias → `src/__mocks__/framer-motion.jsx`
- Test files in `src/__tests__/` mirroring source structure

### Coverage

100% thresholds enforced in `vite.config.js`:
```js
thresholds: {
  lines: 100,
  functions: 100,
  branches: 100,
  statements: 100,
}
```

Coverage excludes: `main.jsx`, `__mocks__/`, `__tests__/`, `test-setup.js`

### Running Tests

```bash
npm run test:run         # Quick single run
npm run test:coverage    # Full coverage report — build fails if below 100%
```

### Test Conventions

- Wrap all component renders with `<MemoryRouter>` (required for React Router)
- Test all branches: prop variations, conditional renders, event handlers
- For Navbar: test scroll behavior by dispatching `scroll` events and setting `scrollY`
- For anchor clicks: test both existing and non-existing target elements

### Current Stats

- **18 test files**, **119 tests** — all passing
- **100% coverage** across statements, branches, functions, and lines

## Test Coverage Requirement

**Every new file added to this sub-project MUST have 100% test coverage (statements, branches, functions, lines).**

### Rules

- No PR may introduce new files without accompanying test files achieving 100% coverage
- Tests must cover every branch: all `if`/`else`, ternary conditions, conditional renders, and event handlers
- Use **Vitest + React Testing Library** with the existing test setup
- Mock `framer-motion` using the alias in `vite.config.js` (points to `src/__mocks__/framer-motion.jsx`)
- Wrap React Router-dependent components with `<MemoryRouter>` in tests

## Adding Content

### New Home Page Section

1. Create component in `src/components/home/NewSection.jsx`
2. Use `AnimatedSection`, `SectionHeading`, `Card`, etc. from shared components
3. Add data to `src/constants/` if needed
4. Import and add to `src/pages/HomePage.jsx` in desired order
5. Optionally add anchor link to `navLinks` array in `Navbar.jsx`
6. Write tests in `src/__tests__/components/home/NewSection.test.jsx`

### New Icon

Add a new SVG path entry to the `icons` object in `src/components/shared/Icon.jsx`. Use HeroIcons 24px outline style (`strokeWidth={1.5}`, `viewBox="0 0 24 24"`).

### New Page (beyond single-page)

1. Create page component in `src/pages/`
2. Add lazy import and `<Route>` in `src/App.jsx`
3. Update `navLinks` in `Navbar.jsx` (switch from anchor to `to` prop)
4. Write tests

## Important Notes

- This is a **static marketing site** — no backend API calls, no authentication
- All external links open in new tabs (`target="_blank"`, `rel="noopener noreferrer"`)
- The Navbar CTA links to `https://seller.cerve.in` (Seller Portal)
- Content data lives in `src/constants/` — update there, not in components
- Keep design system in sync with `claw/` when making visual changes
