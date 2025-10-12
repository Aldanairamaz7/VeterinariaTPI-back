import Router from "express"; //revisar

import { createShift } from "../Services/shift.services";

const shiftRoutes = Router();

shiftRoutes.post("/shift", createShift);

export default shiftRoutes;