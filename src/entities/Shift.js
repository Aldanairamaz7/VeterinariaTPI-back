import { DataTypes } from "sequelize";
import { sequelize } from "../db.js";

export const Shift = sequelize.define(
  "Shift",
   {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  dateTime: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  typeConsult: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
});
