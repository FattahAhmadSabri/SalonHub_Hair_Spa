const cron = require("node-cron");

const { Appointment, User, Saloon, SaloonFacility } = require("../model/index");

const sendAppointmentReminder = require("../service/emailService");

const appointmentReminderCron = () => {
  // Run every 5 minutes
  cron.schedule("*/5 * * * *", async () => {
    try {
      console.log("Checking appointment reminders...");

      const appointments = await Appointment.findAll({
        where: {
          status: "confirmed",
          reminder1hSent: false,
        },
        include: [
          {
            model: User,
            attributes: ["id", "name", "email"],
          },
          {
            model: Saloon,
            attributes: ["id", "name", "address"],
          },
          {
            model: SaloonFacility,
            attributes: ["id", "name", "duration", "price"],
          },
        ],
      });

      const now = new Date();

      for (const appointment of appointments) {
        // Combine date + startTime
        const appointmentDateTime = new Date(
          `${appointment.date}T${appointment.startTime}`,
        );

        const difference = appointmentDateTime.getTime() - now.getTime();

        const minutesUntilAppointment = difference / (1000 * 60);

        // Send when appointment is between 55 and 65 minutes away
        if (minutesUntilAppointment >= 55 && minutesUntilAppointment <= 65) {
          const customer = appointment.user;
          const salon = appointment.saloon;
          const service = appointment.saloonfacility;

          if (!customer?.email) {
            console.log(`No email found for appointment ${appointment.id}`);
            continue;
          }

          try {
            await sendAppointmentReminder({
              email: customer.email,
              customerName: customer.name,
              salonName: salon?.name,
              salonAddress: salon?.address,
              serviceName: service?.name,
              date: appointment.date,
              startTime: appointment.startTime,
            });

            // Prevent duplicate emails
            await appointment.update({
              reminder1hSent: true,
            });

            console.log(
              `Reminder sent to ${customer.email} for appointment ${appointment.id}`,
            );
          } catch (emailError) {
            console.error(
              `Failed to send reminder for appointment ${appointment.id}:`,
              emailError,
            );
          }
        }
      }
    } catch (error) {
      console.error("Appointment reminder cron error:", error);
    }
  });
};

module.exports = appointmentReminderCron;
