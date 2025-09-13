import { DataTypes } from "sequelize";
import { sequelize } from "../db.js";

export const Pet = sequelize.define(
    "Pet",
    {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  age: {
    type: DataTypes.INTEGER,
  },
  breed: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  dateBirth: {
    type: DataTypes.DATE,
    allowNull: false,
  },
});
