const API_BASE_URL = "http://localhost:4500";

const loginForm = document.getElementById("loginForm");
const loginButton = document.getElementById("loginButton");
const message = document.getElementById("message");

const showMessage = (text, type = "error") => {
  message.textContent = text;
  message.className = `message ${type}`;
};

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  if (!email || !password) {
    showMessage("Please enter email and password.", "error");
    return;
  }

  try {
    loginButton.disabled = true;
    loginButton.textContent = "Logging in...";

    const response = await axios.post(`${API_BASE_URL}/user/login`, {
      email,
      password,
    });

    console.log("Login response:", response.data);

    const user = response.data.data;
    const token = response.data.token;

    // Save JWT token
    if (token) {
      localStorage.setItem("token", token);
    }

    // Save user information
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    }

    console.log("Token saved:", localStorage.getItem("token"));
    console.log("User saved:", localStorage.getItem("user"));

    showMessage(
      response.data.message || "Login successful.",
      "success"
    );

    setTimeout(() => {
      window.location.href = "./index.html";
    }, 1000);

  } catch (error) {
    console.error("Login error:", error);

    let errorMessage = "Login failed.";

    if (error.response) {
      errorMessage =
        error.response.data?.message ||
        error.response.data?.error ||
        "Invalid email or password.";
    } else if (error.request) {
      errorMessage = "Unable to connect to server.";
    } else {
      errorMessage = error.message;
    }

    showMessage(errorMessage, "error");

  } finally {
    loginButton.disabled = false;
    loginButton.textContent = "Login";
  }
});