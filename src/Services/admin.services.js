import { User } from "../entities/User.js";
import { Pet } from "../entities/Pet.js";

export const adminGetUser = async (req, res) => {
  const allUsers = await User.findAll({
    attributes: ['id', 'firstName', 'lastName', 'email', 'dni', 'isAdmin', 'isVeterinarian'],
    include: [
      {
        model: Pet,
        as: "pets",
      },
    ],
  });

  res.send(allUsers);
};

export const adminDeleteUser = async (req, res) => {
  const { id } = req.body;
  const user = await User.findByPk(id);
  await user.destroy();

  res.status(200).json({ message: `Usuario con id ${id} eliminado` });
};
