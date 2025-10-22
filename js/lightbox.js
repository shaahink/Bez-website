// Initialize PhotoSwipe lightbox
document.addEventListener("DOMContentLoaded", () => {
  // Get all galleries
  const galleries = document.querySelectorAll(".gallery");

  galleries.forEach((gallery) => {
    // Get all gallery items in this gallery
    const galleryItems = gallery.querySelectorAll(".gallery-item");

    // Prepare items for PhotoSwipe
    const items = [];

    galleryItems.forEach((item) => {
      const img = item.querySelector("img");

      items.push({
        src: img.src,
        width: img.naturalWidth || 1200, // Fallback width if image not loaded
        height: img.naturalHeight || 800, // Fallback height if image not loaded
        alt: img.alt,
      });
    });

    // Initialize PhotoSwipe for each gallery item
    galleryItems.forEach((item, index) => {
      item.addEventListener("click", (e) => {
        e.preventDefault();

        const pswpElement = document.querySelector(".pswp");

        const options = {
          dataSource: items,
          index: index,
          bgOpacity: 0.9,
          showHideAnimationType: "fade",
        };

        const lightbox = new PhotoSwipe(pswpElement, options);
        lightbox.init();
      });
    });
  });
});
