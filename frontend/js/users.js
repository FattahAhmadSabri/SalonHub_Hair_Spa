const API_BASE_URL = "http://localhost:4500";

// =========================
// AUTH
// =========================

const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "../login.html";
}

// =========================
// ELEMENTS
// =========================

const userForm = document.getElementById("userForm");

const usersTable = document.getElementById("usersTable");

const userCount = document.getElementById("userCount");

const message = document.getElementById("message");

const saveButton = document.getElementById("saveButton");

const cancelButton = document.getElementById("cancelButton");

const formTitle = document.getElementById("formTitle");

const passwordGroup = document.getElementById("passwordGroup");

// =========================
// FORM FIELDS
// =========================

const userId = document.getElementById("userId");

const nameInput = document.getElementById("name");

const emailInput = document.getElementById("email");

const phoneInput = document.getElementById("phone");

const roleInput = document.getElementById("role");

const passwordInput = document.getElementById("password");

// =========================
// AXIOS CONFIG
// =========================

const config = {
  headers: {
    Authorization: `Bearer ${token}`,
  },
};

// =========================
// MESSAGE
// =========================

const showMessage = (text, type = "error") => {
  message.textContent = text;

  message.className = `message ${type}`;
};

// =========================
// GET ALL USERS
// =========================

const loadUsers = async () => {
  try {
    usersTable.innerHTML = `
      <tr>
        <td colspan="6">
          Loading users...
        </td>
      </tr>
    `;

    const response = await axios.get(`${API_BASE_URL}/user`, config);

    console.log("Users response:", response.data);

    const users = response.data.data;

    if (!users || users.length === 0) {
      usersTable.innerHTML = `
        <tr>
          <td colspan="6">
            No users found.
          </td>
        </tr>
      `;

      userCount.textContent = "0 users";

      return;
    }

    userCount.textContent = `${users.length} users`;

    usersTable.innerHTML = "";

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
          <span class="role">
            ${user.role || "user"}
          </span>
        </td>

        <td>
          ${user.saloonId || "-"}
        </td>

        <td>

          <button
            class="action-button"
            onclick='editUser(${JSON.stringify(user)})'
          >
            Edit
          </button>

        </td>
      `;

      usersTable.appendChild(row);
    });
  } catch (error) {
    console.error("Error loading users:", error);

    if (error.response) {
      console.error("Status:", error.response.status);

      console.error("Response:", error.response.data);
    }

    usersTable.innerHTML = `
      <tr>
        <td colspan="6">
          Unable to load users.
        </td>
      </tr>
    `;
  }
};

// =========================
// ADD USER
// =========================

const createUser = async () => {
  const userData = {
    name: nameInput.value.trim(),

    email: emailInput.value.trim(),

    phone: phoneInput.value.trim(),

    password: passwordInput.value,

    role: roleInput.value,
  };

  const response = await axios.post(`${API_BASE_URL}/user/create`, userData);

  return response.data;
};

// =========================
// UPDATE USER
// =========================

const updateUser = async () => {
  const userData = {
    id: userId.value,

    name: nameInput.value.trim(),

    email: emailInput.value.trim(),

    phone: phoneInput.value.trim(),

    role: roleInput.value,
  };

  const response = await axios.put(
    `${API_BASE_URL}/user/update`,
    userData,
    config,
  );

  return response.data;
};

// =========================
// FORM SUBMIT
// =========================

userForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  try {
    saveButton.disabled = true;

    saveButton.textContent = userId.value ? "Updating..." : "Adding...";

    showMessage(
      userId.value ? "Updating user..." : "Creating user...",
      "success",
    );

    if (userId.value) {
      await updateUser();

      showMessage("User updated successfully.", "success");
    } else {
      await createUser();

      showMessage("User created successfully.", "success");
    }

    resetForm();

    await loadUsers();
  } catch (error) {
    console.error("User operation error:", error);

    let errorMessage = "Operation failed.";

    if (error.response) {
      errorMessage =
        error.response.data?.message ||
        error.response.data?.error ||
        "Operation failed.";
    } else if (error.request) {
      errorMessage = "Unable to connect to server.";
    } else {
      errorMessage = error.message;
    }

    showMessage(errorMessage, "error");
  } finally {
    saveButton.disabled = false;

    saveButton.textContent = userId.value ? "Update User" : "Add User";
  }
});

// =========================
// EDIT USER
// =========================

const editUser = (user) => {
  userId.value = user.id || "";

  nameInput.value = user.name || "";

  emailInput.value = user.email || "";

  phoneInput.value = user.phone || "";

  roleInput.value = user.role || "user";

  passwordInput.value = "";

  formTitle.textContent = "Update User";

  saveButton.textContent = "Update User";

  cancelButton.style.display = "inline-block";

  // Password is not required during update

  passwordGroup.style.display = "none";

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

// Make available to onclick

window.editUser = editUser;

// =========================
// RESET FORM
// =========================

const resetForm = () => {
  userForm.reset();

  userId.value = "";

  formTitle.textContent = "Add User";

  saveButton.textContent = "Add User";

  cancelButton.style.display = "none";

  passwordGroup.style.display = "flex";
};

// =========================
// CANCEL
// =========================

cancelButton.addEventListener("click", () => {
  resetForm();

  message.textContent = "";
});

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

loadUsers();
