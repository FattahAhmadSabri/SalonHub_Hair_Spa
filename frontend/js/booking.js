// ==========================================
// ELEMENTS
// ==========================================

const bookingForm = document.getElementById("bookingForm");

const serviceSelect = document.getElementById("serviceId");

const dateInput = document.getElementById("date");

const startTimeInput = document.getElementById("startTime");

const bookButton = document.getElementById("bookButton");

const message = document.getElementById("message");

const saloonName = document.getElementById("saloonName");

// ==========================================
// API
// ==========================================

const API_BASE_URL = "http://localhost:4500";

// ==========================================
// GET DATA FROM URL
// ==========================================

const params = new URLSearchParams(window.location.search);

const saloonId = params.get("saloonId");

const selectedServiceId = params.get("serviceId");

// ==========================================
// CASHFREE
// ==========================================

const cashfree = Cashfree({
  mode: "sandbox",
});

// ==========================================
// MESSAGE
// ==========================================

const showMessage = (text, type = "error") => {
  message.textContent = text;

  message.className = `message ${type}`;
};

// ==========================================
// CHECK LOGIN
// ==========================================

const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "../login.html";
}

// ==========================================
// LOAD SALON
// ==========================================

const loadSaloon = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/saloon/get/${saloonId}`);

    console.log("Saloon response:", response.data);

    const saloon = response.data.data;

    if (!saloon) {
      saloonName.textContent = "Salon not found.";

      return;
    }

    saloonName.textContent = saloon.name;
  } catch (error) {
    console.error("Error loading salon:", error);

    saloonName.textContent = "Unable to load salon.";
  }
};

// ==========================================
// LOAD SERVICES
// ==========================================

const loadServices = async () => {
  try {
    serviceSelect.innerHTML = `
      <option value="">
        Loading services...
      </option>
    `;

    const response = await axios.get(`${API_BASE_URL}/saloon-service/all`);

    console.log("Services response:", response.data);

    const services = response.data.data;

    if (!services || services.length === 0) {
      serviceSelect.innerHTML = `
        <option value="">
          No services available
        </option>
      `;

      return;
    }

    // ======================================
    // FILTER SERVICES FOR THIS SALON
    // ======================================

    const salonServices = services.filter(
      (service) => String(service.saloonId) === String(saloonId),
    );

    console.log("Salon services:", salonServices);

    if (salonServices.length === 0) {
      serviceSelect.innerHTML = `
        <option value="">
          No services available
        </option>
      `;

      return;
    }

    // ======================================
    // CLEAR SELECT
    // ======================================

    serviceSelect.innerHTML = `
      <option value="">
        Select Service
      </option>
    `;

    // ======================================
    // ADD SERVICES
    // ======================================

    salonServices.forEach((service) => {
      const option = document.createElement("option");

      option.value = service.id;

      option.textContent = `${service.name} - ₹${service.price} (${service.duration} min)`;

      serviceSelect.appendChild(option);
    });

    // ======================================
    // SELECT SERVICE FROM URL
    // ======================================

    if (selectedServiceId) {
      const serviceExists = salonServices.some(
        (service) => String(service.id) === String(selectedServiceId),
      );

      if (serviceExists) {
        serviceSelect.value = selectedServiceId;
      }
    }
  } catch (error) {
    console.error("Error loading services:", error);

    serviceSelect.innerHTML = `
      <option value="">
        Unable to load services
      </option>
    `;
  }
};

// ==========================================
// CREATE APPOINTMENT
// ==========================================

const createAppointment = async () => {
  const serviceId = serviceSelect.value;

  const date = dateInput.value;

  const startTime = startTimeInput.value;

  // ======================================
  // VALIDATION
  // ======================================

  if (!serviceId) {
    showMessage("Please select a service.");

    return null;
  }

  if (!date) {
    showMessage("Please select a date.");

    return null;
  }

  if (!startTime) {
    showMessage("Please select a time.");

    return null;
  }

  // ======================================
  // CREATE APPOINTMENT
  // ======================================

  const response = await axios.post(
    `${API_BASE_URL}/appointment/add`,

    {
      saloonId: saloonId,

      serviceId: serviceId,

      date: date,

      startTime: startTime,
    },

    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  console.log("Appointment response:", response.data);

  return response.data.data;
};

// ==========================================
// CREATE CASHFREE ORDER
// ==========================================

const createPaymentOrder = async (appointmentId) => {
  try {
    // ==================================
    // GET USER
    // ==================================

    let user = null;

    try {
      user = JSON.parse(localStorage.getItem("user") || "null");
    } catch (error) {
      user = null;
    }

    // ==================================
    // CUSTOMER PHONE
    // ==================================

    const customerPhone = user?.phone || user?.mobile || user?.phoneNumber;

    if (!customerPhone) {
      throw new Error("Customer phone number is required for payment.");
    }

    // ==================================
    // CREATE CASHFREE ORDER
    // ==================================

    const response = await axios.post(
      `${API_BASE_URL}/payments/create_order`,

      {
        customerPhone: customerPhone,

        appointmentId: appointmentId,
      },

      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    console.log("Payment order response:", response.data);

    return response.data.data;
  } catch (error) {
    console.error("Payment order error:", error);

    if (error.response) {
      console.error("Payment response:", error.response.data);
    }

    throw error;
  }
};

// ==========================================
// OPEN CASHFREE CHECKOUT
// ==========================================

const openCashfreeCheckout = async (paymentSessionId) => {
  try {
    if (!paymentSessionId) {
      throw new Error("Payment session ID is missing.");
    }

    await cashfree.checkout({
      paymentSessionId: paymentSessionId,

      redirectTarget: "_self",
    });
  } catch (error) {
    console.error("Cashfree checkout error:", error);

    showMessage("Unable to open payment.", "error");
  }
};

// ==========================================
// BOOKING FORM SUBMIT
// ==========================================

bookingForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  try {
    // ==================================
    // DISABLE BUTTON
    // ==================================

    bookButton.disabled = true;

    bookButton.textContent = "Creating appointment...";

    showMessage("Creating appointment...", "success");

    // ==================================
    // CREATE APPOINTMENT
    // ==================================

    const appointment = await createAppointment();

    if (!appointment) {
      bookButton.disabled = false;

      bookButton.textContent = "Book Appointment";

      return;
    }

    console.log("Created appointment:", appointment);

    // ==================================
    // GET APPOINTMENT ID
    // ==================================

    const appointmentId = appointment.id;

    if (!appointmentId) {
      throw new Error("Appointment ID was not returned by server.");
    }

    // ==================================
    // CREATE PAYMENT
    // ==================================

    bookButton.textContent = "Preparing payment...";

    showMessage("Preparing payment...", "success");

    const payment = await createPaymentOrder(appointmentId);

    console.log("Payment:", payment);

    // ==================================
    // CASHFREE SESSION
    // ==================================

    const paymentSessionId = payment.payment_session_id;

    if (!paymentSessionId) {
      throw new Error("Payment session was not created.");
    }

    // ==================================
    // OPEN CASHFREE
    // ==================================

    bookButton.textContent = "Opening payment...";

    await openCashfreeCheckout(paymentSessionId);
  } catch (error) {
    console.error("Booking error:", error);

    let errorMessage = "Unable to book appointment.";

    if (error.response && error.response.data) {
      errorMessage = error.response.data.message || errorMessage;
    } else if (error.message) {
      errorMessage = error.message;
    }

    showMessage(errorMessage, "error");

    bookButton.disabled = false;

    bookButton.textContent = "Book Appointment";
  }
});

// ==========================================
// MINIMUM DATE = TODAY
// ==========================================

const today = new Date().toISOString().split("T")[0];

dateInput.min = today;

// ==========================================
// INITIAL LOAD
// ==========================================

if (!saloonId) {
  saloonName.textContent = "Salon ID is missing.";

  serviceSelect.innerHTML = `
    <option value="">
      Salon ID is missing
    </option>
  `;
} else {
  loadSaloon();

  loadServices();
}
