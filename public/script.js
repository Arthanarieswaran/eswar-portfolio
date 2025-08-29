// DOM Elements
const navbar = document.getElementById("navbar");
const themeToggle = document.getElementById("themeToggle");
const typingText = document.getElementById("typingText");
const contactForm = document.getElementById("contactForm");
const submitBtn = document.querySelector(".submit-btn");

// Theme Management
function initTheme() {
  const savedTheme = localStorage.getItem("theme") || "light";
  document.documentElement.setAttribute("data-theme", savedTheme);
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute("data-theme");
  const newTheme = currentTheme === "dark" ? "light" : "dark";

  document.documentElement.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);
}

// Typing Animation
function initTypingAnimation() {
  const texts = [
    "Hi, I'm rawse 👋",
    "I'm a Full-Stack Developer.",
    "Front-End: React ⚛️ | Flutter 💙",
    "Back-End: Laravel 🟢 | Node.js 🔴",
    "Building apps for Web & Mobile.",
    "Creating Digital Excellence",
  ];

  let textIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let isPaused = false;

  function type() {
    const currentText = texts[textIndex];

    if (isPaused) {
      setTimeout(type, 1500);
      isPaused = false;
      return;
    }

    if (isDeleting) {
      typingText.textContent = currentText.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typingText.textContent = currentText.substring(0, charIndex + 1);
      charIndex++;
    }

    let typeSpeed = isDeleting ? 50 : 100;

    if (!isDeleting && charIndex === currentText.length) {
      isPaused = true;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      textIndex = (textIndex + 1) % texts.length;
    }

    setTimeout(type, typeSpeed);
  }

  type();
}

// Navbar Scroll Effect
function initNavbarScroll() {
  window.addEventListener("scroll", () => {
    if (window.scrollY > 100) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });
}

// Smooth Scrolling
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));

      if (target) {
        const offsetTop = target.offsetTop - 80;
        window.scrollTo({
          top: offsetTop,
          behavior: "smooth",
        });
      }
    });
  });
}

// Active Navigation Links
function initActiveNavLinks() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  function updateActiveLink() {
    let current = "";
    const scrollY = window.pageYOffset;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 100;
      const sectionHeight = section.offsetHeight;

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active");
      }
    });
  }

  window.addEventListener("scroll", updateActiveLink);
  updateActiveLink();
}

// Scroll Reveal Animation
function initScrollReveal() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("revealed");

        // Special handling for skills animation
        if (entry.target.classList.contains("skill-category")) {
          animateSkills(entry.target);
        }

        // Special handling for stats animation
        if (entry.target.classList.contains("hero-stats")) {
          animateStats();
        }
      }
    });
  }, observerOptions);

  // Observe elements
  document
    .querySelectorAll(".reveal-up, .skill-category, .hero-stats")
    .forEach((el) => {
      observer.observe(el);
    });
}

// Skills Animation
function animateSkills(skillCategory) {
  const skillItems = skillCategory.querySelectorAll(".skill-item");

  skillItems.forEach((item, index) => {
    const delay = item.getAttribute("data-delay") || index * 100;
    setTimeout(() => {
      item.classList.add("animate");
    }, parseInt(delay));
  });
}

// Stats Counter Animation
function animateStats() {
  const statNumbers = document.querySelectorAll(".stat-number");

  statNumbers.forEach((stat) => {
    const target = parseInt(stat.getAttribute("data-count"));
    let current = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      stat.textContent = Math.floor(current) + (target > 10 ? "+" : "");
    }, 50);
  });
}

// Contact Form
function initContactForm() {
  // Form field animations
  const formGroups = document.querySelectorAll(".form-group");

  formGroups.forEach((group) => {
    const input = group.querySelector("input, textarea");

    input.addEventListener("input", function () {
      if (this.value.trim() !== "") {
        this.setAttribute("data-filled", "true");
      } else {
        this.removeAttribute("data-filled");
      }
    });

    input.addEventListener("focus", function () {
      group.classList.add("focused");
    });

    input.addEventListener("blur", function () {
      group.classList.remove("focused");
    });
  });

  // Form submission
  contactForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    // Get form data
    const formData = new FormData(this);
    const data = Object.fromEntries(formData);

    // Validate form
    if (!validateForm(data)) {
      return;
    }

    // Show loading state
    showLoadingState();

    try {
      // Simulate form submission
      await simulateFormSubmission(data);
      showSuccessState();
      this.reset();

      // Reset form states
      formGroups.forEach((group) => {
        const input = group.querySelector("input, textarea");
        input.removeAttribute("data-filled");
        group.classList.remove("focused");
      });
    } catch (error) {
      showErrorState();
    }
  });
}

