# MUN Website Repository Overview

## Tech Stack
- **Framework**: Next.js 15 (App Router) with React 19
- **Styling**: Tailwind CSS 4
- **Animations**: Framer Motion
- **Particles**: tsparticles via `react-tsparticles`

## Project Structure
- **src/app**: App Router entry (`page.js`), layout, and global styles.
- **src/components**: Reusable section components (e.g., hero, committees, team).
- **public**: Static assets such as committee logos and SVGs.
- **.next**: Build output (ignored during development).

## Common Commands
1. `npm run dev` — Start local development server.
2. `npm run build` — Generate production build.
3. `npm run start` — Run production server locally after building.
4. `npm run lint` — Execute Next.js ESLint checks.

## Notes
- Tailwind CSS 4 uses the new `@tailwindcss/postcss` preset; ensure PostCSS config remains aligned.
- Components expect committee images at `/public/*.png`; keep naming consistent when adding new assets.
- Framer Motion animations rely on variants for hover/visibility transitions; update both desktop and mobile variants when tweaking interactions.