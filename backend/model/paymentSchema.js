const { DataTypes } = require("sequelize");
const sequelize = require("../utils/dbConfig");

const Payment = sequelize.define("Payment", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },

  orderId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },

  amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },

  status: {
    type: DataTypes.ENUM("pending", "success", "failure"),
    defaultValue: "pending",
  },

  paymentId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = Payment;
