# links

Personal links page for [@abdiel](https://abdielreyes.com) — built with React, Vite, and Bun. Terminal/hacker aesthetic with a matrix rain background and grayscale color scheme.

## Stack

- **Bun** — package manager & runtime
- **React 19** — UI
- **Vite** — dev server & bundler
- **CSS Modules** — scoped styles, no CSS-in-JS

## Editing content

All content lives in one file: `src/links.json`

### Links

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

### Live feed widgets

The page shows the latest YouTube video and latest blog post fetched at runtime. Configure them in the `feeds` array:

```json
"feeds": [
  {
    "id": "youtube",
    "label": "latest video",
    "type": "youtube",
    "channelId": "UCxxxxxxxxxxxxxxxxxxxx"
  },
  {
    "id": "blog",
    "label": "latest post",
    "type": "wordpress",
    "apiUrl": "https://blog.abdielreyes.com/wp-json/wp/v2/posts"
  }
]
```

**Finding your YouTube channel ID:**
1. Go to your channel on YouTube
2. Click your avatar → Settings → Advanced settings
3. Copy the Channel ID (starts with `UC`)

YouTube feeds are fetched via [rss2json.com](https://rss2json.com) (free, no API key needed, 10k req/day).  
WordPress feeds use the built-in REST API — no setup needed.

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
