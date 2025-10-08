import { User } from "../entities/User.js";
import { Pet } from "../entities/Pet.js";

export const adminGetUser = async (req, res) => {
  const allUsers = await User.findAll();

  res.send(allUsers);
};
