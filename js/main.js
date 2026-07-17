/* ===========================================================================
   Bruce Nemeth — behaviour
   Sections: Data · Works render · Nav · Reveal · Scrollspy · Parallax ·
             Video facade · Init
   =========================================================================== */

/* ---------- Portfolio data -------------------------------------------------
   To add a project: copy a block, set a unique `id`, `title`, optional
   `subtitle`, a `glyph` (a short Persian/decorative word shown faint behind
   the chapter — optional), and list images from /images/<folder>/. Each `w`/`h`
   is the optimized image's pixel size and drives accurate lightbox zoom.
   --------------------------------------------------------------------------- */
const portfolioItems = [
  {
    id: "forgotten",
    title: "Forgotten",
    subtitle: "forgotten words, forgotten meanings — we are the forgottens",
    glyph: "فراموشی", // "oblivion / forgetting"
    images: [
      { src: "images/forgotten/IMG_4839.JPG", caption: "Installation view", w: 1125, h: 2000 },
      { src: "images/forgotten/IMG_5055.JPG", caption: "Ink on paper", w: 1125, h: 2000 },
      { src: "images/forgotten/IMG_5056.JPG", caption: "", w: 1125, h: 2000 },
      { src: "images/forgotten/IMG_5059.JPG", caption: "", w: 1125, h: 2000 },
      { src: "images/forgotten/IMG_5061.JPG", caption: "", w: 1125, h: 2000 },
      { src: "images/forgotten/IMG_5063.JPG", caption: "Gesture on black", w: 1125, h: 2000 },
    ],
  },
  {
    id: "wordless",
    title: "Wordless",
    subtitle: "sound before language — the archive of what stays unsaid",
    glyph: "بی‌کلام", // "wordless / without words"
    images: [
      { src: "images/wordless/DSC08334.JPG", caption: "Under the stair", w: 2000, h: 1333 },
      { src: "images/wordless/DSC08346.JPG", caption: "", w: 1333, h: 2000 },
      { src: "images/wordless/DSC08348.JPG", caption: "", w: 1333, h: 2000 },
      { src: "images/wordless/DSC08349.JPG", caption: "", w: 1333, h: 2000 },
      { src: "images/wordless/DSC08351.JPG", caption: "", w: 1333, h: 2000 },
      { src: "images/wordless/DSC08354.JPG", caption: "", w: 1333, h: 2000 },
      { src: "images/wordless/DSC08357.JPG", caption: "", w: 1333, h: 2000 },
    ],
  },
];

const ROMAN = ["I", "II", "III", "IV", "V", "VI"];

/* ---------- Build the works chapters --------------------------------------- */
function initWorks() {
  const container = document.getElementById("works-container");
  if (!container) return;
  container.innerHTML = "";

  portfolioItems.forEach((item, i) => {
    const chapter = document.createElement("article");
    chapter.className = "chapter reveal";
    chapter.id = `chapter-${item.id}`;

    // Faint Persian glyph behind the chapter.
    if (item.glyph) {
      const glyph = document.createElement("span");
      glyph.className = "chapter__glyph";
      glyph.lang = "fa";
      glyph.dir = "rtl";
      glyph.setAttribute("aria-hidden", "true");
      glyph.textContent = item.glyph;
      chapter.appendChild(glyph);
    }

    // Head: index · title · subtitle · frame count.
    const head = document.createElement("div");
    head.className = "chapter__head";
    head.innerHTML = `
      <span class="chapter__index">${ROMAN[i] || i + 1}</span>
      <div class="chapter__titles">
        <h3 class="chapter__title">${item.title}</h3>
        ${item.subtitle ? `<p class="chapter__subtitle">${item.subtitle}</p>` : ""}
      </div>
      <span class="chapter__note">${item.images.length} frames · tap to enlarge</span>
    `;
    chapter.appendChild(head);

    // Gallery filmstrip (class names kept for lightbox.js compatibility).
    const wrap = document.createElement("div");
    wrap.className = "gallery-wrap";

    const gallery = document.createElement("div");
    gallery.className = "gallery";
    gallery.id = `gallery-${item.id}`;

    item.images.forEach((image, index) => {
      const cell = document.createElement("div");
      cell.className = "gallery-item";
      cell.setAttribute("role", "button");
      cell.setAttribute("tabindex", "0");
      cell.setAttribute(
        "aria-label",
        `Open image ${index + 1} of ${item.images.length} from ${item.title}`
      );

      const img = document.createElement("img");
      img.src = image.src;
      img.alt = `${item.title} — image ${index + 1}`;
      img.loading = "lazy";
      img.decoding = "async";
      img.dataset.pswpWidth = image.w;
      img.dataset.pswpHeight = image.h;
      cell.appendChild(img);

      cell.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          cell.click();
        }
      });

      gallery.appendChild(cell);
    });

    const prev = document.createElement("button");
    prev.type = "button";
    prev.className = "gallery-nav prev";
    prev.setAttribute("aria-label", `Scroll ${item.title} left`);
    prev.innerHTML = arrowSvg("M15 19l-7-7 7-7");

    const next = document.createElement("button");
    next.type = "button";
    next.className = "gallery-nav next";
    next.setAttribute("aria-label", `Scroll ${item.title} right`);
    next.innerHTML = arrowSvg("M9 5l7 7-7 7");

    wrap.append(gallery, prev, next);
    chapter.appendChild(wrap);
    container.appendChild(chapter);

    const step = () => {
      const first = gallery.querySelector(".gallery-item");
      return (first ? first.getBoundingClientRect().width : 320) + 20;
    };
    prev.addEventListener("click", () =>
      gallery.scrollBy({ left: -step(), behavior: "smooth" })
    );
    next.addEventListener("click", () =>
      gallery.scrollBy({ left: step(), behavior: "smooth" })
    );
  });
}

