const Saloon = require("./saloonSchema");

const User = require("./userSchema");
const Review = require("./ReviewRatingsSchema");
const Appointment = require("./appointmentSchema");
const SaloonFacility = require("./saloonServiceSchema")
const Payment = require("./paymentSchema")

// Saloon → Services
Saloon.hasMany(SaloonFacility, {
  foreignKey: "saloonId",
});

SaloonFacility.belongsTo(Saloon, {
  foreignKey: "saloonId",
});

// Saloon → Staff
Saloon.hasMany(User, {
  foreignKey: "saloonId",
});

User.belongsTo(Saloon, {
  foreignKey: "saloonId",
});

// User → Reviews
User.hasMany(Review, {
  foreignKey: "userId",
});

Review.belongsTo(User, {
  foreignKey: "userId",
});

// Saloon → Reviews
Saloon.hasMany(Review, {
  foreignKey: "saloonId",
});

Review.belongsTo(Saloon, {
  foreignKey: "saloonId",
});

// User → Appointments
User.hasMany(Appointment, {
  foreignKey: "userId",
});

Appointment.belongsTo(User, {
  foreignKey: "userId",
});

// Saloon → Appointments
Saloon.hasMany(Appointment, {
  foreignKey: "saloonId",
});

Appointment.belongsTo(Saloon, {
  foreignKey: "saloonId",
});


SaloonFacility.hasMany(Appointment, {
  foreignKey: "serviceId",
});

Appointment.belongsTo(SaloonFacility, {
  foreignKey: "serviceId",
});

User.hasMany(Payment, {
  foreignKey : "userId"
});
Payment.belongsTo(User, {
  foreignKey : "userId"
});

module.exports = {
  User,
  Saloon,
  SaloonFacility,
  Review,
  Appointment,
  Payment
};