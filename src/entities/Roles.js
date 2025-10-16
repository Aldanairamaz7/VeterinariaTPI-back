import { DataTypes } from "sequelize";
import { sequelize } from "../db";

export const Roles = sequelize.define(
    "Roles",
    {
        idRole: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false
        },
        roleSumary: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            }
        }
    },
    {
        timestamps: false,
        tableName: 'roles'
    }
)