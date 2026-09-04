const { DataTypes } = require("sequelize");
const sequelize = require("../utils/dbConfig");

const Saloon = sequelize.define(
  "saloon",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    latitude: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: false,
    },

    longitude: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: false,
    },

    address: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
     openingTime: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "saloon",
    timestamps: true,
  },
  { indexes: [{ field: ["latitude"] }, { field: ["longitude"] }] },
);

module.exports = Saloon;
