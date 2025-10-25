import { Router } from "express";
import {
  addPet,
  authenticateToken,
  editGetUser,
  editProfile,
  login,
  register,
} from "../Services/user.service.js";
import { User } from "../entities/User.js";
import { Pet } from "../entities/Pet.js";
import { Breed } from "../entities/Breed.js";
import { TypePet } from "../entities/TypePets.js";

const userRoutes = Router();

userRoutes.post("/register", register);
userRoutes.post("/login", login);

userRoutes.get("/user/me", authenticateToken, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ["id", "firstName", "lastName", "dni", "email", "idRole"],
      include: [
        {
          model: Pet,
          as: "pets",
          where: { isActive: true },
          required: false,
          include: [
            {
              model: Breed,
              as: "breedData",
            },
            {
              model: TypePet,
              as: "typePetData",
            },
          ],
        },
      ],
    });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json({ user });
  } catch (error) {
    console.error("Error en /user/me", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

userRoutes.post("/addpet", authenticateToken, addPet);
userRoutes.get("/editprofile/:userId", authenticateToken, editGetUser);

/* Hay que testear estos endpoints */

userRoutes.put("/editprofile/:id", authenticateToken, editProfile);

export default userRoutes;
