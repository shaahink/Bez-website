/* ===========================================================================
   PhotoSwipe v5 lightbox
   ---------------------------------------------------------------------------
   Uses the PhotoSwipe core class (loaded as a UMD global) directly with a
   `dataSource`. Click handling is delegated from the document, so it works no
   matter when the galleries are rendered into the DOM (main.js builds them).
   Each thumbnail carries data-pswp-width / data-pswp-height for pixel-accurate
   zoom even before the full image loads.
   =========================================================================== */
document.addEventListener("click", (e) => {
  const cell = e.target.closest(".gallery-item");
  if (!cell) return;
  const gallery = cell.closest(".gallery");
  if (!gallery) return;

  const cells = Array.from(gallery.querySelectorAll(".gallery-item"));
  openLightbox(gallery, cells.indexOf(cell));
});

function openLightbox(gallery, index) {
  if (typeof PhotoSwipe === "undefined") return; // library not loaded

  const dataSource = [];
  gallery.querySelectorAll(".gallery-item img").forEach((img) => {
    dataSource.push({
      src: img.src,
      width: parseInt(img.dataset.pswpWidth, 10) || img.naturalWidth || 1600,
      height: parseInt(img.dataset.pswpHeight, 10) || img.naturalHeight || 1067,
      alt: img.alt,
    });
  });

  const pswp = new PhotoSwipe({
    dataSource,
    index,
    bgOpacity: 0.97,
    showHideAnimationType: "fade",
    wheelToZoom: true,
  });
  pswp.init();
}
