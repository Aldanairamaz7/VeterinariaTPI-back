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
      unique: true,
      references: {
        model: "users",
        key: "id",
      },
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  { timestamps: false, tableName: "veterinarians" }
);
