# shopmate-assets

Static asset service for the Shopmate platform. Currently hosts **fonts**; other shared assets (icons, images, etc.) will be added as top-level categories later.

## Stack

Plain static files + a small dependency-free Node (>=20) build script. No runtime server.
Intended hosting: S3 + CloudFront (long-lived immutable caching, CORS for storefront/admin origins).

## Layout

```
fonts/<family>/<file>.woff2   # self-hosted font files
scripts/build.mjs             # validates assets, generates dist/ + manifest.json
```

## Usage

```bash
npm run validate   # lint file names, extensions, sizes
npm run build      # outputs dist/ with manifest.json (path, size, sha256)
```

## Adding a font

1. Add files under `fonts/<family>/` (prefer `.woff2`; lowercase names, max 2 MB).
2. Run `npm run validate`.
3. Open a PR; CI runs the same checks.

## Conventions

- Names: lowercase `[a-z0-9._-]`.
- Allowed font formats: `.woff2`, `.woff`, `.ttf`, `.otf`.
- Only commit fonts whose license permits redistribution.
