import { Router } from "express";
import { editPet, removePet } from "../Services/pet.service.js";
import { authenticateToken } from "../Services/user.service.js";

const petRoutes = Router();

petRoutes.put("/editPets", authenticateToken, editPet);
petRoutes.delete("/pets/:id", authenticateToken, removePet);

export default petRoutes;
