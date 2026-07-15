// Signal that JS is active (enables progressive-enhancement styles like fade-in).
document.documentElement.classList.add("js");

/* ===========================================================================
   Portfolio data
   ---------------------------------------------------------------------------
   To add a project: copy a block below, set a unique `id`, `title`, optional
   `subtitle`, and list images from /images/<folder>/. The `w`/`h` values are
   the pixel dimensions of each optimized image and drive lightbox zoom — if
   you drop in new photos, set them to the image's width/height (any correct
   ratio works).
   =========================================================================== */
const portfolioItems = [
  {
    id: "forgotten",
    title: "Forgotten",
    subtitle: "forgotten words, forgotten meanings, we are the forgottens",
    images: [
      { src: "images/forgotten/IMG_4839.JPG", caption: "", w: 1125, h: 2000 },
      { src: "images/forgotten/IMG_5055.JPG", caption: "", w: 1125, h: 2000 },
      { src: "images/forgotten/IMG_5056.JPG", caption: "", w: 1125, h: 2000 },
      { src: "images/forgotten/IMG_5059.JPG", caption: "", w: 1125, h: 2000 },
      { src: "images/forgotten/IMG_5061.JPG", caption: "", w: 1125, h: 2000 },
      { src: "images/forgotten/IMG_5063.JPG", caption: "", w: 1125, h: 2000 },
    ],
  },
  {
    id: "wordless",
    title: "Wordless",
    subtitle: "",
    images: [
      { src: "images/wordless/DSC08334.JPG", caption: "", w: 2000, h: 1333 },
      { src: "images/wordless/DSC08346.JPG", caption: "", w: 1333, h: 2000 },
      { src: "images/wordless/DSC08348.JPG", caption: "", w: 1333, h: 2000 },
      { src: "images/wordless/DSC08349.JPG", caption: "", w: 1333, h: 2000 },
      { src: "images/wordless/DSC08351.JPG", caption: "", w: 1333, h: 2000 },
      { src: "images/wordless/DSC08354.JPG", caption: "", w: 1333, h: 2000 },
      { src: "images/wordless/DSC08357.JPG", caption: "", w: 1333, h: 2000 },
    ],
  },
];

// DOM references
const portfolioContainer = document.getElementById("portfolio-container");
const mobileMenuButton = document.getElementById("mobile-menu-button");
const mobileMenu = document.getElementById("mobile-menu");
const contactForm = document.getElementById("contact-form");
const formMessage = document.getElementById("form-message");
const currentYearElement = document.getElementById("current-year");

/* ---------- Build the portfolio galleries ---------------------------------- */
function initPortfolio() {
  portfolioContainer.innerHTML = "";

  portfolioItems.forEach((item) => {
    const section = document.createElement("div");
    section.className = "mb-20";

    const heading = document.createElement("h3");
    heading.className = "font-serif text-3xl mb-2";
    heading.textContent = item.title;
    section.appendChild(heading);

    if (item.subtitle) {
      const subtitle = document.createElement("p");
      subtitle.className = "text-muted mb-6 italic";
      subtitle.textContent = item.subtitle;
      section.appendChild(subtitle);
    } else {
      heading.classList.add("mb-6");
    }

    const galleryContainer = document.createElement("div");
    galleryContainer.className = "relative";

    const gallery = document.createElement("div");
    gallery.className = "gallery";
    gallery.id = `gallery-${item.id}`;

    item.images.forEach((image, index) => {
      const galleryItem = document.createElement("div");
      galleryItem.className = "gallery-item";
      // Make each thumbnail keyboard-accessible like a button.
      galleryItem.setAttribute("role", "button");
      galleryItem.setAttribute("tabindex", "0");
      galleryItem.setAttribute(
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

      galleryItem.appendChild(img);

      // Enter / Space opens the lightbox (click is wired up in lightbox.js).
      galleryItem.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          galleryItem.click();
        }
      });

      gallery.appendChild(galleryItem);
    });

    // Desktop navigation arrows.
    const prevButton = document.createElement("button");
    prevButton.type = "button";
    prevButton.className = "gallery-nav prev hidden md:flex";
    prevButton.setAttribute("aria-label", `Scroll ${item.title} left`);
    prevButton.innerHTML = arrowSvg("M15 19l-7-7 7-7");

    const nextButton = document.createElement("button");
    nextButton.type = "button";
    nextButton.className = "gallery-nav next hidden md:flex";
    nextButton.setAttribute("aria-label", `Scroll ${item.title} right`);
    nextButton.innerHTML = arrowSvg("M9 5l7 7-7 7");

    galleryContainer.appendChild(gallery);
    galleryContainer.appendChild(prevButton);
    galleryContainer.appendChild(nextButton);
    section.appendChild(galleryContainer);
    portfolioContainer.appendChild(section);

    // Scroll by roughly one card (plus gap) per click.
    const step = () => {
      const first = gallery.querySelector(".gallery-item");
      return (first ? first.getBoundingClientRect().width : 300) + 16;
    };
    prevButton.addEventListener("click", () =>
      gallery.scrollBy({ left: -step(), behavior: "smooth" })
    );
    nextButton.addEventListener("click", () =>
      gallery.scrollBy({ left: step(), behavior: "smooth" })
    );
  });
}

