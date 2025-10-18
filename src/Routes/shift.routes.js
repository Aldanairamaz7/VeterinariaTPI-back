import { Router } from "express";
import { Shift } from "../entities/Shift.js";
import { createShift, historyShift } from "../Services/shift.services.js";
import { authenticateToken } from "../Services/user.service.js";

const shiftRoutes = Router();

shiftRoutes.post("/shift", authenticateToken, createShift);
shiftRoutes.get("/misturnos", historyShift);

export default shiftRoutes;