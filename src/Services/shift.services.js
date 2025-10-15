import { Shift } from "../entities/Shift.js";
import { User } from "../entities/User.js";
import { Pet } from "../entities/Pet.js";

    const allowedTypeConsult = ['consulta', 'control', 'cirujia', 'estilista'];

export const createShift = async (req, res) => {
  try {
    const { userId, dateTime, typeConsult, petId, description, enrollment } = req.body;
    if (!userId) {
      return res.status(400).json({ message: "El campo user es obligatorio." });
    }
    if (!dateTime) {
      return res.status(400).json({ message: "Seleccione una fecha por favor" });
    }
    if (!typeConsult) {
      return res.status(400).json({ message: "El campo type es obligatorio." });
    }
    if (!allowedTypeConsult.includes(typeConsult)) {
      return res.status(400).json({ message: "Tipo de colsuta inválido. Debe ser uno de: ${allowedTypeConsult.join(', ')}" });
    }

    if (petId === undefined || petId === null || petId === '') {
      return res.status(400).json({ message: "El campo petId es obligatorio." });
    }
    const userExists = await User.findOne({ where: { id: userId } });
    if (!userExists) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    if (petId) {
      const petExists = await Pet.findOne({ where: { id: petId } });
      if (!petExists) {
        return res.status(404).json({ message: "Mascota no encontrada." });
      }
    }

    // Validar formato de dateTime (opcional; depende de tu DB/ORM)
    // Ejemplo simple: comprobar que es una fecha válida
    const date = new Date(dateTime);
    if (isNaN(date.getTime())) {
      return res.status(400).json({ message: "fecha no es una fecha válida." });
    }
        
        const newShift = await Shift.create({
            userId,
            dateTime,
            typeConsult,
            petId,
            description,
            enrollment,
        });
        res.status(201).json({ newShift });
    } catch (error) {
        console.error("error al crear turno", error);
        res.status(500).json({ message: "error interno del servidor", error});
    }
}