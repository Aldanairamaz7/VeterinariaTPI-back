import { Router } from "express";
import {
  addPet,
  authenticateToken,
  editProfile,
  login,
  register,
} from "../Services/user.service.js";
import { User } from "../entities/User.js";
import { Pet } from "../entities/Pet.js";

//import { Roles } from "../entities/Roles.js";

const userRoutes = Router();

/*
userRoutes.post("/createrole", async (req, res) => {
  const { rol } = req.body;
  const newRol = await Roles.create({
    roleSumary: rol,
  });
  return res.status(200).send({ message: "rol creado", newRol });
});

userRoutes.delete("/createrole", async (req, res) => {
  const role = await Roles.findByPk(2);
  role.destroy();
  return res.status(200).send({ message: "rol borraro" });
});
*/

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

/* Hay que testear estos endpoints */

userRoutes.put("/editprofile/:id", authenticateToken, editProfile);

export default userRoutes;
