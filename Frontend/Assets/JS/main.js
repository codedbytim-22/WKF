// ===== W.K.F Foundation - Main JavaScript =====
// Handles common functionality across public pages

document.addEventListener("DOMContentLoaded", function () {
  // Initialize all components
  initNavigation();
  initScrollEffects();
  initStatsCounter();
  initGallery();
  initDonationForm();
  initContactForm();
  initModals();
  initAnimations();
});

// ===== Navigation & Header =====
function initNavigation() {
  const hamburger = document.querySelector(".hamburger");
  const navMenu = document.querySelector(".nav-menu");
  const header = document.querySelector(".header");

  // Toggle mobile menu
  if (hamburger) {
    hamburger.addEventListener("click", function () {
      navMenu.classList.toggle("active");
      hamburger.classList.toggle("active");

      // Animate hamburger
      const spans = hamburger.querySelectorAll("span");
      if (hamburger.classList.contains("active")) {
        spans[0].style.transform = "rotate(45deg) translate(5px, 6px)";
        spans[1].style.opacity = "0";
        spans[2].style.transform = "rotate(-45deg) translate(7px, -8px)";
      } else {
        spans[0].style.transform = "none";
        spans[1].style.opacity = "1";
        spans[2].style.transform = "none";
      }
    });
  }

  // Close mobile menu when clicking outside
  document.addEventListener("click", function (event) {
    if (navMenu && navMenu.classList.contains("active")) {
      if (
        !event.target.closest(".nav-menu") &&
        !event.target.closest(".hamburger")
      ) {
        navMenu.classList.remove("active");
        if (hamburger) {
          hamburger.classList.remove("active");
          const spans = hamburger.querySelectorAll("span");
          spans[0].style.transform = "none";
          spans[1].style.opacity = "1";
          spans[2].style.transform = "none";
        }
      }
    }
  });

  // Set active navigation link
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  const navLinks = document.querySelectorAll(".nav-link");

  navLinks.forEach((link) => {
    const linkHref = link.getAttribute("href");
    if (
      linkHref === currentPage ||
      (currentPage === "" && linkHref === "index.html") ||
      (currentPage === "/" && linkHref === "index.html")
    ) {
      link.classList.add("active");
    }
  });
}

// ===== Scroll Effects =====
function initScrollEffects() {
  const header = document.querySelector(".header");

  window.addEventListener("scroll", function () {
    // Sticky header background change
    if (window.scrollY > 100) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }

    // Reveal animations on scroll
    revealOnScroll();
  });
}

// ===== Stats Counter Animation =====
function initStatsCounter() {
  const statNumbers = document.querySelectorAll(".stat-number");

  function animateStats() {
    statNumbers.forEach((stat) => {
      const target = parseInt(stat.getAttribute("data-target"));
      const current = parseInt(stat.innerText.replace(/[^0-9]/g, ""));

      if (!isNaN(target) && current < target) {
        const increment = Math.ceil(target / 50);
        let newValue = current + increment;

        if (newValue > target) {
          newValue = target;
        }

        // Format number with commas
        stat.innerText = newValue.toLocaleString();

        setTimeout(() => {
          requestAnimationFrame(animateStats);
        }, 30);
      }
    });
  }

  // Start animation when stats section is in view
  const statsSection = document.querySelector(".stats-grid");
  if (statsSection) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateStats();
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 },
    );

    observer.observe(statsSection);
  }
}

