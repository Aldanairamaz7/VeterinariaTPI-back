import { Shift } from "../entities/Shift"; //revisar


export const createShift = async (req, res) => {
    try {
        const { dataTime, typeConsult, petId, userId } = req.body;
        if (!dataTime){
            return res.status(400).json({ error: "La fecha es obligatoria"});
        }
        const shift = await Shift.create({dataTime, typeConsult, petId, userId});
        return res.status(201).json(shift);
    }   catch (error) {
        console.error("error al crear turno: ", error);
        res.status(500).json({error: "error al crear el turno"});
    }
}