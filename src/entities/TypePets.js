import { DataTypes } from "sequelize";
import { sequelize } from "../db.js";

export const TypePet = sequelize.define(
    "TypePet",
    {
        idType: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        typePetName: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        }
    },
    {
        timestamps: false,
        tableName: "typePet"
    }
)