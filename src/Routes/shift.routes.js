import { Router } from "express";
import { Shift } from "../entities/Shift.js";
import { createShift } from "../Services/shift.services.js";
import { authenticateToken } from "../Services/user.service.js";

const shiftRoutes = Router();

shiftRoutes.post("/shift", authenticateToken, createShift);

export default shiftRoutes;