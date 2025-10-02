// associations.js
import { User } from './User.js';
import { Veterinarian } from './Veterinarian.js';
import { Pet } from './Pet.js';
import { Shift } from './Shift.js';

export const defineAssociations = () => {
 User.hasMany(Pet, { foreignKey: "userId", onDelete: "CASCADE", as:'pets' });
 Pet.belongsTo(User, { foreignKey: "userId", as:'user'});

 Veterinarian.hasMany(Shift, { foreignKey: "veterinarianId", onDelete: "CASCADE" });
 Shift.belongsTo(Veterinarian, { foreignKey: "veterinarianId" });

 Pet.hasMany(Shift, { foreignKey: "petId", onDelete: "CASCADE" });
 Shift.belongsTo(Pet, { foreignKey: "petId" });

 User.hasMany(Shift, { foreignKey: "userId", onDelete: "CASCADE" });
 Shift.belongsTo(User, { foreignKey: "userId" });
};
