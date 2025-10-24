// associations.js
import { User } from "./User.js";
import { Veterinarian } from "./Veterinarian.js";
import { Pet } from "./Pet.js";
import { Shift } from "./Shift.js";
import { Roles } from "./Roles.js";
import { Speciality } from "./Speciality.js";
import { TypePet } from "./TypePets.js";
import { Breed } from "./Breed.js";

export const defineAssociations = () => {
  User.hasMany(Pet, { foreignKey: "userId", onDelete: "CASCADE", as: "pets" });
  Pet.belongsTo(User, { foreignKey: "userId", as: "user" });

  User.hasOne(Veterinarian, { foreignKey: "userId", onDelete: "CASCADE" });
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

  Speciality.hasMany(Veterinarian, {
    foreignKey: "idSpeciality",
  });
  Veterinarian.belongsTo(Speciality, {
    foreignKey: "idSpeciality",
    as: "speciality",
  });

  TypePet.hasMany(Breed, { foreignKey: "idTypePet" });
  Breed.belongsTo(TypePet, { foreignKey: "idTypePet" });

  TypePet.hasMany(Pet, { foreignKey: "typePet", as: 'pets' });
  Pet.belongsTo(TypePet, { foreignKey: "typePet", as: 'typePetData' });

  Breed.hasMany(Pet, { foreignKey: "breed" ,as: 'pets'});
  Pet.belongsTo(Breed, { foreignKey: "breed", as: 'breedData' });
};
