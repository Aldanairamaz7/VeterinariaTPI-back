import { Router } from "express";
import { User } from "../entities/User.js";
import { Pet } from "../entities/Pet.js";
import { authenticateToken } from "../Services/user.service";
import { adminGetUser } from "../Services/admin.services.js";

const adminRoutes = Router();

adminRoutes.get("/adminuser", authenticateToken, adminGetUser);
