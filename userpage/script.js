document.addEventListener("DOMContentLoaded", () => {
  let dummy = JSON.parse(localStorage.getItem("user")) || null;
  console.log(dummy);
  const user_name = dummy.displayName;
  const user_pic = dummy.photoURL;
  const user_mail = dummy.email;

  // Carousel functionaties
  const track = document.querySelector(".carousel-track");
  const slides = document.querySelectorAll(".carousel-slide");
  const nextButton = document.querySelector(".next-btn");
  const prevButton = document.querySelector(".prev-btn");
  const crossbtn = document.querySelector(".close");
  const hambtn = document.querySelector(".hamburger");
  const profile_name = document.querySelector(".profile_name");
  const profile_pic = document.querySelector(".profile_pic");
  const book_now = document.getElementById("book_now");

  // popup profile
  const pop_profile = document.getElementById("profilePic");
  const pop_name = document.getElementById("profileName");
  const pop_email = document.getElementById("profileEmail");
  const pop_close = document.getElementById("closePopup");
  const logout_pop = document.querySelector(".logout");

  profile_pic.addEventListener("click", () => {
    logout_pop.classList.toggle("hidden");
  });
  pop_close.addEventListener("click", () => {
    logout_pop.classList.toggle("hidden");
  });

  if (user_name) {
    profile_name.textContent = user_name;
    pop_name.textContent = user_name;
    pop_email.textContent = user_mail;
    pop_profile.src = user_pic;

    const img = document.createElement("img");
    img.src = user_pic; // Replace with your image URL
    img.alt = "Profile Picture";
    img.style.borderRadius = "50%"; // Optional: Make it round
    img.width = 33; // Adjust size as needed
    img.height = 33;
    // Remove existing SVG inside profile_pic
    profile_pic.innerHTML = "";
    profile_pic.style.padding = "0";
    profile_pic.style.border = "none";
    book_now.textContent = "BOOK NOW";
    book_now.href = "./services.html"; // Set the new URL

    // Append the new image
    profile_pic.appendChild(img);
  }

  document.getElementById("nav-toggle").addEventListener("click", function () {
    document.getElementById("sidebar").classList.toggle("active");
    // Toggle the active state for the nav-toggle button
    this.classList.toggle("active");
  });
  hambtn.addEventListener("click", () => {
    crossbtn.classList.toggle("hidden");
    hambtn.classList.toggle("hidden");
  });
  crossbtn.addEventListener("click", () => {
    crossbtn.classList.toggle("hidden");
    hambtn.classList.toggle("hidden");
  });

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
});

// new

//selection of itmes
document.addEventListener("DOMContentLoaded", () => {
  const dialogOverlay = document.getElementById("dialogOverlay");
  const confirmationDialog = document.getElementById("confirmationDialog");
  const appointment = document.querySelectorAll(".btn-primary");
  const closeButton = document.getElementById("closeButton");
  const actionButtons = document.querySelector(".action-button");
  const service_grid = document.querySelector(".services-grid");

  const confirmButton = document.querySelectorAll(".confirmButton");
  confirmButton.forEach((btn) => {
    btn.addEventListener("click", () => {
      showConfirmation();
    });
  });

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

  service_grid.addEventListener("click", (event) => {
    if (event.target.classList.contains("btn-primary")) {
      console.log("Appointment button clicked!");
      openDialog(); // Call your dialog function here
    }
  });

  //handling events
  appointment.forEach((btn) => {
    btn.addEventListener("click", () => {
      console.log("appoinment clicked");
      openDialog();
    });
  });

  closeButton.addEventListener("click", closeDialog);

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

// book slot
let hours = 9;
let minutes = 30;
let period = "AM";

const dialogOverlay2 = document.getElementById("dialogOverlay2");
const closeDialogBtn = document.getElementById("closeDialog");
const dialogOverlay = document.getElementById("dialogOverlay");
const bookslot = document.getElementById("bookslot");

bookslot.addEventListener("click", bookopenDialog);

function bookopenDialog() {
  console.log("slot opened");
  dialogOverlay.classList.add("hidden");
  dialogOverlay2.classList.add("active");
}

function bookcloseDialog() {
  dialogOverlay2.classList.remove("active");
}

// Close dialog when clicking outside
dialogOverlay2.addEventListener("click", (e) => {
  if (e.target === dialogOverlay) {
    bookcloseDialog();
  }
});

closeDialogBtn.addEventListener("click", bookcloseDialog);

// Close on escape key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && dialogOverlay2.classList.contains("active")) {
    bookcloseDialog();
  }
});

function padNumber(num) {
  return num.toString().padStart(2, "0");
}

function updateDisplay() {
  document.getElementById("hours").textContent = padNumber(hours);
  document.getElementById("minutes").textContent = padNumber(minutes);
  document.getElementById("period").textContent = period;
}

function incrementHours() {
  hours = hours === 12 ? 1 : hours + 1;
  updateDisplay();
}

function decrementHours() {
  hours = hours === 1 ? 12 : hours - 1;
  updateDisplay();
}

function incrementMinutes() {
  minutes = minutes === 59 ? 0 : minutes + 1;
  updateDisplay();
}

function decrementMinutes() {
  minutes = minutes === 0 ? 59 : minutes - 1;
  updateDisplay();
}

function togglePeriod() {
  period = period === "AM" ? "PM" : "AM";
  updateDisplay();
}

function confirmTime() {
  const timeString = `${padNumber(hours)}:${padNumber(minutes)} ${period}`;
  console.log(`Selected time: ${timeString}`);
  bookcloseDialog();
}

fetch("http://localhost:5000/api/services")
  .then((response) => response.json())
  .then((data) => {
    let servicesContainer = document.querySelector(".services-grid");
    data.forEach((service) => {
      servicesContainer.innerHTML += `
        <div class="service-card">
          <img src="${service.image}" alt="${service.title}">
          <div class="service-content">
            <h3>${service.title}</h3>
            <p>${service.description}</p>
            <p class="price" >${service.price}</p>
            <button class="btn-primary">Appointment</button>
          </div>  
        </div>
      `;
    });
  })
  .catch((error) => console.error("Error fetching services:", error));
