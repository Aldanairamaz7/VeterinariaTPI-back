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
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "breed",
        key: "idBreed",
      },
    },
    typePet: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "typePet",
        key: "idType",
      },
    },
    imageURL: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  },
  {
    timestamps: false,
    tableName: "pets",
  }
);
