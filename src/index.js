import express from "express";

import router from "./Routes/rutes.js";
import { sequelize } from "./db.js";

import './entities/User.js';
import './entities/Pet.js';
import './entities/Shift.js';
import './entities/Veterinarian.js';

import { defineAssociations } from './entities/associations.js'; // Ajusta la ruta según tu estructura

defineAssociations();


const app = express();
const port = 3000;

app.use(router);



async function startServer() {
  try {
    // Sincronizar modelos
    await sequelize.sync();
    console.log("Modelos sincronizados correctamente.");

    // Iniciar servidor
    app.listen(port, () => {
      console.log(`Servidor escuchando en http://localhost:${port}`);
    });
  } catch (err) {
    console.error("Error durante el inicio:", err);
    process.exit(1);
  }
}

startServer();

 console.log(`holaaaaaaaa ${port}`)
