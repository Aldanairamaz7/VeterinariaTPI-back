import { Router } from "express";
import { User } from "../entities/User.js";
import { Pet } from "../entities/Pet.js";
import { authenticateToken } from "../Services/user.service.js";
import { adminGetUser } from "../Services/admin.services.js";

const adminRoutes = Router();

adminRoutes.get("/users", authenticateToken, adminGetUser);

export default adminRoutes;
