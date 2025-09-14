import { DataTypes } from "sequelize";
import { sequelize } from "../db.js";

export const Veterinarian = sequelize.define(
  "veterinarian",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    numberPhone: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    specialty: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { timestamps: false,
    tableName: 'veterinarians'
  }
);
