const { DataTypes } = require("sequelize");
const sequelize = require("../utils/dbConfig");

const SaloonFacility = sequelize.define("saloonfacility", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },

  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  price: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  duration: {
    type: DataTypes.INTEGER, 
    allowNull: false,
  },

  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
});

module.exports = SaloonFacility;