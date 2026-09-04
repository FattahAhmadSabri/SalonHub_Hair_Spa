const { DataTypes } = require("sequelize");
const sequelize = require("../utils/dbConfig");

const Review = sequelize.define(
  "review",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },

    review: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    ratings: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5,
      },
    },
  },
  {
    tableName: "comments",
    timestamps: true,
  },
);

module.exports = Review;
