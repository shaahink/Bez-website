/* ===========================================================================
   PhotoSwipe v5 lightbox
   ---------------------------------------------------------------------------
   Uses the PhotoSwipe core class (loaded as a UMD global) directly with a
   `dataSource`. Each thumbnail carries data-pswp-width / data-pswp-height
   (set in main.js) so zoom is pixel-accurate even before images load.
   =========================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".gallery").forEach((gallery) => {
    gallery.querySelectorAll(".gallery-item").forEach((item, index) => {
      item.addEventListener("click", () => openLightbox(gallery, index));
    });
  });
});

function openLightbox(gallery, index) {
  if (typeof PhotoSwipe === "undefined") return; // library failed to load

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
    bgOpacity: 0.95,
    showHideAnimationType: "fade",
    wheelToZoom: true,
  });
  pswp.init();
}
