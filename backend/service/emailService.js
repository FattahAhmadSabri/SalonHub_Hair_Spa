const SibApiV3Sdk = require("sib-api-v3-sdk");

const client = SibApiV3Sdk.ApiClient.instance;

const apiKey = client.authentications["api-key"];
apiKey.apiKey = process.env.BREVO_API_KEY;

const tranEmailApi = new SibApiV3Sdk.TransactionalEmailsApi();

const sendAppointmentReminder = async ({
  email,
  customerName,
  salonName,
  salonAddress,
  serviceName,
  date,
  startTime,
}) => {
  const sendSmtpEmail = {
    sender: {
      name: "Fresha Salon",
      email: process.env.BREVO_SENDER,
    },

    to: [
      {
        email,
        name: customerName,
      },
    ],

    subject: "Your salon appointment is in 1 hour",

    htmlContent: `
      <h2>Appointment Reminder</h2>

      <p>Hello ${customerName},</p>

      <p>
        This is a reminder that your salon appointment
        is starting in approximately <strong>1 hour</strong>.
      </p>

      <p>
        <strong>Salon:</strong> ${salonName}<br>
        <strong>Service:</strong> ${serviceName}<br>
        <strong>Date:</strong> ${date}<br>
        <strong>Time:</strong> ${startTime}<br>
        <strong>Address:</strong> ${salonAddress}
      </p>

      <p>
        Please arrive a few minutes early.
      </p>

      <p>Thank you for choosing Fresha Salon.</p>
    `,
  };

  return await tranEmailApi.sendTransacEmail(sendSmtpEmail);
};

module.exports = sendAppointmentReminder;
