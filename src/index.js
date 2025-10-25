import express from "express";
import { PORT } from "./config.js";
import { sequelize } from "./db.js";

import "./entities/User.js";
import "./entities/Pet.js";
import "./entities/Shift.js";
import "./entities/Veterinarian.js";
import "./entities/Roles.js";
import "./entities/Speciality.js";
import "./entities/TypePets.js";
import "./entities/Breed.js";

import { defineAssociations } from "./entities/associations.js";
import userRoutes from "./Routes/user.routes.js";
import petRoutes from "./Routes/pet.routes.js";
import adminRoutes from "./Routes/admin.routes.js";
import shiftRoutes from "./Routes/shift.routes.js";
import veterinarianRoutes from "./Routes/veterinarian.routes.js"
import { initializationRoles } from "./Services/role.service.js";
import { initializationTypePet } from "./Services/pet.service.js";

defineAssociations();

const app = express();

async function startServer() {
  try {
    app.use(express.json());
    app.use((req, res, next) => {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "*");
      res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
      next();
    });

    app.use(userRoutes);
    app.use(petRoutes);
    app.use(adminRoutes);
    app.use(shiftRoutes);
    app.use(veterinarianRoutes)
    await sequelize.sync();

    app.listen(PORT, () => {
      console.log(`Servidor escuchando en http://localhost:${PORT}`);
    });
    initializationRoles();
    initializationTypePet();
  } catch (err) {
    console.error("Error durante el inicio:", err);
    process.exit(1);
  }
}
//await sequelize.sync({ alter: true });
startServer();
