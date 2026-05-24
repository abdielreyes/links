# links

Personal links page for [@abdiel](https://abdielreyes.com) — built with React, Vite, and Bun. Terminal/hacker aesthetic with a matrix rain background and grayscale color scheme.

## Stack

- **Bun** — package manager & runtime
- **React 19** — UI
- **Vite** — dev server & bundler
- **CSS Modules** — scoped styles, no CSS-in-JS

## Adding or editing links

All content lives in one file:

```
src/links.json
```

Each entry follows this shape:

```json
{
  "id": "github",
  "label": "GitHub",
  "description": "code & projects",
  "url": "https://github.com/abdielreyes",
  "icon": "gh"
}
```

Available icons: `gh` `li` `yt` `tiktok` `ig` `x` `applemusic` `guestbook` `blog` `portfolio` `web`

To add a custom page with no specific icon, use `"icon": "web"`.

## Dev

```bash
bun install
bun dev
```

## Build

```bash
bun run build      # outputs to dist/
bun run preview    # preview the production build locally
```

## Docker

Builds with Bun, serves with nginx on port 80.

```bash
docker build -t links .
docker run -p 80:80 links
```
