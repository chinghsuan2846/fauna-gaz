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

## Tailwind design tokens

Use the semantic utilities from `tailwind.config.js` in components instead of
adding raw color, font, spacing, border, or shadow values. Common examples:

```jsx
<section className="border-thin border-line bg-window-surface p-space-md font-ui text-ink-primary shadow-window">
  <p className="font-body text-body text-ink-secondary">Article content</p>
  <a className="text-action-link underline" href="/quarterly/example">Read article</a>
</section>
```

The token groups are `window-*`, `ink-*`, `line-*`, `scrollbar-*`,
`action-*`, `font-ui` / `font-body`, `text-*`, `font-*`, `space-*`,
`shadow-window`, and `border-thin` / `border-regular`.
