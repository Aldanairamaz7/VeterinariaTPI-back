import { DataTypes } from "sequelize";
import { sequelize } from "../db.js";

export const Roles = sequelize.define(
  "Roles",
  {
    idRole: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    roleSumary: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    timestamps: false,
    tableName: "roles",
  }
);
