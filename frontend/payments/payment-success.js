const API_BASE_URL = "http://localhost:4500";

const token = localStorage.getItem("token");

const params = new URLSearchParams(window.location.search);
const orderId = params.get("order_id");

const orderIdElement = document.getElementById("orderId");
const statusElement = document.getElementById("status");
const appointmentStatusElement = document.getElementById("appointmentStatus");

if (!orderId) {
  orderIdElement.textContent = "Not available";
  statusElement.textContent = "Invalid Payment Order";
  appointmentStatusElement.textContent = "Not Confirmed";
} else {
  orderIdElement.textContent = orderId;
}

const checkPaymentStatus = async () => {
  try {
    const response = await axios.get(
      `http://localhost:4500/payments/${orderId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    console.log("Payment status response:", response.data);

    const paymentStatus = response.data.data?.orderStatus;

    if (paymentStatus === "success") {
      statusElement.textContent = "Success";
      appointmentStatusElement.textContent = "Confirmed";

      return true;
    }

    if (paymentStatus === "pending") {
      statusElement.textContent = "Pending";
      appointmentStatusElement.textContent = "Pending";

      return false;
    }

    if (paymentStatus === "failure") {
      statusElement.textContent = "Failed";
      appointmentStatusElement.textContent = "Not Confirmed";

      return true;
    }

    statusElement.textContent = "Unknown";
    appointmentStatusElement.textContent = "Not Confirmed";

    return true;
  } catch (error) {
    console.error("Payment status error:", error);

    statusElement.textContent = "Unable To Verify Payment Status";
    appointmentStatusElement.textContent = "Unknown";

    return true;
  }
};

const startPaymentStatusCheck = async () => {
  if (!orderId) return;

  if (!token) {
    statusElement.textContent = "Login required";
    appointmentStatusElement.textContent = "Unknown";
    return;
  }

  // Check immediately
  let finished = await checkPaymentStatus();

  // If still pending, check again every 3 seconds
  let attempts = 0;
  const maxAttempts = 10;

  while (!finished && attempts < maxAttempts) {
    await new Promise((resolve) => setTimeout(resolve, 3000));

    finished = await checkPaymentStatus();

    attempts++;
  }
};

startPaymentStatusCheck();