function validateForm(data) {
  const { name, email, subject, message } = data;

  if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
    showFormError("Please fill in all fields.");
    return false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    showFormError("Please enter a valid email address.");
    return false;
  }

  return true;
}

function showFormError(message) {
  // Create or update error message
  let errorDiv = document.querySelector(".form-error");
  if (!errorDiv) {
    errorDiv = document.createElement("div");
    errorDiv.className = "form-error";
    errorDiv.style.cssText = `
            background: #fee2e2;
            color: #dc2626;
            padding: 1rem;
            border-radius: 0.5rem;
            margin-top: 1rem;
            text-align: center;
            font-weight: 500;
        `;
    contactForm.appendChild(errorDiv);
  }

  errorDiv.textContent = message;
  errorDiv.style.display = "block";

  setTimeout(() => {
    errorDiv.style.display = "none";
  }, 5000);
}

function showLoadingState() {
  submitBtn.classList.add("loading");
  submitBtn.disabled = true;
}

function showSuccessState() {
  submitBtn.classList.remove("loading");
  submitBtn.classList.add("success");

  setTimeout(() => {
    submitBtn.classList.remove("success");
    submitBtn.disabled = false;
  }, 3000);
}

function showErrorState() {
  submitBtn.classList.remove("loading");
  submitBtn.style.background = "#ef4444";

  setTimeout(() => {
    submitBtn.style.background = "";
    submitBtn.disabled = false;
  }, 3000);
}

async function simulateFormSubmission(data) {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Simulate random success/failure for demo
  if (Math.random() > 0.1) {
    // 90% success rate
    console.log("Form submitted successfully:", data);
    return Promise.resolve();
  } else {
    return Promise.reject(new Error("Submission failed"));
  }
}

// Parallax Effect
function initParallax() {
  const heroSection = document.querySelector(".hero-section");
  const orbs = document.querySelectorAll(".gradient-orb");

  window.addEventListener("scroll", () => {
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.5;

    // Parallax for hero background
    if (heroSection && scrolled < window.innerHeight) {
      heroSection.style.transform = `translateY(${rate}px)`;
    }

    // Parallax for orbs
    orbs.forEach((orb, index) => {
      const orbRate = scrolled * (-0.2 - index * 0.1);
      orb.style.transform = `translateY(${orbRate}px)`;
    });
  });
}

// Project Cards Hover Effect
function initProjectCards() {
  const projectCards = document.querySelectorAll(".project-card");

  projectCards.forEach((card) => {
    card.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-15px) scale(1.02)";
    });

    card.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0) scale(1)";
    });
  });
}

// Mobile Menu Toggle
function initMobileMenu() {
  const navbarToggler = document.querySelector(".navbar-toggler");
  const navbarCollapse = document.querySelector(".navbar-collapse");

  if (navbarToggler) {
    navbarToggler.addEventListener("click", function () {
      this.classList.toggle("active");
    });
  }

  // Close mobile menu when clicking on nav links
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      if (navbarCollapse.classList.contains("show")) {
        navbarToggler.click();
      }
    });
  });
}

// Preload Images
function preloadImages() {
  const images = [
    "https://images.pexels.com/photos/177598/pexels-photo-177598.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/590016/pexels-photo-590016.jpeg?auto=compress&cs=tinysrgb&w=800",
  ];

  images.forEach((src) => {
    const img = new Image();
    img.src = src;
  });
}

// Performance Optimization
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Initialize everything when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  // Initialize all features
  initTheme();
  initTypingAnimation();
  initNavbarScroll();
  initSmoothScroll();
  initActiveNavLinks();
  initScrollReveal();
  initContactForm();
  initParallax();
  initProjectCards();
  initMobileMenu();
  preloadImages();

  // Event listeners
  themeToggle.addEventListener("click", toggleTheme);

  // Debounced scroll events
  const debouncedParallax = debounce(initParallax, 10);
  window.addEventListener("scroll", debouncedParallax);

  // Page load animation
  document.body.style.opacity = "0";
  document.body.style.transition = "opacity 0.5s ease";

  setTimeout(() => {
    document.body.style.opacity = "1";
  }, 100);
});

// Handle window resize
window.addEventListener(
  "resize",
  debounce(() => {
    // Reinitialize parallax calculations
    initParallax();
  }, 250)
);
