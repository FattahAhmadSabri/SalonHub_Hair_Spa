const saloonHeader = document.getElementById("saloonHeader");

const serviceList = document.getElementById("serviceList");

const gallery = document.getElementById("gallery");

const bookingLocation = document.getElementById("bookingLocation");

const bookNowButton = document.getElementById("bookNowButton");

const loginLink = document.getElementById("loginLink");

const logoutButton = document.getElementById("logoutButton");

const API_BASE_URL = "http://localhost:4500";

// ==========================================
// GET SALON ID
// ==========================================

const saloonId = new URLSearchParams(window.location.search).get("id");

let currentSalon = null;

// ==========================================
// LOAD SALON
// ==========================================

const loadSaloon = async () => {
  try {
    saloonHeader.innerHTML = `
            <p class="loading">
                Loading salon...
            </p>
        `;

    const response = await axios.get(`${API_BASE_URL}/saloon/get/${saloonId}`);

    console.log("Saloon response:", response.data);

    const saloon = response.data.data;

    if (!saloon) {
      saloonHeader.innerHTML = `
                <p class="error">
                    Salon not found.
                </p>
            `;

      return;
    }

    currentSalon = saloon;

    // ==================================
    // SALON HEADER
    // ==================================

    saloonHeader.innerHTML = `

            <h1>
                ${saloon.name || "Salon"}
            </h1>


            <div class="saloon-meta">

                <span class="rating">
                    ${saloon.rating || "—"}
                </span>


                ${
                  saloon.rating
                    ? `
                            <span class="stars">
                                ★★★★★
                            </span>
                        `
                    : ""
                }


                ${
                  saloon.reviewCount
                    ? `
                            <span class="review-count">
                                (${saloon.reviewCount})
                            </span>
                        `
                    : ""
                }


                <span class="location">
                    ${saloon.city || saloon.address || "Location unavailable"}
                </span>


                ${
                  saloon.address
                    ? `
                            <span>•</span>

                            <a
                                class="directions"
                                href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                                  saloon.address,
                                )}"
                                target="_blank"
                            >
                                Get directions
                            </a>
                        `
                    : ""
                }

            </div>


            <div class="header-actions">

                <button
                    class="action-button"
                    title="Share"
                    onclick="shareSalon()"
                >
                    ↗
                </button>


                <button
                    class="action-button"
                    title="Favorite"
                    onclick="favoriteSalon()"
                >
                    ♡
                </button>

            </div>

        `;

    // ==================================
    // LOCATION
    // ==================================

    bookingLocation.textContent =
      saloon.address || saloon.city || "Location unavailable";

    // ==================================
    // GALLERY
    // ==================================

    loadGallery(saloon);
  } catch (error) {
    console.error("Error loading salon:", error);

    if (error.response) {
      console.error("Status:", error.response.status);

      console.error("Response:", error.response.data);
    }

    saloonHeader.innerHTML = `
            <p class="error">
                Unable to load salon details.
            </p>
        `;
  }
};

// ==========================================
// LOAD GALLERY
// ==========================================

const loadGallery = (saloon) => {
  const mainGallery = gallery.querySelector(".gallery-main");

  const sideImages = gallery.querySelectorAll(".gallery-image");

  if (!saloon.image) {
    mainGallery.innerHTML = `
            <div class="no-image-gallery">
                No image available
            </div>
        `;

    // sideImages.forEach((element) => {
    //   element.innerHTML = `
    //                 <div class="no-image-gallery">
    //                     No image
    //                 </div>
    //             `;
    // });

    return;
  }

  // Main image

  mainGallery.innerHTML = `
        <img
            src="${saloon.image}"
            alt="${saloon.name || "Salon"}"
        >
    `;

  /*
       Your current backend has one image field.

       Therefore we use the same API image
       for the gallery previews.

       If later your backend returns:

       images: [image1, image2, image3]

       we can easily change this.
    */

  //   sideImages.forEach((element) => {
  //     element.innerHTML = `
  //                 <img
  //                     src="${saloon.image}"
  //                     alt="${saloon.name || "Salon"}"
  //                 >
  //             `;
  //   });
};

// ==========================================
// LOAD SERVICES
// ==========================================

