const { DataTypes } = require("sequelize");
const sequelize = require("../utils/dbConfig");

const Appointment = sequelize.define(
  "appointment",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },

    startTime: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    reminder1hSent: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    status: {
      type: DataTypes.ENUM("pending", "confirmed", "completed", "cancelled"),
      defaultValue: "pending",
      allowNull: false,
    },
  },
  {
    tableName: "appointments",
    timestamps: true,
  },
);

module.exports = Appointment;
