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
  enrollment:{
    type: DataTypes.INTEGER,
    allowNull: false,
    references:{
      model: 'veterinarians',
      key: 'enrollment'
    },
  },
  petId:{
    type: DataTypes.INTEGER,
    allowNull: false,
    references:{
      model: 'pets',
      key:'id',
    },
  },
  userId:{
    type: DataTypes.INTEGER,
    allowNull: false,
    references:{
      model: 'users',
      key:'id',
    },
  },
  
},
{
    timestamps: false,
    tableName: 'shifts'
  },
);
