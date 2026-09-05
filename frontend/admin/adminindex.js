const API_BASE_URL = "http://localhost:4500";

// =========================
// TOKEN
// =========================

const token = localStorage.getItem("token");

// =========================
// CHECK LOGIN
// =========================

if (!token) {
  window.location.href = "../login.html";
}

const userData = localStorage.getItem("user");

if (!token || !userData) {
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  window.location.href = "../index.html";
} else {
  try {
    const user = JSON.parse(userData);

    if (user.role !== "admin") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      window.location.href = "../index.html";
    }
  } catch (error) {
    console.error("Invalid user data");

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "../index.html";
  }
}

// =========================
// ELEMENTS
// =========================

const navItems = document.querySelectorAll(".nav-item");

const pageTitle = document.getElementById("pageTitle");

const sections = {
  dashboard: document.getElementById("dashboardSection"),
  salons: document.getElementById("salonsSection"),
  services: document.getElementById("servicesSection"),
  appointments: document.getElementById("appointmentsSection"),
  users: document.getElementById("usersSection"),
};

// =========================
// AXIOS AUTH CONFIG
// =========================

const authConfig = {
  headers: {
    Authorization: `Bearer ${token}`,
  },
};

// =========================
// NAVIGATION
// =========================

navItems.forEach((item) => {
  item.addEventListener("click", (event) => {
    event.preventDefault();

    const sectionName = item.dataset.section;

    showSection(sectionName);
  });
});

const showSection = (sectionName) => {
  // Hide all sections

  Object.values(sections).forEach((section) => {
    section.classList.add("hidden");
  });

  // Show selected section

  sections[sectionName].classList.remove("hidden");

  // Remove active

  navItems.forEach((item) => {
    item.classList.remove("active");
  });

  // Add active

  const activeItem = document.querySelector(`[data-section="${sectionName}"]`);

  activeItem.classList.add("active");

  // Page title

  pageTitle.textContent =
    sectionName.charAt(0).toUpperCase() + sectionName.slice(1);

  // Load data

  if (sectionName === "salons") {
    loadSalons();
  }

  if (sectionName === "services") {
    loadServices();
  }

  if (sectionName === "appointments") {
    loadAppointments();
  }

  if (sectionName === "users") {
    loadUsers();
  }
};

// =========================
// LOAD SALONS
// =========================

