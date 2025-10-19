import { DataTypes } from "sequelize";
import { sequelize } from "../db.js";

export const Veterinarian = sequelize.define(
  "veterinarian",
  {
    enrollment: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    idSpeciality: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "speciality",
        key: "idSpeciality",
      },
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
  },
  { timestamps: false, tableName: "veterinarians" }
);