// ===== Gallery Functionality =====
function initGallery() {
  const galleryItems = document.querySelectorAll(".gallery-item");
  const modal = document.querySelector(".gallery-modal");
  const modalImg = document.querySelector(".modal-content img");
  const closeModal = document.querySelector(".close-modal");

  if (galleryItems.length > 0 && modal) {
    galleryItems.forEach((item) => {
      item.addEventListener("click", function () {
        const imgSrc = this.querySelector("img").src;
        const imgAlt = this.querySelector("img").alt;

        if (modalImg) {
          modalImg.src = imgSrc;
          modalImg.alt = imgAlt;
        }

        modal.classList.add("active");
        document.body.style.overflow = "hidden";
      });
    });
  }

  // Close modal
  if (closeModal) {
    closeModal.addEventListener("click", function () {
      modal.classList.remove("active");
      document.body.style.overflow = "auto";
    });
  }

  // Close modal when clicking outside
  if (modal) {
    modal.addEventListener("click", function (e) {
      if (e.target === modal) {
        modal.classList.remove("active");
        document.body.style.overflow = "auto";
      }
    });
  }

  // Keyboard navigation for modal
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && modal.classList.contains("active")) {
      modal.classList.remove("active");
      document.body.style.overflow = "auto";
    }
  });
}

// ===== Donation Form Handler =====
function initDonationForm() {
  const donationForm = document.getElementById("donationForm");

  if (donationForm) {
    // Custom amount input handler
    const customAmount = document.getElementById("customAmount");
    const amountRadios = document.querySelectorAll('input[name="amount"]');

    if (customAmount && amountRadios) {
      customAmount.addEventListener("focus", function () {
        // Uncheck all radio buttons
        amountRadios.forEach((radio) => {
          radio.checked = false;
        });
      });

      amountRadios.forEach((radio) => {
        radio.addEventListener("change", function () {
          if (this.checked) {
            customAmount.value = "";
          }
        });
      });
    }

    // Form submission
    donationForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // Validate form
      if (validateDonationForm()) {
        // Show loading state
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerText;
        submitBtn.innerText = "Processing...";
        submitBtn.disabled = true;

        // Collect form data
        const formData = {
          fullName: document.getElementById("fullName").value,
          email: document.getElementById("email").value,
          phone: document.getElementById("phone").value,
          amount: getDonationAmount(),
          program: document.getElementById("program").value,
          message: document.getElementById("message")?.value || "",
          donationDate: new Date().toISOString(),
          status: "pending",
          paymentMethod:
            document.querySelector('input[name="paymentMethod"]:checked')
              ?.value || "card",
        };

        // Simulate API call (will be replaced with Firebase)
        setTimeout(() => {
          console.log("Donation data:", formData);
          showNotification(
            "Thank you for your generous donation! You will receive a confirmation email shortly.",
            "success",
          );

          // Reset form
          donationForm.reset();

          // Reset button
          submitBtn.innerText = originalText;
          submitBtn.disabled = false;

          // Redirect to thank you page after 3 seconds
          setTimeout(() => {
            window.location.href = "donate-success.html";
          }, 3000);
        }, 2000);
      }
    });
  }
}

// ===== Validate Donation Form =====
function validateDonationForm() {
  let isValid = true;

  // Full Name validation
  const fullName = document.getElementById("fullName");
  if (fullName.value.trim().length < 3) {
    showError(fullName, "Please enter your full name");
    isValid = false;
  } else {
    clearError(fullName);
  }

  // Email validation
  const email = document.getElementById("email");
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.value)) {
    showError(email, "Please enter a valid email address");
    isValid = false;
  } else {
    clearError(email);
  }

  // Phone validation (optional but must be valid if provided)
  const phone = document.getElementById("phone");
  if (phone.value && !/^[\d\s\+\-\(\)]{10,}$/.test(phone.value)) {
    showError(phone, "Please enter a valid phone number");
    isValid = false;
  } else {
    clearError(phone);
  }

  // Amount validation
  const amount = getDonationAmount();
  if (!amount || parseFloat(amount) < 1) {
    showError(
      document.querySelector(".donation-amounts"),
      "Please enter a valid donation amount",
    );
    isValid = false;
  }

  return isValid;
}

// ===== Get Donation Amount =====
function getDonationAmount() {
  const selectedRadio = document.querySelector('input[name="amount"]:checked');
  const customAmount = document.getElementById("customAmount");

  if (selectedRadio) {
    return selectedRadio.value;
  } else if (customAmount && customAmount.value) {
    return customAmount.value;
  }
  return null;
}

