# Bruce Nemeth — Artist Portfolio

A single-page scrolling portfolio for interdisciplinary artist **Bruce Nemeth**.
Minimal gallery aesthetic, built with plain HTML, CSS, and JavaScript — no build
step required.

- **Tailwind CSS** (Play CDN) for utility styling
- **PhotoSwipe 5** for the fullscreen image lightbox
- **Formspree** for contact-form submissions
- Hosted on **Vercel** (auto-deploys from GitHub)

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
├── index.html          # Page markup + meta tags + Tailwind config
├── css/
│   └── styles.css       # Custom styles (components, gallery, motion)
├── js/
│   ├── main.js          # Portfolio data, menu, form, animations
│   └── lightbox.js      # PhotoSwipe lightbox
├── images/
│   ├── bruce-main.JPG    # Hero / portrait photo
│   ├── forgotten/        # "Forgotten" project photos
│   └── wordless/         # "Wordless" project photos
├── favicon.svg
├── vercel.json          # Static-asset caching headers
└── README.md
```

---

## Common edits

### Update contact email
In `index.html`, search for `shahin.kiassat90@gmail.com` (it appears twice — the
link text and the `mailto:`) and replace both with the real address. Also update
it in the fallback message inside `js/main.js`.

### Update the Instagram / social link
In `index.html`, find the comment `EDIT: replace with the real Instagram handle`
and update the `href` and the visible `@handle`.

### Connect the contact form (Formspree)
The form is wired up but needs your endpoint:

1. Create a free form at <https://formspree.io> and copy its endpoint
   (looks like `https://formspree.io/f/abcdwxyz`).
2. In `index.html`, replace `https://formspree.io/f/YOUR_FORM_ID` in the
   `<form action="...">` with your endpoint.

Until that's done, the form shows a friendly "email me directly" message instead
of failing.

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
