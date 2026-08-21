# Fauna Gaz

Astro site with React islands for the interactive desktop experience and
static Astro routes for SEO-friendly quarterly articles.

## Frontend

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env` and set the Sanity project values before fetching
content. Keep `SANITY_API_READ_TOKEN` server/build-only and never expose it to
the browser.

## Sanity Studio

The local Studio scaffold lives in `studio/` and defines the hierarchy:

```text
Issue (year → quarter)
└── Article
    └── Category tags
```

After a Sanity project is created and the Studio environment is configured:

```bash
npm install --prefix studio
npm run studio:dev
```
