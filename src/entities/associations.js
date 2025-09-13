// associations.js
import { User } from './User.js';
import { Veterinarian } from './Veterinarian.js';
import { Pet } from './Pet.js';
import { Shift } from './Shift.js';

export const defineAssociations = () => {
 User.hasMany(Pet, { foreignKey: "usuarioId", onDelete: "CASCADE" });
 Pet.belongsTo(User, { foreignKey: "usuarioId" });

 Veterinarian.hasMany(Shift, { foreignKey: "veterinarioId", onDelete: "CASCADE" });
 Shift.belongsTo(Veterinarian, { foreignKey: "veterinarioId" });

 Pet.hasMany(Shift, { foreignKey: "mascotaId", onDelete: "CASCADE" });
 Shift.belongsTo(Pet, { foreignKey: "mascotaId" });

 User.hasMany(Shift, { foreignKey: "usuarioId", onDelete: "CASCADE" });
 Shift.belongsTo(User, { foreignKey: "usuarioId" });
};
