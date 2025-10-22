import { DataTypes } from "sequelize";
import { sequelize } from "../db.js";
import { TypePet } from "./TypePets.js";

export const Breed = sequelize.define(
  "Breed",
  {
    idBreed: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nameBreed: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    idTypePet: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "typepet",
        key: "idtype",
      },
    },
  },

  {
    timestamps: false,
    tableName: "breed",
  }
);
