import { Router } from "express";
import { User } from "../entities/User.js";
import { Pet } from "../entities/Pet.js";
import { authenticateToken } from "../Services/user.service.js";
import {
  adminDeleteSpeciality,
  adminDeleteUser,
  adminGetAllPets,
  adminGetEditSpe,
  adminGetSpecialities,
  adminGetUser,
  adminGetUserPets,
  adminPutEditSpe,
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
adminRoutes.get(
  "/adminpanel/specialities",
  authenticateToken,
  adminGetSpecialities
);
adminRoutes.delete(
  "/adminpanel/specialities/:idSpe",
  authenticateToken,
  adminDeleteSpeciality
);

adminRoutes.get("/editspeciality/:idSpe", authenticateToken, adminGetEditSpe);
adminRoutes.put("/editspeciality/:idSpe", authenticateToken, adminPutEditSpe);

export default adminRoutes;
