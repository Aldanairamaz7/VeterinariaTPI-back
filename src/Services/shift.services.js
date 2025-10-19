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

export const historyShift = async (req, res) => {
   try {
    const { userId } = req.params;
    
    const shifts = await Shift.findAll({
      where: { userId },
      include: [
        { model: User, attributes: ['name', 'email'] },
        { model: Pet, attributes: ['name', 'breed'] },
      ],
      order: [['dateTime', 'ASC']]
    });

    res.status(200).json({ shifts });
  } catch (error) {
    console.error("error al obtener turnos", error);
    res.status(500).json({ message: "error interno del servidor", error });
  }
};
export const checkoutShift = async (req, res) =>{
  const { userId }= req.params
  try{
    const shifts = await Shift.findAll({
      where:{ userId},
      include:[
        {
          model: Pet,
          attributes:['id', 'name', 'breed']
        }
      ],
      order:[['dateTime', 'DESC']]

    });

    const formatedShift = shifts.map(shift =>({
      id: shift.id,
      dateTime: shift.dateTime,
      typeConsult: shift.typeConsult,
      description: shift.description,
      petName: shift.Pet.name,
      breed: shift.Pet.breed
    }))

    res.json(formatedShift)

  }

  catch(error){
    res.status(500).json({error: 'Error al obtener turnos'})
  }
}

export const cancelShift = async (req,res) =>{
  const { id } = req.params
  const userIdFromToken = req.user.id

  try{
    const shift = await Shift.findByPk(id)
    if(!shift){
      return res.status(404).json({message: 'Turno no encontrado'});
    }

    if(shift.userId !== userIdFromToken){
      return res.status(403).json({ message: 'No tiene permiso para cancelar el turno'})
    }

    await shift.destroy();
    return res.status(200).json({ message: 'Turno cancelado con exito.'})
  }catch(err){
    return res.status(500).json({error: 'Error interno del servidor.'})
  }

}
