// State management
const state = {
  waitingCustomers: [
    {
      id: "3",
      name: "Sarah Johnson",
      email: "sarah@example.com",
      serviceId: "2",
      status: "waiting",
    },
    {
      id: "4",
      name: "Mike Wilson",
      email: "mike@example.com",
      serviceId: "1",
      status: "waiting",
    },
  ],
  services: [
    {
      id: "1",
      name: "Haircut & Styling",
      description: "Professional haircut and styling service",
      price: 60,
      imageUrl:
        "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=1000",
    },
  ],
  workers: [
    { id: "1", name: "Alex", status: "unoccupied" },
    { id: "2", name: "Maria", status: "unoccupied" },
    { id: "3", name: "David", status: "unoccupied" },
  ],
  history: [
    {
      id: "1",
      customerId: "1",
      customerName: "Jane Smith",
      serviceId: "1",
      serviceName: "Haircut & Styling",
      workerId: "1",
      workerName: "Alex",
      date: new Date(),
    },
  ],
  appointments: false,
};

// DOM Elements
const navLinks = document.querySelectorAll(".nav-link");
const tabContents = document.querySelectorAll(".tab-content");
const toggleAppointmentsBtn = document.getElementById("toggle-appointments");
const modal = document.getElementById("customer-modal");
const modalClose = document.querySelector(".modal-close");
const serviceForm = document.getElementById("service-form");
const bookingForm = document.getElementById("booking-form");

// Navigation
navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    const tab = link.dataset.tab;

    navLinks.forEach((l) => l.classList.remove("active"));
    tabContents.forEach((t) => t.classList.remove("active"));

    link.classList.add("active");
    document.getElementById(tab).classList.add("active");

    updateUI();
  });
});

// Toggle Appointments
toggleAppointmentsBtn.addEventListener("click", () => {
  state.appointments = !state.appointments;
  toggleAppointmentsBtn.textContent = state.appointments
    ? "RESUME APPOINTMENTS"
    : "STOP APPOINTMENTS";
  toggleAppointmentsBtn.classList.toggle("stopped", state.appointments);
});

// Modal
modalClose.addEventListener("click", () => {
  modal.classList.remove("active");
});

modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.classList.remove("active");
  }
});

// Forms
serviceForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);

  const newService = {
    id: Date.now().toString(),
    name: formData.get("name"),
    description: formData.get("description"),
    price: parseFloat(formData.get("price")),
    imageUrl: formData.get("imageUrl") || undefined,
  };

  state.services.push(newService);
  e.target.reset();
  updateUI();
});

bookingForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);

  const newBooking = {
    id: Date.now().toString(),
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    serviceId: formData.get("service"),
    appointmentTime: new Date(
      `${formData.get("date")}T${formData.get("time")}`
    ),
    status: "waiting",
  };

  state.waitingCustomers.push(newBooking);
  e.target.reset();
  updateUI();
});

// UI Updates
function updateUI() {
  // Update statistics
  document.getElementById("waiting-count").textContent =
    state.waitingCustomers.length;
  document.getElementById("customers-count").textContent = state.history.length;
  document.getElementById("bookings-count").textContent =
    state.waitingCustomers.length;

  // Update history
  const historyList = document.getElementById("history-list");
  historyList.innerHTML = state.history
    .map(
      (entry) => `
    <div class="history-card" data-id="${entry.id}">
      <div class="history-card-header">
        <h4>${entry.customerName}</h4>
        <span>${new Date(entry.date).toLocaleTimeString()}</span>
      </div>
      <p>${entry.serviceName}</p>
      <p class="text-sm">Served by ${entry.workerName}</p>
    </div>
  `
    )
    .join("");

  // Update services dropdown
  const serviceSelect = document.querySelector('select[name="service"]');
  if (serviceSelect) {
    serviceSelect.innerHTML = `
      <option value="">Select a service</option>
      ${state.services
        .map(
          (service) => `
        <option value="${service.id}">${service.name} - $${service.price}</option>
      `
        )
        .join("")}
    `;
  }

  // Update services grid
  const servicesGrid = document.getElementById("services-grid");
  if (servicesGrid) {
    servicesGrid.innerHTML = state.services
      .map(
        (service) => `
      <div class="service-card">
        ${
          service.imageUrl
            ? `
          <img src="${service.imageUrl}" alt="${service.name}" class="service-image">
        `
            : `
          <div class="service-image-placeholder">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
          </div>
        `
        }
        <div class="service-info">
          <h3>${service.name}</h3>
          <p>${service.description}</p>
          <p class="service-price">$${service.price}</p>
        </div>
        <button class="delete-service" data-id="${service.id}">&times;</button>
      </div>
    `
      )
      .join("");
  }

  // Update workers grid
  const workersGrid = document.getElementById("workers-grid");
  if (workersGrid) {
    workersGrid.innerHTML = state.workers
      .map(
        (worker) => `
      <div class="worker-card">
        <div class="worker-info">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          <h3>${worker.name}</h3>
        </div>
        <p class="worker-status ${worker.status}">${worker.status}</p>
        <button class="worker-action" data-id="${worker.id}">
          ${worker.status === "occupied" ? "Finish Service" : "Start Service"}
        </button>
      </div>
    `
      )
      .join("");
  }
}

// Initial UI update
updateUI();

// Event delegation for dynamic elements
document.addEventListener("click", (e) => {
  // History card click
  if (e.target.closest(".history-card")) {
    const id = e.target.closest(".history-card").dataset.id;
    const entry = state.history.find((h) => h.id === id);
    if (entry) {
      showCustomerModal(entry);
    }
  }

  // Delete service button
  if (e.target.classList.contains("delete-service")) {
    const id = e.target.dataset.id;
    state.services = state.services.filter((s) => s.id !== id);
    updateUI();
  }

  // Worker action button
  if (e.target.classList.contains("worker-action")) {
    const id = e.target.dataset.id;
    const worker = state.workers.find((w) => w.id === id);
    if (worker) {
      if (worker.status === "occupied") {
        finishService(worker);
      } else {
        startService(worker);
      }
    }
  }
});

function showCustomerModal(entry) {
  const modalBody = modal.querySelector(".modal-body");
  modalBody.innerHTML = `
    <h3 class="modal-title">Customer Details</h3>
    <div class="modal-section">
      <h4>Customer Information</h4>
      <p>Name: ${entry.customerName}</p>
      <p>Service: ${entry.serviceName}</p>
      <p>Worker: ${entry.workerName}</p>
      <p>Date: ${new Date(entry.date).toLocaleString()}</p>
    </div>
  `;
  modal.classList.add("active");
}

function startService(worker) {
  if (state.waitingCustomers.length === 0) return;

  const customer = state.waitingCustomers[0];
  worker.status = "occupied";
  worker.currentCustomer = customer;

  state.waitingCustomers = state.waitingCustomers.slice(1);
  updateUI();
}

function finishService(worker) {
  if (!worker.currentCustomer) return;

  const historyEntry = {
    id: Date.now().toString(),
    customerId: worker.currentCustomer.id,
    customerName: worker.currentCustomer.name,
    serviceId: worker.currentCustomer.serviceId,
    serviceName:
      state.services.find((s) => s.id === worker.currentCustomer.serviceId)
        ?.name || "Unknown Service",
    workerId: worker.id,
    workerName: worker.name,
    date: new Date(),
  };

  state.history.unshift(historyEntry);
  worker.status = "unoccupied";
  worker.currentCustomer = undefined;
  updateUI();
}
