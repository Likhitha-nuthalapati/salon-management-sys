// State Management
let state = {
  waitingList: [],
  serviceSlots: [],
  services: [],
  bookings: [],
  history: [],
  isAcceptingAppointments: true,
};

// Load initial data from localStorage
function loadInitialData() {
  const savedState = localStorage.getItem("salonState");
  if (savedState) {
    state = JSON.parse(savedState);
  } else {
    // Initial demo data
    state.services = [
      { id: "s1", name: "Haircut", price: 30, duration: 30 },
      { id: "s2", name: "Hair Color", price: 60, duration: 90 },
      { id: "s3", name: "Beard Trim", price: 20, duration: 20 },
    ];
    state.serviceSlots = [
      { id: "slot1", barber: "Alex", customer: null, status: "unoccupied" },
      { id: "slot2", barber: "Maria", customer: null, status: "unoccupied" },
      { id: "slot3", barber: "David", customer: null, status: "unoccupied" },
    ];
    saveState();
  }
  updateUI();
}

// Save state to localStorage
function saveState() {
  localStorage.setItem("salonState", JSON.stringify(state));
}

// Navigation
function setupNavigation() {
  const links = document.querySelectorAll(".nav-link");
  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const page = link.dataset.page;
      showPage(page);
    });
  });
}

function showPage(pageId) {
  document
    .querySelectorAll(".page")
    .forEach((page) => page.classList.remove("active"));
  document
    .querySelectorAll(".nav-link")
    .forEach((link) => link.classList.remove("active"));

  document.getElementById(pageId).classList.add("active");
  document.querySelector(`[data-page="${pageId}"]`).classList.add("active");

  updateUI();
}

// Update UI
function updateUI() {
  updateStats();
  updateWaitingList();
  updateServiceArea();
  updateHistory();
  updateServicesList();
  updateBookingsList();
  lucide.createIcons();
}

function updateStats() {
  document.getElementById("waitingCount").textContent =
    state.waitingList.length;
  document.getElementById("customersCount").textContent = state.history.length;
  document.getElementById("bookingsCount").textContent = state.bookings.length;
  document.getElementById("monthlyCustomers").textContent =
    getMonthlyCustomersCount();
}

function getMonthlyCustomersCount() {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  return state.history.filter((h) => new Date(h.date) >= monthStart).length;
}

// Waiting List Management
function updateWaitingList() {
  const container = document.getElementById("waitingListContainer");
  if (!container) return;

  container.innerHTML = state.waitingList
    .map(
      (customer) => `
        <div class="customer-card">
            <div class="customer-card-header">
                <div class="customer-info">
                    <div class="customer-avatar">
                        <i data-lucide="user"></i>
                    </div>
                    <div class="customer-details">
                        <h3>${customer.name}</h3>
                        <div class="customer-meta">
                            <span><i data-lucide="clock"></i> ${customer.timestamp}</span>
                            <span><i data-lucide="scissors"></i> ${customer.service}</span>
                        </div>
                    </div>
                </div>
                <button class="btn-primary" onclick="deleteWaitingCustomer('${customer.id}')">
                    <i data-lucide="trash-2"></i>
                </button>
            </div>
        </div>
    `
    )
    .join("");
}

function deleteWaitingCustomer(id) {
  state.waitingList = state.waitingList.filter((c) => c.id !== id);
  saveState();
  updateUI();
}

// Service Area Management
function updateServiceArea() {
  const container = document.getElementById("serviceAreaContainer");
  if (!container) return;

  container.innerHTML = state.serviceSlots
    .map(
      (slot) => `
        <div class="customer-card">
            <div class="customer-card-header">
                <div class="customer-info">
                    <div class="customer-avatar">
                        <i data-lucide="user"></i>
                    </div>
                    <h3>${slot.barber}</h3>
                </div>
                <span class="status-badge ${slot.status}">${slot.status}</span>
            </div>
            ${
              slot.customer
                ? `
                <div class="customer-details">
                    <p>${slot.customer.name}</p>
                    <div class="customer-meta">
                        <span><i data-lucide="clock"></i> ${slot.customer.timestamp}</span>
                        <span><i data-lucide="scissors"></i> ${slot.customer.service}</span>
                    </div>
                </div>
            `
                : ""
            }
            <div class="slot-actions">
                <button 
                    class="btn-primary"
                    onclick="toggleSlotStatus('${slot.id}')"
                >
                    ${
                      slot.status === "occupied"
                        ? "Mark Complete"
                        : "Start Service"
                    }
                </button>
            </div>
        </div>
    `
    )
    .join("");
}

function toggleSlotStatus(slotId) {
  const slot = state.serviceSlots.find((s) => s.id === slotId);
  if (slot.status === "occupied") {
    // Add to history
    if (slot.customer) {
      state.history.unshift({
        id: generateId(),
        customer: slot.customer,
        barber: slot.barber,
        date: new Date().toISOString(),
        status: "completed",
      });
    }
    slot.customer = null;
    slot.status = "unoccupied";
  } else if (state.waitingList.length > 0) {
    const customer = state.waitingList.shift();
    slot.customer = customer;
    slot.status = "occupied";
  }
  saveState();
  updateUI();
}

