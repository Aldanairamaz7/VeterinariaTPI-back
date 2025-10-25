import {Shift} from '../entities/Shift.js'
import { Pet } from '../entities/Pet.js'
import { User } from '../entities/User.js'
import { Veterinarian } from '../entities/Veterinarian.js'


export const getShifts = async (req, res) =>{
    try{
        const {userId} = req.params

        const veterinarian = await Veterinarian.findOne({
            where: {userId}
        })

        if (!veterinarian){
            return res.status(404).json({message: 'Veterinario no encontrado'})
        }

        const shiftList = await Shift.findAll({
            where: { enrollment: veterinarian.enrollment },
            include: [
                {
                model: Pet,
                as: "pet",
                include: [
                    { association: "breedData" },
                    { association: "typePetData" },
                ],
                },
                {
                model: User,
                as: "client",
                attributes: ["id", "firstName", "lastName", "email"],
                },
            ],
            order: [["dateTime", "ASC"]],
    });
        res.json({
            veterinarian: {
                enrollment: veterinarian.enrollment,
                userId: veterinarian.userId
            },
            shiftList,
        })

    }catch(error){
        console.error("Error al obtener los turnos del veterinario:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }

}