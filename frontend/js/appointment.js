const API_BASE_URL = "http://localhost:4500";

const appointmentList = document.getElementById("appointmentList");
const message = document.getElementById("message");

// =========================
// GET TOKEN
// =========================

const token = localStorage.getItem("token");

// =========================
// CHECK LOGIN
// =========================

if (!token) {
  window.location.href = "../login.html";
}

// =========================
// GET LOGGED-IN USER
// =========================

let user = null;

try {
  user = JSON.parse(localStorage.getItem("user"));
} catch (error) {
  console.error("Unable to read user:", error);
}

if (!user || !user.id) {
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  window.location.href = "../login.html";
}

const userId = user.id;

console.log("Logged in user ID:", userId);

// =========================
// AXIOS CONFIG
// =========================

const authConfig = {
  headers: {
    Authorization: `Bearer ${token}`,
  },
};

// =========================
// LOAD USER APPOINTMENTS
// =========================

const loadAppointments = async () => {
  try {
    appointmentList.innerHTML = `
      <tr>
        <td colspan="6" class="loading">
          Loading appointments...
        </td>
      </tr>
    `;

    const response = await axios.get(
      `${API_BASE_URL}/appointment/user`,
      authConfig,
    );

    console.log("Appointment response:", response.data);

    const appointments = response.data.data;

    if (!appointments || appointments.length === 0) {
      appointmentList.innerHTML = `
        <tr>
          <td colspan="6" class="empty">
            No appointments found.
          </td>
        </tr>
      `;

      return;
    }

    appointmentList.innerHTML = "";

    appointments.forEach((appointment) => {
      const row = document.createElement("tr");

      // Salon name
      const salonName = appointment.saloon?.name || "-";

      // Service name
      const serviceName = appointment.saloonfacility?.name || "-";

      // Format date
      const formattedDate = formatDate(appointment.date);

      // Format time
      const formattedTime = formatTime(appointment.startTime);

      row.innerHTML = `
        <td>${salonName}</td>

        <td>${serviceName}</td>

        <td>${formattedDate}</td>

        <td>${formattedTime}</td>

        <td>
          <span class="status ${appointment.status}">
            ${appointment.status || "-"}
          </span>
        </td>

        <td>
          ${
            appointment.status === "cancelled"
              ? `<span class="cancelled-text">Cancelled</span>`
              : `
                <button
                  class="cancel-button"
                  onclick="cancelAppointment('${appointment.id}')"
                >
                  Cancel
                </button>
              `
          }
        </td>
      `;

      appointmentList.appendChild(row);
    });
  } catch (error) {
    console.error("Error loading appointments:", error);

    if (error.response) {
      console.error("Status:", error.response.status);

      console.error("Response:", error.response.data);
    }

    appointmentList.innerHTML = `
      <tr>
        <td colspan="6" class="error">
          Unable to load appointments.
        </td>
      </tr>
    `;
  }
};

// =========================
// FORMAT DATE
// =========================

const formatDate = (date) => {
  if (!date) {
    return "-";
  }

  const dateObject = new Date(date);

  return dateObject.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

// =========================
// FORMAT TIME
// =========================

const formatTime = (time) => {
  if (!time) {
    return "-";
  }

  const [hours, minutes] = time.split(":");

  const date = new Date();

  date.setHours(Number(hours), Number(minutes));

  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

// =========================
// CANCEL APPOINTMENT
// =========================

window.cancelAppointment = async (appointmentId) => {
  const confirmCancel = confirm(
    "Are you sure you want to cancel this appointment?",
  );

  if (!confirmCancel) {
    return;
  }

  try {
    await axios.delete(
      `${API_BASE_URL}/appointment/${appointmentId}`,
      authConfig,
    );

    alert("Appointment cancelled successfully.");

    await loadAppointments();
  } catch (error) {
    console.error("Cancel appointment error:", error);

    if (error.response) {
      console.error("Status:", error.response.status);

      console.error("Response:", error.response.data);
    }

    alert(error.response?.data?.message || "Unable to cancel appointment.");
  }
};

// =========================
// LOAD APPOINTMENTS
// =========================

loadAppointments();