const loadServices = async () => {
  try {
    serviceList.innerHTML = `
            <p class="loading">
                Loading services...
            </p>
        `;

    const response = await axios.get(`${API_BASE_URL}/saloon-service/all`);

    console.log("Services response:", response.data);

    const services = response.data.data;

    if (!Array.isArray(services) || services.length === 0) {
      serviceList.innerHTML = `
                <p class="no-data">
                    No services available.
                </p>
            `;

      return;
    }

    // ==================================
    // FILTER CURRENT SALON
    // ==================================

    const salonServices = services.filter(
      (service) => String(service.saloonId) === String(saloonId),
    );

    console.log("Salon services:", salonServices);

    if (salonServices.length === 0) {
      serviceList.innerHTML = `
                <p class="no-data">
                    No services available for this salon.
                </p>
            `;

      return;
    }

    serviceList.innerHTML = "";

    // ==================================
    // CREATE SERVICE CARDS
    // ==================================

    salonServices.forEach((service) => {
      const serviceCard = document.createElement("div");

      serviceCard.classList.add("service-card");

      serviceCard.innerHTML = `

                    <div class="service-info">

                        <h3>
                            ${service.name || ""}
                        </h3>


                        ${
                          service.description
                            ? `
                                    <p class="service-description">
                                        ${service.description}
                                    </p>
                                `
                            : ""
                        }


                        <p class="service-duration">
                            ${service.duration || 0}
                            minutes
                        </p>


                        <p class="service-price">
                            ₹${service.price || 0}
                        </p>

                    </div>


                    <div class="service-action">

                        <button
                            class="book-button"
                            onclick="bookService('${service.id}')"
                        >
                            Book
                        </button>

                    </div>

                `;

      serviceList.appendChild(serviceCard);
    });
  } catch (error) {
    console.error("Error loading services:", error);

    serviceList.innerHTML = `
            <p class="error">
                Unable to load services.
            </p>
        `;
  }
};

// ==========================================
// BOOK SERVICE
// ==========================================

const bookService = (serviceId) => {
  window.location.href = `booking.html?saloonId=${saloonId}&serviceId=${serviceId}`;
};

// ==========================================
// BOOK NOW
// ==========================================

if (bookNowButton) {
  bookNowButton.addEventListener("click", () => {
    const firstBookButton = document.querySelector(".book-button");

    if (firstBookButton) {
      firstBookButton.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    } else {
      alert("No services available.");
    }
  });
}

// ==========================================
// SHARE
// ==========================================

const shareSalon = async () => {
  const shareData = {
    title: currentSalon?.name || "Salon",

    text: currentSalon?.description || "Check out this salon",

    url: window.location.href,
  };

  try {
    if (navigator.share) {
      await navigator.share(shareData);
    } else {
      await navigator.clipboard.writeText(window.location.href);

      alert("Salon link copied.");
    }
  } catch (error) {
    console.log("Share cancelled.");
  }
};

// ==========================================
// FAVORITE
// ==========================================

const favoriteSalon = () => {
  const favorites = JSON.parse(localStorage.getItem("favoriteSalons") || "[]");

  if (!favorites.includes(saloonId)) {
    favorites.push(saloonId);

    localStorage.setItem("favoriteSalons", JSON.stringify(favorites));

    alert("Salon added to favorites.");
  } else {
    alert("Salon is already in favorites.");
  }
};

// ==========================================
// LOGIN STATE
// ==========================================

const updateLoginState = () => {
  const token = localStorage.getItem("token");

  if (token) {
    if (loginLink) {
      loginLink.style.display = "none";
    }

    if (logoutButton) {
      logoutButton.style.display = "block";
    }
  } else {
    if (loginLink) {
      loginLink.style.display = "block";
    }

    if (logoutButton) {
      logoutButton.style.display = "none";
    }
  }
};

// ==========================================
// LOGOUT
// ==========================================

const logout = () => {
  localStorage.removeItem("token");

  localStorage.removeItem("user");

  window.location.href = "../login.html";
};

// ==========================================
// START
// ==========================================

if (!saloonId) {
  saloonHeader.innerHTML = `
        <p class="error">
            Salon ID is missing.
        </p>
    `;

  serviceList.innerHTML = "";
} else {
  updateLoginState();

  loadSaloon();

  loadServices();
}
