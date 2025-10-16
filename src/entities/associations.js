// associations.js
import { User } from "./User.js";
import { Veterinarian } from "./Veterinarian.js";
import { Pet } from "./Pet.js";
import { Shift } from "./Shift.js";
import { Roles } from "./Roles.js";

export const defineAssociations = () => {
  User.hasMany(Pet, { foreignKey: "userId", onDelete: "CASCADE", as: "pets" });
  Pet.belongsTo(User, { foreignKey: "userId", as: "user" });

  User.hasMany(Veterinarian, { foreignKey: "userId", onDelete: "CASCADE" });
  Veterinarian.belongsTo(User, { foreignKey: "userId", as: "veterinarian" });

  Pet.hasMany(Shift, { foreignKey: "petId", onDelete: "CASCADE" });
  Shift.belongsTo(Pet, { foreignKey: "petId" });

  User.hasMany(Shift, { foreignKey: "userId", onDelete: "CASCADE" });
  Shift.belongsTo(User, { foreignKey: "userId" });

  Veterinarian.hasMany(Shift, {
    foreignKey: "enrollment",
    onDelete: "CASCADE",
  });
  Shift.belongsTo(Veterinarian, { foreignKey: "enrollment" });

  Roles.hasMany(User, { foreignKey: "idRole", onDelete: "CASCADE" });
  User.belongsTo(Roles, { foreignKey: "idRole", as: "roles" });
};
