import { DataTypes } from "sequelize";
import { sequelize } from "../db.js";

export const Speciality = sequelize.define(
    "Speciality",
    {
        idSpeciality: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        specialityName: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        }
    },
    {
        timestamps: false,
        tableName: "speciality"
    }
)