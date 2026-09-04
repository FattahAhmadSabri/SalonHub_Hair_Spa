const saloonList = document.getElementById("saloonList");

const API_URL = "http://localhost:4500/saloon/all";

const loadSalons = async () => {
  try {
    saloonList.innerHTML = "<p>Loading salons...</p>";

    const response = await axios.get(API_URL);

    console.log("Salon API response:", response.data);

    const salons = response.data.data;

    if (!salons || salons.length === 0) {
      saloonList.innerHTML = `
        <p>No salons available.</p>
      `;

      return;
    }

    saloonList.innerHTML = "";

    salons.forEach((salon) => {
      const salonCard = document.createElement("div");

      salonCard.classList.add("card");

      salonCard.innerHTML = `
        <img
          src="${salon.image || "https://via.placeholder.com/300x180"}"
          alt="${salon.name}"
        />

        <h3>${salon.name}</h3>

        <p>
          ${salon.description || "No description available"}
        </p>

        <p>
          📍 ${salon.city || salon.address || "Location not available"}
        </p>

        <a
          href="saloonWork/saloon.html?id=${salon.id}"
          class="btn"
        >
          View Salon
        </a>
      `;

      saloonList.appendChild(salonCard);
    });
  } catch (error) {
    console.error("Error loading salons:", error);

    saloonList.innerHTML = `
      <p>
        Unable to load salons.
      </p>
    `;
  }
};

loadSalons();
