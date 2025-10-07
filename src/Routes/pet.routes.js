import { Router } from "express";
import { editPet } from "../Services/pet.service.js";
import { authenticateToken } from "../Services/user.service.js";

const petRoutes = Router();

petRoutes.put("/editPets", authenticateToken, editPet);

export default petRoutes;