function arrowSvg(path) {
  return `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="${path}"></path></svg>`;
}

/* ---------- Navigation: scroll state + mobile menu ------------------------- */
function initNav() {
  const nav = document.getElementById("nav");
  const toggle = document.getElementById("nav-toggle");
  const mobile = document.getElementById("nav-mobile");

  const onScroll = () => {
    if (nav) nav.classList.toggle("is-scrolled", window.scrollY > 40);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  if (toggle && mobile) {
    toggle.addEventListener("click", () => {
      const open = mobile.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });
    mobile.querySelectorAll("a").forEach((link) =>
      link.addEventListener("click", () => {
        mobile.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Open menu");
      })
    );
  }
}

/* ---------- Reveal on scroll ----------------------------------------------- */
function initReveal() {
  const els = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    els.forEach((el) => el.classList.add("is-visible"));
    return;
  }
  const io = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
  );
  els.forEach((el) => io.observe(el));
}

/* ---------- Scrollspy: highlight the active nav link ----------------------- */
function initScrollSpy() {
  const sections = document.querySelectorAll("main section[id]");
  const links = document.querySelectorAll(".nav__link[data-nav]");
  if (!sections.length || !("IntersectionObserver" in window)) return;

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute("id");
          links.forEach((link) =>
            link.classList.toggle("is-active", link.getAttribute("href") === `#${id}`)
          );
        }
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );
  sections.forEach((s) => io.observe(s));
}

/* ---------- Hero parallax (subtle, guarded) -------------------------------- */
function initParallax() {
  const img = document.querySelector("[data-parallax]");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!img || reduce) return;

  let ticking = false;
  const update = () => {
    const y = window.scrollY;
    if (y < window.innerHeight) {
      img.style.transform = `translate3d(0, ${y * 0.18}px, 0) scale(1.06)`;
    }
    ticking = false;
  };
  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    },
    { passive: true }
  );
  img.style.transform = "scale(1.06)";
}

/* ---------- Video facade: load the iframe only on click -------------------- */
function initVideoFacade() {
  const facade = document.getElementById("video-facade");
  if (!facade) return;
  facade.addEventListener("click", () => {
    const id = facade.dataset.videoId;
    const iframe = document.createElement("iframe");
    iframe.src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`;
    iframe.title = "Bruce Nemeth — video work";
    iframe.allow =
      "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
    iframe.allowFullscreen = true;
    facade.replaceWith(iframe);
  });
}

/* ---------- Init ----------------------------------------------------------- */
function init() {
  const yearEl = document.getElementById("current-year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  initWorks();
  initNav();
  initReveal();
  initScrollSpy();
  initParallax();
  initVideoFacade();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