const loadSalons = async () => {
  const table = document.getElementById("salonsTable");

  try {
    table.innerHTML = `
      <tr>
        <td colspan="4">Loading salons...</td>
      </tr>
    `;

    const response = await axios.get(`${API_BASE_URL}/saloon/all`);

    const salons = response.data.data;

    document.getElementById("totalSalons").textContent = salons?.length || 0;

    if (!salons || salons.length === 0) {
      table.innerHTML = `
        <tr>
          <td colspan="4">No salons found.</td>
        </tr>
      `;
      return;
    }

    table.innerHTML = "";

    salons.forEach((salon) => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${salon.name || "-"}</td>

        <td>${salon.city || "-"}</td>

        <td>${salon.address || "-"}</td>

        <td>
          <button
            class="action-button edit-button"
            data-id="${salon.id}"
          >
            Edit
          </button>

          <button
            class="action-button service-button"
            data-id="${salon.id}"
          >
            + Service
          </button>

          <button
            class="action-button delete-button"
            data-id="${salon.id}"
          >
            Delete
          </button>
        </td>
      `;

      table.appendChild(row);
    });

    // + Service button
    document.querySelectorAll(".service-button").forEach((button) => {
      button.addEventListener("click", () => {
        const saloonId = button.dataset.id;

        openServiceModal(saloonId);
      });
    });
  } catch (error) {
    console.error("Error loading salons:", error);

    table.innerHTML = `
      <tr>
        <td colspan="4">Unable to load salons.</td>
      </tr>
    `;
  }
};

const openServiceModal = (saloonId) => {
  document.getElementById("serviceForm").reset();

  document.getElementById("serviceSaloonId").value = saloonId;

  document.getElementById("serviceMessage").textContent = "";

  document.getElementById("serviceModal").classList.remove("hidden");
};

const closeServiceModal = () => {
  document.getElementById("serviceModal").classList.add("hidden");

  document.getElementById("serviceForm").reset();
};

document
  .getElementById("closeServiceModal")
  .addEventListener("click", closeServiceModal);

document
  .getElementById("cancelServiceButton")
  .addEventListener("click", closeServiceModal);

document
  .getElementById("serviceForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const saloonId = document.getElementById("serviceSaloonId").value;

    if (!saloonId) {
      alert("Salon ID is missing");
      return;
    }

    await addService(saloonId);
  });

const addService = async (saloonId) => {
  const token = localStorage.getItem("token");

  const serviceData = {
    saloonId: saloonId,
    name: document.getElementById("serviceName").value.trim(),
    price: Number(document.getElementById("servicePrice").value),
    duration: Number(document.getElementById("serviceDuration").value),
    description: document.getElementById("serviceDescription").value.trim(),
  };

  console.log("ADD SERVICE DATA:", serviceData);
  console.log("TOKEN:", token);

  try {
    const response = await axios.post(
      `${API_BASE_URL}/saloon-service/add`,
      serviceData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    console.log("ADD SERVICE RESPONSE:", response.data);

    if (response.data.success) {
      alert("Service added successfully");

      document.getElementById("serviceForm").reset();
      document.getElementById("serviceModal").classList.add("hidden");

      await loadServices();
    }
  } catch (error) {
    console.error("ADD SERVICE ERROR:", error);

    console.log("STATUS:", error.response?.status);
    console.log("RESPONSE:", error.response?.data);

    alert(error.response?.data?.message || "Unable to add service");
  }
};

// ================= ADD SALON =================

const addSalonButton = document.getElementById("addSalonButton");
const salonModal = document.getElementById("salonModal");
const closeSalonModal = document.getElementById("closeSalonModal");
const cancelSalonButton = document.getElementById("cancelSalonButton");
const salonForm = document.getElementById("salonForm");
const salonMessage = document.getElementById("salonMessage");
const saveSalonButton = document.getElementById("saveSalonButton");

// OPEN MODAL

addSalonButton.addEventListener("click", () => {
  salonForm.reset();
  salonMessage.textContent = "";

  salonModal.classList.remove("hidden");
});

// CLOSE MODAL

closeSalonModal.addEventListener("click", () => {
  salonModal.classList.add("hidden");
});

cancelSalonButton.addEventListener("click", () => {
  salonModal.classList.add("hidden");
});

// CLOSE WHEN CLICKING OUTSIDE

salonModal.addEventListener("click", (event) => {
  if (event.target === salonModal) {
    salonModal.classList.add("hidden");
  }
});

// SUBMIT FORM

salonForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "../index.html";
    return;
  }

  try {
    saveSalonButton.disabled = true;
    saveSalonButton.textContent = "Adding...";

    salonMessage.textContent = "";

    const formData = new FormData(salonForm);

    const response = await axios.post(
      "http://localhost:4500/saloon/add",
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      },
    );

    if (response.data.success) {
      salonMessage.textContent = "Salon added successfully.";

      salonForm.reset();

      // Close after successful creation
      setTimeout(() => {
        salonModal.classList.add("hidden");
        salonMessage.textContent = "";
      }, 800);

      // Reload salon list
      loadSalons();
    } else {
      salonMessage.textContent =
        response.data.message || "Failed to add salon.";
    }
  } catch (error) {
    console.error("Add salon error:", error);

    salonMessage.textContent =
      error.response?.data?.message ||
      "Something went wrong while adding salon.";
  } finally {
    saveSalonButton.disabled = false;
    saveSalonButton.textContent = "Add Salon";
  }
});

// =========================
// LOAD SERVICES
// =========================

const loadServices = async () => {
  const table = document.getElementById("servicesTable");

  try {
    table.innerHTML = `
      <tr>
        <td colspan="5">Loading services...</td>
      </tr>
    `;

    console.log("Calling services API...");

    const response = await axios.get(`${API_BASE_URL}/saloon-service/all`);

    console.log("Services API response:", response.data);

    const services = response.data.data || [];

    document.getElementById("totalServices").textContent = services.length;

    if (services.length === 0) {
      table.innerHTML = `
        <tr>
          <td colspan="5">No services found.</td>
        </tr>
      `;
      return;
    }

    table.innerHTML = "";

    services.forEach((service) => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>
          ${service.name || "-"}
        </td>

        <td>
          ₹${service.price || 0}
        </td>

        <td>
          ${service.duration || 0} min
        </td>

        <td>
          ${service.saloon?.name || "-"}
        </td>

        <td>
          <button
            class="action-button edit-service-button"
            data-id="${service.id}"
          >
            Edit
          </button>

          <button
            class="action-button delete-service-button"
            data-id="${service.id}"
          >
            Delete
          </button>
        </td>
      `;

      table.appendChild(row);
    });

    // Edit buttons
    document.querySelectorAll(".edit-service-button").forEach((button) => {
      button.addEventListener("click", () => {
        const serviceId = button.dataset.id;

        const service = services.find((item) => item.id === serviceId);

        if (service) {
          openEditServiceModal(service);
        }
      });
    });

    // Delete buttons
    document.querySelectorAll(".delete-service-button").forEach((button) => {
      button.addEventListener("click", async () => {
        const serviceId = button.dataset.id;

        await deleteService(serviceId);
      });
    });
  } catch (error) {
    console.error("Error loading services:", error);

    table.innerHTML = `
      <tr>
        <td colspan="5">
          Unable to load services.
        </td>
      </tr>
    `;
  }
};

