# shopmate-assets

Static asset service for the Shopmate platform. Currently hosts **fonts**; other shared assets (icons, images, etc.) will be added as top-level categories later.

## Stack

Plain static files + a small dependency-free Node (>=20) build script. No runtime server.
Delivery: GitHub-backed CDN. Files are served straight from the repo via jsDelivr (versioned by git tag, immutable caching, CORS enabled):

```
https://cdn.jsdelivr.net/gh/theshopmateplatform/shopmate-assets@<tag>/fonts/<family>/<file>.woff2
```

Always pin a release tag (e.g. `v1.0.0`) in consumers, never `@main`, so cached URLs stay immutable. Requires the repo to be public. Do not use `raw.githubusercontent.com` in production (rate-limited, not a CDN).

## Layout

```
fonts/<family>/<file>.woff2   # self-hosted font files (+ <family>.css @font-face, ofl.txt)
demo/index.html               # font specimen page, open locally to preview
scripts/build.mjs             # validates assets, generates dist/ + manifest.json
```

## Usage

```bash
npm run validate   # lint file names, extensions, sizes
npm run build      # outputs dist/ with manifest.json (path, size, sha256)
```

## Sample: Poppins

`fonts/poppins/` ships Poppins (latin, weights 400/500/600/700) with a ready-made `poppins.css`.
Consume it with one tag, pinned to a release:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/theshopmateplatform/shopmate-assets@v0.1.0/fonts/poppins/poppins.css" />
```

Preview locally: `npx serve .` then open `/demo/`.

## Adding a font

1. Add files under `fonts/<family>/` (prefer `.woff2`; lowercase names, max 2 MB), plus a `<family>.css` and the font's licence file.
2. Run `npm run validate`.
3. Open a PR; CI runs the same checks.

## Conventions

- Names: lowercase `[a-z0-9._-]`.
- Allowed font formats: `.woff2`, `.woff`, `.ttf`, `.otf`.
- Only commit fonts whose license permits redistribution.
