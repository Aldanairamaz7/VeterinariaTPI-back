import { Router } from "express";
import {
  editPet,
  getInfo,
  getPet,
  removePet,
} from "../Services/pet.service.js";
import { authenticateToken } from "../Services/user.service.js";

const petRoutes = Router();

petRoutes.get("/addpets", authenticateToken, getInfo);
petRoutes.get("/editpet/:petId", authenticateToken, getPet);
petRoutes.put("/editpet/:petId", authenticateToken, editPet);
petRoutes.delete("/pets/:petId", authenticateToken, removePet);

export default petRoutes;