// =========================
// LOAD APPOINTMENTS
// =========================

const loadAppointments = async () => {
  const table = document.getElementById("appointmentsTable");

  try {
    table.innerHTML = `
      <tr>
        <td colspan="7">
          Loading appointments...
        </td>
      </tr>
    `;

    const response = await axios.get(`${API_BASE_URL}/appointment`, authConfig);

    console.log("Appointments response:", response.data);

    const appointments = response.data.data;

    document.getElementById("totalAppointments").textContent =
      appointments?.length || 0;

    if (!appointments || appointments.length === 0) {
      table.innerHTML = `
        <tr>
          <td colspan="7">
            No appointments found.
          </td>
        </tr>
      `;

      return;
    }

    table.innerHTML = "";

    appointments.forEach((appointment) => {
      const row = document.createElement("tr");

      const salonName = appointment.saloon?.name || "-";

      const serviceName = appointment.saloonfacility?.name || "-";

      const customerName = appointment.user?.name || "-";

      row.innerHTML = `
        <td>${appointment.date || "-"}</td>

        <td>${appointment.startTime || "-"}</td>

        <td>
          <span class="status ${appointment.status}">
            ${appointment.status || "-"}
          </span>
        </td>

        <td>${salonName}</td>

        <td>${serviceName}</td>

        <td>${customerName}</td>

        <td>
          <button
            class="action-button"
            onclick="editAppointment('${appointment.id}')"
          >
            Edit
          </button>

          <button
            class="action-button delete-button"
            onclick="deleteAppointment('${appointment.id}')"
          >
            Delete
          </button>
        </td>
      `;

      table.appendChild(row);
    });
  } catch (error) {
    console.error("Error loading appointments:", error);

    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Response:", error.response.data);
    }

    table.innerHTML = `
      <tr>
        <td colspan="7">
          Unable to load appointments.
        </td>
      </tr>
    `;
  }
};

window.deleteAppointment = async (appointmentId) => {
  const confirmDelete = confirm(
    "Are you sure you want to delete this appointment?",
  );

  if (!confirmDelete) {
    return;
  }

  try {
    await axios.delete(
      `${API_BASE_URL}/appointment/${appointmentId}`,
      authConfig,
    );

    alert("Appointment deleted successfully.");

    await loadAppointments();
  } catch (error) {
    console.error("Delete appointment error:", error);

    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Response:", error.response.data);
    }

    alert(error.response?.data?.message || "Unable to delete appointment.");
  }
};

// ======================================================
// USERS
// ======================================================

// =========================
// LOAD USERS
// =========================

