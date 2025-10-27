import { Router } from "express";
import { User } from "../entities/User.js";
import { Pet } from "../entities/Pet.js";
import { authenticateToken } from "../Services/user.service.js";
import {
  adminDeleteBreed,
  adminDeleteSpeciality,
  adminDeleteTypePet,
  adminDeleteUser,
  adminGetAllBreeds,
  adminGetAllPets,
  adminGetAllTypes,
  adminGetEditSpe,
  adminGetSpecialities,
  adminGetUser,
  adminGetUserPets,
  adminPutEditSpe,
  editBreedGet,
  editBreedPut,
  editTypeGet,
  editTypePut,
} from "../Services/admin.services.js";

const adminRoutes = Router();

adminRoutes.get("/adminpanel/users", authenticateToken, adminGetUser);
adminRoutes.put("/users", authenticateToken, adminDeleteUser);
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

adminRoutes.get("/adminpanel/breed", authenticateToken, adminGetAllBreeds);
adminRoutes.delete(
  "/adminpanel/breed/:idBreed",
  authenticateToken,
  adminDeleteBreed
);

adminRoutes.get("/adminpanel/typePet", authenticateToken, adminGetAllTypes);
adminRoutes.delete(
  "/adminpanel/typePet/:idType",
  authenticateToken,
  adminDeleteTypePet
);

adminRoutes.get("/edittype/:idType", authenticateToken, editTypeGet);
adminRoutes.put("/edittype/:id", authenticateToken, editTypePut);

adminRoutes.get("/editbreed/:idBreed", authenticateToken, editBreedGet);
adminRoutes.put("/editbreed/:id", authenticateToken, editBreedPut);
export default adminRoutes;
