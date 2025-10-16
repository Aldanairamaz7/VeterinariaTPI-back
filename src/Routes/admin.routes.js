import { Router } from "express";
import { User } from "../entities/User.js";
import { Pet } from "../entities/Pet.js";
import { authenticateToken } from "../Services/user.service.js";
import {
  adminDeleteUser,
  adminGetAllPets,
  adminGetUser,
  adminGetUserPets,
} from "../Services/admin.services.js";

const adminRoutes = Router();

adminRoutes.get("/adminpanel/users", authenticateToken, adminGetUser);
adminRoutes.delete("/users", authenticateToken, adminDeleteUser);
adminRoutes.get(
  "/adminpanel/users/:id/pets",
  authenticateToken,
  adminGetUserPets
);

adminRoutes.get("/adminpanel/pets", authenticateToken, adminGetAllPets);

export default adminRoutes;
