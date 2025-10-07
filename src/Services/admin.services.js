import { User } from "../entities/User.js";
import { Pet } from "../entities/Pet.js";

export const adminGetUser = async (req, res) => {
  const allUsers = await User.findAll(req.user.id, {
    attributes: ["id", "firstName", "lastName", "dni", "email"],
    include: [{ model: Pet, as: "pets" }],
  });

  res.send(allUsers);
};
