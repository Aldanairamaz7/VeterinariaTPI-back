import { Router } from "express";
import { authenticateToken } from "../Services/user.service.js";
import { getShifts } from "../Services/veterinarian.service.js";


const veterinarianRoutes = Router()

veterinarianRoutes.get("/veterinarian/:userId/shifts", authenticateToken, getShifts);

export default veterinarianRoutes