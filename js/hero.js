/* ===========================================================================
   Hero slideshow — a slow rotation of works with a film-grain dissolve.
   ---------------------------------------------------------------------------
   No buttons, no dots: the works simply surface and recede, like the room is
   breathing. The transition is a noise dissolve — the next image appears
   through swelling grain (two octaves of value noise, thresholded with a soft
   edge) rather than a plain crossfade.

   Progressive enhancement, in order of degradation:
     · canvas + JS        → noise dissolve
     · JS, no canvas      → slow opacity crossfade (CSS transition)
     · reduced motion     → slow crossfade, longer holds
     · no JS              → the first image stands alone
   =========================================================================== */
(function () {
  const media = document.querySelector("[data-slideshow]");
  if (!media) return;

  const imgs = Array.from(media.querySelectorAll("img"));
  if (imgs.length < 2) return;

  const canvas = media.querySelector("canvas.hero__canvas");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* The pacing nods to the artist's touchstone: 4.32s of dissolve,
     two long bars of stillness between. */
  const FADE = reduce ? 0 : 4320;
  const HOLD = 8600;

  let current = 0;
  let busy = false;
  let timer = 0;

  const ctx = canvas && canvas.getContext ? canvas.getContext("2d") : null;

  /* ---- Frames arrive one ahead of the cut ------------------------------- */
  /* Five full-bleed photographs is a couple of megabytes. A phone should not
     pay for frame five in order to look at frame one, so each is fetched
     during the hold before it is needed. */
  function preload(i) {
    const img = imgs[i % imgs.length];
    if (img && img.dataset.src && !img.src) img.src = img.dataset.src;
  }
  preload(1);

  /* ---- Noise field: coarse blobs + fine grain, built once ---------------- */
  const NW = 192, NH = 108;
  const field = new Float32Array(NW * NH);
  (function buildField() {
    const cw = 24, ch = 14; // coarse lattice
    const coarse = new Float32Array(cw * ch);
    for (let i = 0; i < coarse.length; i++) coarse[i] = Math.random();
    for (let y = 0; y < NH; y++) {
      for (let x = 0; x < NW; x++) {
        // bilinear sample of the coarse lattice
        const gx = (x / NW) * (cw - 1);
        const gy = (y / NH) * (ch - 1);
        const x0 = Math.floor(gx), y0 = Math.floor(gy);
        const fx = gx - x0, fy = gy - y0;
        const idx = (xx, yy) => coarse[Math.min(yy, ch - 1) * cw + Math.min(xx, cw - 1)];
        const blob =
          idx(x0, y0) * (1 - fx) * (1 - fy) +
          idx(x0 + 1, y0) * fx * (1 - fy) +
          idx(x0, y0 + 1) * (1 - fx) * fy +
          idx(x0 + 1, y0 + 1) * fx * fy;
        field[y * NW + x] = blob * 0.62 + Math.random() * 0.38;
      }
    }
  })();

  const mask = document.createElement("canvas");
  mask.width = NW;
  mask.height = NH;
  const maskCtx = mask.getContext("2d");
  const maskData = maskCtx ? maskCtx.createImageData(NW, NH) : null;

  function drawMask(t) {
    // alpha 1 where the field has been passed by the threshold; soft edge
    const edge = 0.16;
    const lift = t * (1 + edge);
    const d = maskData.data;
    for (let i = 0; i < field.length; i++) {
      let a = (lift - field[i]) / edge;
      if (a < 0) a = 0; else if (a > 1) a = 1;
      d[i * 4 + 3] = (a * 255) | 0;
    }
    maskCtx.putImageData(maskData, 0, 0);
  }

  /* ---- Canvas sizing (device pixels, capped for perf) -------------------- */
  let cssW = 0, cssH = 0;

  function fit() {
    if (!canvas) return false;
    const w = media.clientWidth, h = media.clientHeight;
    /* Resizing the canvas clears it, so only touch it when the box has really
       changed. On a phone every scroll that hides the address bar fires a
       resize at an identical width — refitting on those blanked the dissolve
       mid-flight. */
    if (w === cssW && h === cssH) return false;
    cssW = w;
    cssH = h;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    return true;
  }
  fit();
  window.addEventListener("resize", fit, { passive: true });

  /* The crop lives in the stylesheet (--hero-focus-y on .hero__media); read it
     back so the dissolve lands on exactly the framing the CSS is showing. */
  function focusY() {
    const v = parseFloat(getComputedStyle(media).getPropertyValue("--hero-focus-y"));
    return Number.isFinite(v) ? v / 100 : 0.44;
  }

  /* object-fit: cover, by hand, for drawImage */
  function drawCover(c, img) {
    const cw = c.canvas.width, ch = c.canvas.height;
    const iw = img.naturalWidth, ih = img.naturalHeight;
    if (!iw || !ih) return;
    const s = Math.max(cw / iw, ch / ih);
    const w = iw * s, h = ih * s;
    c.drawImage(img, (cw - w) / 2, (ch - h) * focusY(), w, h);
  }

  const easeInOut = (p) => (p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2);

  /* ---- The handover ------------------------------------------------------ */
  /* When the canvas has run, it is already showing the incoming frame at full
     strength — so the swap underneath it must be instantaneous. Letting the
     CSS crossfade run here put both frames on screen at roughly half opacity
     each for the length of the canvas fade-out: a double exposure, right at
     the moment the dissolve was supposed to land. */
  function settle(next) {
    const behindCanvas = ctx && canvas.classList.contains("is-showing");

    if (behindCanvas) media.classList.add("is-cutting");
    imgs[current].classList.remove("is-active");
    next.classList.add("is-active");
    current = imgs.indexOf(next);

    if (behindCanvas) {
      void media.offsetWidth; // commit the cut before transitions come back
      media.classList.remove("is-cutting");
      canvas.classList.remove("is-showing");
      // clear once the canvas has faded off the compositor
      setTimeout(() => ctx.clearRect(0, 0, canvas.width, canvas.height), 500);
    }
    busy = false;
  }

  function transition(done) {
    busy = true;
    const next = imgs[(current + 1) % imgs.length];

    const ready = next.decode ? next.decode().catch(() => {}) : Promise.resolve();
    ready.then(() => {
      // No canvas, no pixels, or reduced motion: the stylesheet's opacity
      // transition carries the crossfade on its own.
      if (!ctx || !maskData || FADE === 0 || !next.naturalWidth) {
        settle(next);
        done();
        return;
      }
      fit();
      canvas.classList.add("is-showing");
      const t0 = performance.now();
      (function frame(now) {
        const p = Math.min(1, (now - t0) / FADE);
        drawMask(easeInOut(p));
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawCover(ctx, next);
        ctx.globalCompositeOperation = "destination-in";
        ctx.drawImage(mask, 0, 0, canvas.width, canvas.height);
        ctx.globalCompositeOperation = "source-over";
        if (p < 1) {
          requestAnimationFrame(frame);
        } else {
          settle(next);
          done();
        }
      })(t0);
    });
  }

  /* ---- Pacing ------------------------------------------------------------ */
  /* A chain of timeouts rather than an interval: the hold starts when the
     previous dissolve finishes, not on a clock that keeps ticking through it.
     Nothing runs on a hidden tab. */
  function schedule() {
    clearTimeout(timer);
    timer = setTimeout(tick, HOLD);
  }

  function tick() {
    if (busy) return;
    if (document.hidden) {
      schedule();
      return;
    }
    preload(current + 2); // fetch the one after next during this dissolve
    transition(schedule);
  }

  document.addEventListener("visibilitychange", () => {
    if (!document.hidden && !busy) schedule();
  });

  schedule();
})();
