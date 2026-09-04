const API_BASE_URL = "http://localhost:4500";

const token = localStorage.getItem("token");


// =========================
// CHECK LOGIN
// =========================

if (!token) {
  window.location.href = "../login.html";
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

  Object.values(sections).forEach((section) => {
    section.classList.add("hidden");
  });

  sections[sectionName].classList.remove("hidden");


  navItems.forEach((item) => {
    item.classList.remove("active");
  });

  const activeItem = document.querySelector(
    `[data-section="${sectionName}"]`
  );

  activeItem.classList.add("active");


  pageTitle.textContent =
    sectionName.charAt(0).toUpperCase() +
    sectionName.slice(1);


  if (sectionName === "salons") {
    loadSalons();
  }

  if (sectionName === "services") {
    loadServices();
  }

};


// =========================
// AXIOS CONFIG
// =========================

const authConfig = {
  headers: {
    Authorization: `Bearer ${token}`,
  },
};


// =========================
// LOAD SALONS
// =========================

const loadSalons = async () => {

  const table = document.getElementById("salonsTable");

  try {

    table.innerHTML = `
      <tr>
        <td colspan="4">
          Loading salons...
        </td>
      </tr>
    `;


    const response = await axios.get(
      `${API_BASE_URL}/saloon/get/all`
    );


    const salons = response.data.data;

    document.getElementById("totalSalons").textContent =
      salons?.length || 0;


    if (!salons || salons.length === 0) {

      table.innerHTML = `
        <tr>
          <td colspan="4">
            No salons found.
          </td>
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
          <button class="action-button">
            Edit
          </button>

          <button class="action-button">
            Delete
          </button>
        </td>
      `;

      table.appendChild(row);

    });

  } catch (error) {

    console.error("Error loading salons:", error);

    table.innerHTML = `
      <tr>
        <td colspan="4">
          Unable to load salons.
        </td>
      </tr>
    `;

  }

};


// =========================
// LOAD SERVICES
// =========================

const loadServices = async () => {

  const table = document.getElementById("servicesTable");

  try {

    table.innerHTML = `
      <tr>
        <td colspan="5">
          Loading services...
        </td>
      </tr>
    `;


    const response = await axios.get(
      `${API_BASE_URL}/saloon-service/all`
    );


    const services = response.data.data;

    document.getElementById("totalServices").textContent =
      services?.length || 0;


    if (!services || services.length === 0) {

      table.innerHTML = `
        <tr>
          <td colspan="5">
            No services found.
          </td>
        </tr>
      `;

      return;
    }


    table.innerHTML = "";


    services.forEach((service) => {

      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${service.name || "-"}</td>

        <td>₹${service.price || 0}</td>

        <td>${service.duration || 0} min</td>

        <td>${service.saloonId || "-"}</td>

        <td>
          <button class="action-button">
            Edit
          </button>

          <button class="action-button">
            Delete
          </button>
        </td>
      `;

      table.appendChild(row);

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
// LOGOUT
// =========================

document
  .getElementById("logoutButton")
  .addEventListener("click", () => {

    localStorage.removeItem("token");

    localStorage.removeItem("user");

    window.location.href = "../login.html";

  });


// =========================
// INITIAL LOAD
// =========================

loadSalons();

loadServices();