// ===== Contact Form Handler =====
function initContactForm() {
  const contactForm = document.getElementById("contactForm");

  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      if (validateContactForm()) {
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerText;
        submitBtn.innerText = "Sending...";
        submitBtn.disabled = true;

        const formData = {
          name: document.getElementById("contactName").value,
          email: document.getElementById("contactEmail").value,
          subject: document.getElementById("subject").value,
          message: document.getElementById("contactMessage").value,
          date: new Date().toISOString(),
          status: "unread",
        };

        // Simulate API call
        setTimeout(() => {
          console.log("Contact form data:", formData);
          showNotification(
            "Thank you for your message! We will get back to you soon.",
            "success",
          );
          contactForm.reset();
          submitBtn.innerText = originalText;
          submitBtn.disabled = false;
        }, 1500);
      }
    });
  }
}

// ===== Form Validation Helpers =====
function showError(input, message) {
  const formGroup = input.closest(".form-group");
  let errorDiv = formGroup.querySelector(".error-message");

  if (!errorDiv) {
    errorDiv = document.createElement("div");
    errorDiv.className = "error-message";
    formGroup.appendChild(errorDiv);
  }

  errorDiv.textContent = message;
  input.classList.add("error");
}

function clearError(input) {
  const formGroup = input.closest(".form-group");
  const errorDiv = formGroup.querySelector(".error-message");

  if (errorDiv) {
    errorDiv.remove();
  }

  input.classList.remove("error");
}

// ===== Notification System =====
function showNotification(message, type = "info") {
  // Create notification element
  const notification = document.createElement("div");
  notification.className = `notification ${type}`;
  notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === "success" ? "fa-check-circle" : "fa-info-circle"}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">&times;</button>
    `;

  // Add styles
  notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === "success" ? "#28a745" : "#17a2b8"};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        display: flex;
        align-items: center;
        justify-content: space-between;
        min-width: 300px;
        max-width: 450px;
        z-index: 9999;
        animation: slideIn 0.3s ease;
    `;

  // Add to body
  document.body.appendChild(notification);

  // Close button
  const closeBtn = notification.querySelector(".notification-close");
  closeBtn.style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0 0 0 1rem;
    `;

  closeBtn.addEventListener("click", () => {
    notification.remove();
  });

  // Auto remove after 5 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.remove();
    }
  }, 5000);
}

// ===== Reveal Animations on Scroll =====
function revealOnScroll() {
  const elements = document.querySelectorAll(
    ".fade-in-up, .card, .gallery-item",
  );

  elements.forEach((element) => {
    const elementTop = element.getBoundingClientRect().top;
    const elementVisible = 150;

    if (elementTop < window.innerHeight - elementVisible) {
      element.classList.add("active");
    }
  });
}

// ===== Modal Management =====
function initModals() {
  // Generic modal trigger
  const modalTriggers = document.querySelectorAll("[data-modal-target]");

  modalTriggers.forEach((trigger) => {
    trigger.addEventListener("click", function () {
      const modalId = this.dataset.modalTarget;
      const modal = document.getElementById(modalId);

      if (modal) {
        modal.classList.add("active");
        document.body.style.overflow = "hidden";
      }
    });
  });
}

// ===== Load More Content =====
function initLoadMore() {
  const loadMoreBtn = document.querySelector(".load-more");

  if (loadMoreBtn) {
    loadMoreBtn.addEventListener("click", function () {
      // Simulate loading more items
      this.classList.add("loading");
      this.innerText = "Loading...";

      setTimeout(() => {
        // Add new items logic here
        this.classList.remove("loading");
        this.innerText = "Load More";
      }, 1500);
    });
  }
}

// ===== Initialize All Animations =====
function initAnimations() {
  // Add fade-in-up class to elements
  const heroContent = document.querySelector(".hero-content");
  if (heroContent) {
    heroContent.classList.add("fade-in-up");
  }

  // Animate on scroll
  window.addEventListener("load", revealOnScroll);
}

// Export functions for use in other files
window.WKF = {
  showNotification,
  validateDonationForm,
  getDonationAmount,
};
