import { Router } from "express";
import { Shift } from "../entities/Shift.js";
import { cancelShift, checkoutShift, createShift } from "../Services/shift.services.js";
import { authenticateToken } from "../Services/user.service.js";

const shiftRoutes = Router();

shiftRoutes.post("/shift", authenticateToken, createShift);
shiftRoutes.get("/misturnos", historyShift);
shiftRoutes.get('/:userId/misturnos', authenticateToken, checkoutShift)
shiftRoutes.delete('/shifts/:id', authenticateToken, cancelShift)

export default shiftRoutes;