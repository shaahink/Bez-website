# Bruce Nemeth — Artist Portfolio

A three-page portfolio for interdisciplinary artist **Bruce Nemeth**: the home
page, a consolidated biography (`about.html`), and a calligraphy gallery
(`showcase.html`). Design concept: *"The Listening Room"* — a darkened-gallery
aesthetic (obsidian ground, bone text, one ember accent drawn from the works,
film grain) softened by a slow Eno-style color wash, carrying the artist's idea
of repetition-as-spiral through echoing type, a repeating marquee, exhibition
numbering, and Persian glyph watermarks (تکرار / فراموشی / بی‌کلام / مشق). Built
with plain HTML, hand-authored CSS, and vanilla JavaScript — **no build step,
no CSS-framework runtime**.

- **Hand-authored CSS design system** (`css/styles.css`) — tokens, fluid type,
  scroll reveals; keeps delivery light.
- **Hero slideshow with a noise dissolve** (`js/hero.js`) — the works surface
  through swelling grain; no controls, by design. Falls back to a crossfade.
- **PhotoSwipe 5** for the fullscreen image lightbox
- **YouTube facade** — the video iframe only loads on click, for a fast first paint
- **Contact is email-only** (owner request) — no form, no socials
- Hosted on **Vercel** (auto-deploys from GitHub)

> **Editors: read `content-map.md` first.** It records the wording rules the
> artist asked for (partners, sound, interdisciplinary), who the partners are,
> the verified project facts, and where every image came from.

---

## Run it locally

No build tooling is needed — it's static files. Pick any of these:

```bash
# VS Code: install the "Live Server" extension, then right-click index.html → "Open with Live Server"

# Python (already installed on most machines)
python -m http.server 5500
# then open http://localhost:5500

# Node
npx serve .
```

> Open it through a local server (not by double-clicking `index.html`) so image
> paths and the lightbox behave the same as in production.

---

## Project structure

```
.
├── index.html           # Home: hero slideshow, works, partners, contact
├── showcase.html        # The calligraphy gallery (three "rooms")
├── about.html           # Consolidated biography / CV
├── content-map.md       # Source of truth: people, wording rules, facts, assets
├── css/
│   └── styles.css       # Full design system (tokens, sections, gallery, motion)
├── js/
│   ├── main.js          # Portfolio data, nav, reveals, video facade
│   ├── hero.js          # Hero slideshow + noise dissolve
│   └── lightbox.js      # PhotoSwipe lightbox
├── images/
│   ├── bruce-main.JPG    # Portrait (home about section)
│   ├── bruce-listening.jpg # Portrait (about page)
│   ├── hero/             # Hero slideshow frames
│   ├── showcase/         # Showcase gallery images (canvas-/insitu-/paper-*)
│   ├── partners/         # Partner portraits
│   ├── forgotten/        # "Forgotten" project photos
│   └── wordless/         # "Wordless" project photos
├── favicon.svg
├── vercel.json          # Static-asset caching headers
└── README.md
```

---

## Common edits

### Update contact email
The address `Brucenemeth@outlook.com` appears in the contact section and footer
of all three pages — search and replace across `index.html`, `showcase.html`,
and `about.html`. (Contact is deliberately email-only: no form, no socials.)

### Change the hero slideshow
The frames are the `<img>` tags inside `#hero-slides` in `index.html` (first one
eager with `src`, the rest lazy with `data-src`). Timing lives at the top of
`js/hero.js` (`FADE`, `HOLD`).

### Add or edit a portfolio project
Everything lives in the `portfolioItems` array at the top of `js/main.js`. Copy a
block, give it a unique `id`, a `title`, an optional `subtitle`, and list the
images. Set each image's `w`/`h` to its pixel dimensions (this drives accurate
lightbox zoom).

### Add new photos (keep them web-friendly)
Source photos are often 5–15 MB straight from a camera — far too heavy for the
web. Resize to roughly **2000px on the long edge** and re-compress before adding.
Any tool works (Squoosh, Photoshop "Export for Web", ImageMagick). Example with
[sharp](https://sharp.pixelplumbing.com):

```js
const sharp = require("sharp");
sharp("original.JPG")
  .rotate()                       // honor EXIF orientation
  .resize({ width: 2000, height: 2000, fit: "inside", withoutEnlargement: true })
  .jpeg({ quality: 82, mozjpeg: true })
  .toFile("optimized.JPG");
```

---

## Deployment

### Vercel (current setup)
The repo is connected to Vercel. **Every push to `main` triggers a production
deploy automatically** — no build command, no output directory (it's a static
site served from the repo root). Just commit and push.

### GitHub Pages (alternative)
Settings → Pages → Deploy from branch → `main` / root. The site works as-is from
a subpath because all asset links are relative.

---

## Notes

- Filenames are **case-sensitive** in production (Linux). The photos use
  uppercase `.JPG` — keep the case consistent in code and filenames.
- The original full-resolution photos remain available in this repo's git
  history if you ever need them.
