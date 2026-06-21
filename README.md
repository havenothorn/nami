# Nami's Log (local dev)

A small personal tech blog built with Vite, React, and TypeScript. Posts live under `src/content/posts` as Markdown files with frontmatter. The project converts Markdown to HTML at build/runtime for rendering.

## Quick Start

Install dependencies and start the dev server:

```bash
pnpm install
pnpm dev
```

Open http://localhost:5173/ to view the site locally.

## Content

- Posts: `src/content/posts/*.md` (frontmatter keys: `id, title, excerpt, category, tags, date, readTime, imageUrl, author, engagementScore`)
- Assets: put images into `assets/` and reference as `/assets/your-image.png` in frontmatter.

## Notes

- Markdown is converted using `marked` in `src/data.ts`. If you render user-provided markdown, sanitize output (e.g., using `dompurify`) to avoid XSS.
- To change author avatars, edit the `author.avatarUrl` field in each post's frontmatter or use a shared `/assets` image.

## Testing

- A test post is available at `src/content/posts/test.md` to validate rendering.

## License

Private repo for demo purposes.
