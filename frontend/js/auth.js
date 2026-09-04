const API_BASE_URL = "http://localhost:4500";

// ==========================================
// REGISTER
// ==========================================

const registerForm = document.getElementById("registerForm");

const message = document.getElementById("message");

const registerButton = document.getElementById("registerButton");

registerForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const name = document.getElementById("name").value.trim();

  const email = document.getElementById("email").value.trim();

  const phone = document.getElementById("phone").value.trim();

  const password = document.getElementById("password").value;

  const confirmPassword = document.getElementById("confirmPassword").value;

  // ==========================================
  // VALIDATION
  // ==========================================

  if (!name || !email || !phone || !password || !confirmPassword) {
    showMessage("Please fill all fields.", "error");

    return;
  }

  if (password !== confirmPassword) {
    showMessage("Passwords do not match.", "error");

    return;
  }

  // ==========================================
  // DISABLE BUTTON
  // ==========================================

  registerButton.disabled = true;

  registerButton.textContent = "Creating account...";

  try {
    // ========================================
    // API REQUEST
    // ========================================

    const response = await axios.post(`${API_BASE_URL}/user/create`, {
      name,
      email,
      phone,
      password,
    });

    console.log("Register response:", response.data);

    // ========================================
    // SUCCESS
    // ========================================

    showMessage(response.data.message || "Registration successful.", "success");

    // Clear form

    registerForm.reset();

    // Redirect to login

    setTimeout(() => {
      window.location.href = "./login.html";
    }, 1500);
  } catch (error) {
    console.error("Registration error:", error);

    // ========================================
    // ERROR RESPONSE
    // ========================================

    let errorMessage = "Registration failed.";

    if (error.response) {
      errorMessage =
        error.response.data?.message ||
        error.response.data?.error ||
        "Registration failed.";

      console.error("Status:", error.response.status);

      console.error("Response:", error.response.data);
    } else if (error.request) {
      errorMessage = "Unable to connect to server.";
    } else {
      errorMessage = error.message;
    }

    showMessage(errorMessage, "error");
  } finally {
    registerButton.disabled = false;

    registerButton.textContent = "Create account";
  }
});

// ==========================================
// MESSAGE
// ==========================================

const showMessage = (text, type) => {
  message.textContent = text;

  message.className = `message ${type}`;
};