const loadUsers = async () => {
  const table = document.getElementById("usersTable");

  try {
    table.innerHTML = `
      <tr>
        <td colspan="6">
          Loading users...
        </td>
      </tr>
    `;

    console.log("Calling users API...");

    const response = await axios.get(`${API_BASE_URL}/user`, authConfig);

    console.log("Users API response:", response.data);

    const users = response.data.data;

    document.getElementById("totalUsers").textContent = users?.length || 0;

    if (!users || users.length === 0) {
      table.innerHTML = `
        <tr>
          <td colspan="6">
            No users found.
          </td>
        </tr>
      `;

      return;
    }

    table.innerHTML = "";

    users.forEach((user) => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>
          ${user.name || "-"}
        </td>

        <td>
          ${user.email || "-"}
        </td>

        <td>
          ${user.phone || "-"}
        </td>

        <td>
          ${user.role || "-"}
        </td>

        <td>
          ${user.saloonId || "-"}
        </td>

        <td>

          <button
            class="action-button"
            onclick="editUser('${user.id}')"
          >
            Edit
          </button>


          <button
            class="action-button delete-button"
            onclick="deleteUser('${user.id}')"
          >
            Delete
          </button>

        </td>
      `;

      table.appendChild(row);
    });
  } catch (error) {
    console.error("Error loading users:", error);

    if (error.response) {
      console.error("Status:", error.response.status);

      console.error("Response:", error.response.data);
    }

    table.innerHTML = `
      <tr>
        <td colspan="6">
          Unable to load users.
        </td>
      </tr>
    `;
  }
};

// =========================
// ADD USER BUTTON
// =========================

document.getElementById("addUserButton").addEventListener("click", () => {
  document.getElementById("userFormCard").classList.remove("hidden");

  document.getElementById("userFormTitle").textContent = "Add User";

  document.getElementById("saveUserButton").textContent = "Add User";

  document.getElementById("userForm").reset();

  document.getElementById("userId").value = "";

  document.getElementById("userMessage").textContent = "";

  document.getElementById("usersSection").scrollIntoView({
    behavior: "smooth",
  });
});

// =========================
// CANCEL USER FORM
// =========================

document.getElementById("cancelUserButton").addEventListener("click", () => {
  document.getElementById("userFormCard").classList.add("hidden");

  document.getElementById("userForm").reset();

  document.getElementById("userId").value = "";

  document.getElementById("userFormTitle").textContent = "Add User";

  document.getElementById("saveUserButton").textContent = "Add User";

  document.getElementById("userMessage").textContent = "";
});

// =========================
// ADD / UPDATE USER
// =========================

document
  .getElementById("userForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const userId = document.getElementById("userId").value;

    const name = document.getElementById("userName").value.trim();

    const email = document.getElementById("userEmail").value.trim();

    const phone = document.getElementById("userPhone").value.trim();

    const role = document.getElementById("userRole").value;

    const password = document.getElementById("userPassword").value;

    const message = document.getElementById("userMessage");

    const saveButton = document.getElementById("saveUserButton");

    try {
      saveButton.disabled = true;

      saveButton.textContent = "Saving...";

      const userData = {
        name,
        email,
        phone,
        role,
      };

      // =========================
      // CREATE USER
      // =========================

      if (!userId) {
        if (!password) {
          message.textContent = "Password is required.";

          saveButton.disabled = false;

          saveButton.textContent = "Add User";

          return;
        }

        userData.password = password;

        console.log("Creating user:", userData);

        const response = await axios.post(
          `${API_BASE_URL}/user/create`,
          userData,
        );

        console.log("Create user response:", response.data);

        message.textContent = "User created successfully.";
      }

      // =========================
      // UPDATE USER
      // =========================
      else {
        userData.id = userId;

        // Only send password if admin entered one

        if (password) {
          userData.password = password;
        }

        console.log("Updating user:", userData);

        const response = await axios.put(
          `${API_BASE_URL}/user/update`,
          userData,
          authConfig,
        );

        console.log("Update user response:", response.data);

        message.textContent = "User updated successfully.";
      }

      // Reload users

      await loadUsers();

      // Reset form

      document.getElementById("userForm").reset();

      document.getElementById("userId").value = "";

      // Hide form

      document.getElementById("userFormCard").classList.add("hidden");
    } catch (error) {
      console.error("User operation error:", error);

      if (error.response) {
        console.error("Status:", error.response.status);

        console.error("Response:", error.response.data);
      }

      message.textContent =
        error.response?.data?.message || "Unable to save user.";
    } finally {
      saveButton.disabled = false;

      saveButton.textContent = userId ? "Update User" : "Add User";
    }
  });

// =========================
// EDIT USER
// =========================

const editUser = async (userId) => {
  try {
    console.log("Editing user:", userId);

    const response = await axios.get(`${API_BASE_URL}/user`, authConfig);

    const users = response.data.data;

    const user = users.find((item) => item.id === userId);

    if (!user) {
      alert("User not found.");

      return;
    }

    // Open form

    document.getElementById("userFormCard").classList.remove("hidden");

    // Change title

    document.getElementById("userFormTitle").textContent = "Edit User";

    // Change button

    document.getElementById("saveUserButton").textContent = "Update User";

    // Fill data

    document.getElementById("userId").value = user.id;

    document.getElementById("userName").value = user.name || "";

    document.getElementById("userEmail").value = user.email || "";

    document.getElementById("userPhone").value = user.phone || "";

    document.getElementById("userRole").value = user.role || "user";

    document.getElementById("userPassword").value = "";

    document.getElementById("userMessage").textContent = "";

    // Scroll to form

    document.getElementById("userFormCard").scrollIntoView({
      behavior: "smooth",
    });
  } catch (error) {
    console.error("Error editing user:", error);

    alert(error.response?.data?.message || "Unable to load user.");
  }
};

// =========================
// DELETE USER
// =========================

const deleteUser = async (userId) => {
  const confirmed = confirm("Are you sure you want to delete this user?");

  if (!confirmed) {
    return;
  }

  try {
    console.log("Deleting user:", userId);

    const response = await axios.delete(`${API_BASE_URL}/user/update`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },

      data: {
        id: userId,
      },
    });

    console.log("Delete user response:", response.data);

    alert("User deleted successfully.");

    // Reload users

    await loadUsers();
  } catch (error) {
    console.error("Delete user error:", error);

    if (error.response) {
      console.error("Status:", error.response.status);

      console.error("Response:", error.response.data);
    }

    alert(error.response?.data?.message || "Unable to delete user.");
  }
};

// =========================
// LOGOUT
// =========================

document.getElementById("logoutButton").addEventListener("click", () => {
  localStorage.removeItem("token");

  localStorage.removeItem("user");

  window.location.href = "../login.html";
});

// =========================
// INITIAL LOAD
// =========================

loadSalons();

loadServices();

loadUsers();
