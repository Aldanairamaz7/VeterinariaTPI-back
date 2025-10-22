import express from "express";
import { PORT } from "./config.js";
import router from "./Routes/routes.js";
import { sequelize } from "./db.js";

import "./entities/User.js";
import "./entities/Pet.js";
import "./entities/Shift.js";
import "./entities/Veterinarian.js";
import "./entities/Roles.js";
import "./entities/Speciality.js";
import "./entities/TypePets.js";

import { defineAssociations } from "./entities/associations.js"; // Ajusta la ruta según tu estructura
import userRoutes from "./Routes/user.routes.js";
import petRoutes from "./Routes/pet.routes.js";
import adminRoutes from "./Routes/admin.routes.js";
import shiftRoutes from "./Routes/shift.routes.js";
import { initializationRoles } from "./Services/role.service.js";

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

    app.use(router);
    app.use(userRoutes);
    app.use(petRoutes);
    app.use(adminRoutes);
    app.use(shiftRoutes);
    await sequelize.sync();

    app.listen(PORT, () => {
      console.log(`Servidor escuchando en http://localhost:${PORT}`);
    });
    initializationRoles();
  } catch (err) {
    console.error("Error durante el inicio:", err);
    process.exit(1);
  }
}
//await sequelize.sync({ alter: true });
startServer();
