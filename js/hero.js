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

  /* Deferred sources: only the first frame loads eagerly. */
  imgs.forEach((img) => {
    if (img.dataset.src && !img.src) img.src = img.dataset.src;
  });

  const ctx =
    canvas && canvas.getContext ? canvas.getContext("2d") : null;

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
  function fit() {
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(media.clientWidth * dpr);
    canvas.height = Math.round(media.clientHeight * dpr);
  }
  fit();
  window.addEventListener("resize", fit, { passive: true });

  /* object-fit: cover, by hand, for drawImage */
  function drawCover(c, img) {
    const cw = c.canvas.width, ch = c.canvas.height;
    const iw = img.naturalWidth, ih = img.naturalHeight;
    if (!iw || !ih) return;
    const s = Math.max(cw / iw, ch / ih);
    const w = iw * s, h = ih * s;
    c.drawImage(img, (cw - w) / 2, (ch - h) * 0.44, w, h);
  }

  const easeInOut = (p) => (p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2);

  function settle(next) {
    imgs[current].classList.remove("is-active");
    next.classList.add("is-active");
    current = imgs.indexOf(next);
    busy = false;
    if (ctx) {
      canvas.classList.remove("is-showing");
      // clear after the canvas has faded from the compositor
      setTimeout(() => ctx.clearRect(0, 0, canvas.width, canvas.height), 400);
    }
  }

  function transition() {
    if (busy || document.hidden) return;
    busy = true;
    const next = imgs[(current + 1) % imgs.length];

    const ready = next.decode ? next.decode().catch(() => {}) : Promise.resolve();
    ready.then(() => {
      if (!ctx || !maskData || FADE === 0) {
        // fallback: CSS crossfade (opacity transition lives in the stylesheet)
        settle(next);
        return;
      }
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
        }
      })(t0);
    });
  }

  setInterval(transition, HOLD);
})();
