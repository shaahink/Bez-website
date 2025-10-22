// Portfolio data
const portfolioItems = [
  {
    id: "forgotten",
    title: "Forgotten",
    subtitle: "forgotten words, forgotten meanings, We are the forgottens",
    images: [
      { src: "images/forgotten/IMG_4839.JPG", caption: "" },
      { src: "images/forgotten/IMG_5055.JPG", caption: "" },
      { src: "images/forgotten/IMG_5056.JPG", caption: "" },
      { src: "images/forgotten/IMG_5059.JPG", caption: "" },
      { src: "images/forgotten/IMG_5061.JPG", caption: "" },
      { src: "images/forgotten/IMG_5063.JPG", caption: "" },
    ],
  },
  {
    id: "wordless",
    title: "Wordless",
    subtitle: "",
    images: [
      { src: "images/wordless/DSC08334.JPG", caption: "" },
      { src: "images/wordless/DSC08346.JPG", caption: "" },
      { src: "images/wordless/DSC08348.JPG", caption: "" },
      { src: "images/wordless/DSC08349.JPG", caption: "" },
      { src: "images/wordless/DSC08351.JPG", caption: "" },
      { src: "images/wordless/DSC08354.JPG", caption: "" },
      { src: "images/wordless/DSC08357.JPG", caption: "" },
    ],
  },
];

// DOM elements
const portfolioContainer = document.getElementById("portfolio-container");
const mobileMenuButton = document.getElementById("mobile-menu-button");
const mobileMenu = document.getElementById("mobile-menu");
const contactForm = document.getElementById("contact-form");
const formMessage = document.getElementById("form-message");
const currentYearElement = document.getElementById("current-year");

// Initialize portfolio
function initPortfolio() {
  portfolioContainer.innerHTML = "";

  portfolioItems.forEach((item) => {
    const portfolioSection = document.createElement("div");
    portfolioSection.className = "mb-20";

    const heading = document.createElement("h3");
    heading.className = "font-serif text-3xl mb-2";
    heading.textContent = item.title;

    const subtitle = document.createElement("p");
    subtitle.className = "text-[#666666] mb-6";
    subtitle.textContent = item.subtitle;

    const galleryContainer = document.createElement("div");
    galleryContainer.className = "relative";

    const gallery = document.createElement("div");
    gallery.className = "gallery";
    gallery.id = `gallery-${item.id}`;

    item.images.forEach((image, index) => {
      const galleryItem = document.createElement("div");
      galleryItem.className = "gallery-item";

      const img = document.createElement("img");
      img.src = image.src;
      img.alt = `${item.title} - Image ${index + 1}`;
      img.loading = "lazy";

      galleryItem.appendChild(img);
      gallery.appendChild(galleryItem);
    });

    // Navigation arrows for desktop
    const prevButton = document.createElement("div");
    prevButton.className = "gallery-nav prev hidden md:flex";
    prevButton.innerHTML = `
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
            </svg>
        `;

    const nextButton = document.createElement("div");
    nextButton.className = "gallery-nav next hidden md:flex";
    nextButton.innerHTML = `
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
        `;

    galleryContainer.appendChild(gallery);
    galleryContainer.appendChild(prevButton);
    galleryContainer.appendChild(nextButton);

    portfolioSection.appendChild(heading);
    portfolioSection.appendChild(subtitle);
    portfolioSection.appendChild(galleryContainer);

    portfolioContainer.appendChild(portfolioSection);

    // Add event listeners for navigation arrows
    prevButton.addEventListener("click", () => {
      gallery.scrollBy({
        left: -300,
        behavior: "smooth",
      });
    });

    nextButton.addEventListener("click", () => {
      gallery.scrollBy({
        left: 300,
        behavior: "smooth",
      });
    });
  });
}

// Mobile menu toggle
mobileMenuButton.addEventListener("click", () => {
  mobileMenu.classList.toggle("hidden");
});

// Close mobile menu when clicking on a link
const mobileLinks = mobileMenu.querySelectorAll("a");
mobileLinks.forEach((link) => {
  link.addEventListener("click", () => {
    mobileMenu.classList.add("hidden");
  });
});

// Form submission
contactForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // In a real implementation, you would send the form data to a server here
  // For this example, we'll just show a success message

  formMessage.textContent =
    "Thank you for your message. I will get back to you soon.";
  formMessage.className = "mt-4 p-4 bg-green-100 text-green-700 rounded";
  formMessage.classList.remove("hidden");

  contactForm.reset();

  // Hide the message after 5 seconds
  setTimeout(() => {
    formMessage.classList.add("hidden");
  }, 5000);
});

// Set current year in footer
currentYearElement.textContent = new Date().getFullYear();

// Fade in animation on scroll
const fadeElements = document.querySelectorAll(".fade-in");

const fadeInOnScroll = () => {
  fadeElements.forEach((element) => {
    const elementTop = element.getBoundingClientRect().top;
    const elementVisible = 150;

    if (elementTop < window.innerHeight - elementVisible) {
      element.classList.add("visible");
    }
  });
};

// Add fade-in class to sections
document.querySelectorAll("section").forEach((section) => {
  section.classList.add("fade-in");
});

// Run once on page load
fadeInOnScroll();

// Run on scroll
window.addEventListener("scroll", fadeInOnScroll);

// Initialize portfolio when DOM is loaded
document.addEventListener("DOMContentLoaded", initPortfolio);