function arrowSvg(path) {
  return `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${path}"></path></svg>`;
}

/* ---------- Mobile menu ----------------------------------------------------- */
mobileMenuButton.addEventListener("click", () => {
  const isHidden = mobileMenu.classList.toggle("hidden");
  const open = !isHidden;
  mobileMenuButton.setAttribute("aria-expanded", String(open));
  mobileMenuButton.setAttribute("aria-label", open ? "Close menu" : "Open menu");
});

mobileMenu.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    mobileMenu.classList.add("hidden");
    mobileMenuButton.setAttribute("aria-expanded", "false");
    mobileMenuButton.setAttribute("aria-label", "Open menu");
  });
});

/* ---------- Contact form (Formspree) --------------------------------------- */
function showFormMessage(text, type) {
  const styles = {
    success: "bg-green-100 text-green-800",
    error: "bg-red-100 text-red-800",
    info: "bg-line text-ink",
  };
  formMessage.textContent = text;
  formMessage.className = `mt-4 p-4 rounded ${styles[type] || styles.info}`;
}

if (contactForm) {
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const action = contactForm.getAttribute("action") || "";

    // Form not connected to a Formspree endpoint yet.
    if (action.includes("YOUR_FORM_ID")) {
      showFormMessage(
        "The contact form isn't connected yet. Please email me directly at shahin.kiassat90@gmail.com.",
        "info"
      );
      return;
    }

    if (!contactForm.checkValidity()) {
      contactForm.reportValidity();
      return;
    }

    const submitBtn = document.getElementById("contact-submit");
    const originalLabel = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = "Sending…";

    try {
      const response = await fetch(action, {
        method: "POST",
        body: new FormData(contactForm),
        headers: { Accept: "application/json" },
      });

      if (response.ok) {
        showFormMessage(
          "Thank you for your message. I will get back to you soon.",
          "success"
        );
        contactForm.reset();
      } else {
        const data = await response.json().catch(() => ({}));
        const msg =
          data.errors && data.errors.length
            ? data.errors.map((er) => er.message).join(", ")
            : "Something went wrong. Please try again or email me directly.";
        showFormMessage(msg, "error");
      }
    } catch (err) {
      showFormMessage(
        "Network error. Please try again or email me directly.",
        "error"
      );
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalLabel;
    }
  });
}

/* ---------- Fade-in on scroll (IntersectionObserver) ----------------------- */
function initFadeIn() {
  const fadeElements = document.querySelectorAll(".fade-in");
  if (!("IntersectionObserver" in window)) {
    fadeElements.forEach((el) => el.classList.add("visible"));
    return;
  }
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
  );
  fadeElements.forEach((el) => observer.observe(el));
}

/* ---------- Scrollspy: highlight the current section in the nav ------------ */
function initScrollSpy() {
  const sections = document.querySelectorAll("main section[id]");
  const navLinks = document.querySelectorAll(".nav-link[data-nav]");
  if (!sections.length || !("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute("id");
          navLinks.forEach((link) =>
            link.classList.toggle("active", link.getAttribute("href") === `#${id}`)
          );
        }
      });
    },
    { rootMargin: "-40% 0px -55% 0px" }
  );
  sections.forEach((section) => observer.observe(section));
}

/* ---------- Init ----------------------------------------------------------- */
currentYearElement.textContent = new Date().getFullYear();

document.addEventListener("DOMContentLoaded", () => {
  initPortfolio();
  initFadeIn();
  initScrollSpy();
});