// Services Management
function updateServicesList() {
  const container = document.getElementById("servicesList");
  if (!container) return;

  container.innerHTML = state.services
    .map(
      (service) => `
        <div class="customer-card">
            <div class="customer-card-header">
                <div class="customer-info">
                    <h3>${service.name}</h3>
                    <p>$${service.price} - ${service.duration} minutes</p>
                </div>
                <button class="btn-primary" onclick="deleteService('${service.id}')">
                    <i data-lucide="trash-2"></i>
                </button>
            </div>
        </div>
    `
    )
    .join("");

  // Update booking form service options
  const serviceSelect = document.getElementById("bookingService");
  if (serviceSelect) {
    serviceSelect.innerHTML = state.services
      .map(
        (service) =>
          `<option value="${service.id}">${service.name} - $${service.price}</option>`
      )
      .join("");
  }
}

// Bookings Management
function updateBookingsList() {
  const container = document.getElementById("bookingsList");
  if (!container) return;

  const dateFilter = document.getElementById("dateFilter").value;
  let filteredBookings = state.bookings;
  if (dateFilter) {
    filteredBookings = state.bookings.filter((b) =>
      b.date.startsWith(dateFilter)
    );
  }

  container.innerHTML = filteredBookings
    .map(
      (booking) => `
        <div class="customer-card">
            <div class="customer-card-header">
                <div class="customer-info">
                    <h3>${booking.customerName}</h3>
                    <div class="customer-meta">
                        <span><i data-lucide="calendar"></i> ${
                          booking.date
                        }</span>
                        <span><i data-lucide="clock"></i> ${booking.time}</span>
                        <span><i data-lucide="scissors"></i> ${getServiceName(
                          booking.serviceId
                        )}</span>
                    </div>
                </div>
                <div class="booking-actions">
                    <button class="btn-primary" onclick="deleteBooking('${
                      booking.id
                    }')">
                        <i data-lucide="trash-2"></i>
                    </button>
                </div>
            </div>
        </div>
    `
    )
    .join("");
}

// History Management
function updateHistory() {
  const container = document.getElementById("historyList");
  if (!container) return;

  container.innerHTML = state.history
    .map(
      (record) => `
        <div class="history-item">
            <div class="history-info">
                <h4>${record.customer.name}</h4>
                <div class="customer-meta">
                    <span><i data-lucide="user"></i> ${record.barber}</span>
                    <span><i data-lucide="scissors"></i> ${
                      record.customer.service
                    }</span>
                    <span><i data-lucide="calendar"></i> ${new Date(
                      record.date
                    ).toLocaleDateString()}</span>
                </div>
            </div>
            <span class="status-badge completed">Completed</span>
        </div>
    `
    )
    .join("");
}

// Event Listeners
function setupEventListeners() {
  // Stop Appointments Button
  document.getElementById("stopAppointments").addEventListener("click", () => {
    state.isAcceptingAppointments = !state.isAcceptingAppointments;
    const btn = document.getElementById("stopAppointments");
    btn.textContent = state.isAcceptingAppointments
      ? "STOP APPOINTMENTS"
      : "RESUME APPOINTMENTS";
    btn.classList.toggle("active");
    saveState();
  });

  // Add Service Form
  document.getElementById("addServiceForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("serviceName").value;
    const price = document.getElementById("servicePrice").value;
    const duration = document.getElementById("serviceDuration").value;

    state.services.push({
      id: generateId(),
      name,
      price: Number(price),
      duration: Number(duration),
    });

    e.target.reset();
    saveState();
    updateUI();
  });

  // New Booking
  document.getElementById("newBookingBtn").addEventListener("click", () => {
    document.getElementById("bookingModal").classList.add("active");
  });

  // Close Modal
  document.querySelector(".close-modal").addEventListener("click", () => {
    document.getElementById("bookingModal").classList.remove("active");
  });

  // Booking Form
  document.getElementById("bookingForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const booking = {
      id: generateId(),
      customerName: document.getElementById("customerName").value,
      serviceId: document.getElementById("bookingService").value,
      date: document.getElementById("bookingDate").value,
      time: document.getElementById("bookingTime").value,
    };

    state.bookings.push(booking);
    document.getElementById("bookingModal").classList.remove("active");
    e.target.reset();
    saveState();
    updateUI();
  });

  // Date Filter
  document
    .getElementById("dateFilter")
    .addEventListener("change", updateBookingsList);
}

// Utility Functions
function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

function getServiceName(serviceId) {
  const service = state.services.find((s) => s.id === serviceId);
  return service ? service.name : "Unknown Service";
}

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  loadInitialData();
  setupNavigation();
  setupEventListeners();
  showPage("home");
});
