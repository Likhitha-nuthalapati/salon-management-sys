document.addEventListener("DOMContentLoaded", () => {
  // Carousel functionaties
  const track = document.querySelector(".carousel-track");
  const slides = document.querySelectorAll(".carousel-slide");
  const nextButton = document.querySelector(".next-btn");
  const prevButton = document.querySelector(".prev-btn");
  let currentIndex = 0;

  if (track && slides.length > 0) {
    const slideWidth = 100; // 100%
    const maxIndex = slides.length - 1;

    function updateSlidePosition() {
      track.style.transform = `translateX(-${currentIndex * slideWidth}%)`;
    }

    nextButton?.addEventListener("click", () => {
      currentIndex = currentIndex === maxIndex ? 0 : currentIndex + 1;
      updateSlidePosition();
    });

    prevButton?.addEventListener("click", () => {
      currentIndex = currentIndex === 0 ? maxIndex : currentIndex - 1;
      updateSlidePosition();
    });

    // Auto-advance carousel
    setInterval(() => {
      currentIndex = currentIndex === maxIndex ? 0 : currentIndex + 1;
      updateSlidePosition();
    }, 5000);
  }

  // Smooth scroll for navigation links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
        });
      }
    });
  });

  // Mobile menu functionality (if needed in the future)
  const header = document.querySelector(".header");
  let lastScroll = 0;

  window.addEventListener("scroll", () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll <= 0) {
      header.classList.remove("scroll-up");
      return;
    }

    if (
      currentScroll > lastScroll &&
      !header.classList.contains("scroll-down")
    ) {
      // Scroll down
      header.classList.remove("scroll-up");
      header.classList.add("scroll-down");
    } else if (
      currentScroll < lastScroll &&
      header.classList.contains("scroll-down")
    ) {
      // Scroll up
      header.classList.remove("scroll-down");
      header.classList.add("scroll-up");
    }
    lastScroll = currentScroll;
  });

  // Book Now button functionality
  const bookButtons = document.querySelectorAll(".btn-primary");
  bookButtons.forEach((button) => {
    button.addEventListener("click", () => {});
  });
});

// new

//selection of itmes
document.addEventListener("DOMContentLoaded", () => {
  const dialogOverlay = document.getElementById("dialogOverlay");
  const confirmationDialog = document.getElementById("confirmationDialog");
  const appointment = document.querySelectorAll(".btn-primary");
  const closeButton = document.getElementById("closeButton");
  const confirmButton = document.getElementById("confirmButton");
  const actionButtons = document.querySelector(".action-button");

  const openDialog = () => {
    dialogOverlay.classList.remove("hidden");
  };

  const closeDialog = () => {
    dialogOverlay.classList.add("hidden");
  };

  const showConfirmation = () => {
    dialogOverlay.classList.add("hidden");
    confirmationDialog.classList.remove("hidden");
    console.log("confrim clicked");
    // Auto-hide confirmation after 2 seconds
    setTimeout(() => {
      confirmationDialog.classList.add("hidden");
    }, 2000);
  };

  //handling events
  appointment.forEach((btn) => {
    btn.addEventListener("click", () => {
      console.log("appoinment clicked");
      openDialog();
    });
  });

  closeButton.addEventListener("click", closeDialog);
  confirmButton.addEventListener("click", showConfirmation);

  // Handle other action buttons
  actionButtons.forEach((button) => {
    if (button !== confirmButton) {
      button.addEventListener("click", closeDialog);
    }
  });

  // Close dialog when clicking outside
  dialogOverlay.addEventListener("click", (e) => {
    if (e.target === dialogOverlay) {
      closeDialog();
    }
  });

  confirmationDialog.addEventListener("click", (e) => {
    if (e.target === confirmationDialog) {
      confirmationDialog.classList.add("hidden");
    }
  });

  // Close dialog with Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (!dialogOverlay.classList.contains("hidden")) {
        closeDialog();
      }
      if (!confirmationDialog.classList.contains("hidden")) {
        confirmationDialog.classList.add("hidden");
      }
    }
  });
});
