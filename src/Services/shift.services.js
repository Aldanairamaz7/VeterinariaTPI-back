import { Shift } from "../entities/Shift.js";
import { User } from "../entities/User.js";
import { Pet } from "../entities/Pet.js";
import { Op } from "sequelize";
import { Speciality } from "../entities/Speciality.js";
import { Veterinarian } from "../entities/Veterinarian.js";
import { Breed } from "../entities/Breed.js";
import { TypePet } from "../entities/TypePets.js";

export const createShift = async (req, res) => {
  try {
    const { userId, dateTime, typeConsult, petId, description, enrollment } =
      req.body;
    if (!userId) {
      return res.status(400).json({ message: "El campo user es obligatorio." });
    }
    if (!dateTime) {
      return res
        .status(400)
        .json({ message: "Seleccione una fecha por favor" });
    }
    if (!typeConsult) {
      return res.status(400).json({ message: "El campo type es obligatorio." });
    }
    /*if (!allowedTypeConsult.includes(typeConsult)) {
      return res.status(400).json({
        message:
          "Tipo de colsuta inválido. Debe ser uno de: ${allowedTypeConsult.join(', ')}",
      });
    }
    */
    if (petId === undefined || petId === null) {
      return res
        .status(400)
        .json({ message: "El campo petId es obligatorio." });
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
    const startOfDay = new Date(dateTime);
    startOfDay.setUTCHours(0, 0, 0, 0);

    const endOfDay = new Date(dateTime);
    endOfDay.setUTCHours(23, 59, 59, 999);

    const { count } = await Shift.findAndCountAll({
      where: {
        enrollment: Number(enrollment),
        dateTime: {
          [Op.between]: [startOfDay, endOfDay],
        },
        state: "Pendiente",
      },
    });
    if (count >= 5) {
      return res.status(400).json({
        message: "No hay más turnos disponibles para esta fecha",
      });
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
    res.status(500).json({ message: "error interno del servidor", error });
  }
};

export const historyShift = async (req, res) => {
  try {
    const { userId } = req.params;

    const shifts = await Shift.findAll({
      where: { userId },
      include: [
        { model: User, attributes: ["name", "email"] },
        { model: Pet, attributes: ["name", "breed"] },
      ],
      order: [["dateTime", "ASC"]],
    });

    res.status(200).json({ shifts });
  } catch (error) {
    res.status(500).json({ message: "error interno del servidor", error });
  }
};
export const checkoutShift = async (req, res) => {
  const { userId } = req.params;

  try {
    const shifts = await Shift.findAll({
      where: { userId },
      include: [
        {
          model: Pet,
          as: "pet",
          attributes: ["id", "name", "breed", "typePet"],
          include: [
            {
              model: Breed,
              as: "breedData",
              attributes: ["nameBreed"],
              required: false,
            },
            {
              model: TypePet,
              as: "typePetData",
              attributes: ["typePetName"],
              required: false,
            },
          ],
        },
      ],
      order: [["dateTime", "DESC"]],
    });

    const formatedShift = shifts.map((shift) => ({
      id: shift.id,
      dateTime: shift.dateTime,
      typeConsult: shift.typeConsult,
      description: shift.description,
      name: shift.pet?.name || "Sin mascota",
      breed: shift.pet?.breedData?.nameBreed || "Sin raza",
      typePet: shift.pet?.typePetData?.typePetName || "Sin tipo",
      state: shift.state,
    }));

    res.status(200).json(formatedShift);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener turnos" });
  }
};

export const cancelShift = async (req, res) => {
  const { userId, id } = req.params;
  const roleUser = req.user.idRole;
  console.log(id, userId);

  try {
    const shift = await Shift.findByPk(id);
    if (!shift) {
      return res.status(404).json({ message: "Turno no encontrado" });
    }

    shift.state = "Cancelado";
    await shift.save();
    let allShift;
    if (roleUser === 2) {
      allShift = await Shift.findAll({
        where: { enrollment: userId },
        include: [
          {
            model: Pet,
            as: "pet",
            attributes: ["id", "name", "breed", "typePet"],
            include: [
              {
                model: Breed,
                as: "breedData",
                required: false,
              },
              {
                model: TypePet,
                as: "typePetData",

                required: false,
              },
            ],
          },
          {
            model: User,
            as: "client",
            attributes: ["id", "firstName", "lastName", "email"],
          },
        ],
        order: [["dateTime", "DESC"]],
      });
    } else {
      allShift = await Shift.findAll({
        where: { userId },
        include: [
          {
            model: Pet,
            as: "pet",
            attributes: ["id", "name", "breed", "typePet"],
            include: [
              {
                model: Breed,
                as: "breedData",
                required: false,
              },
              {
                model: TypePet,
                as: "typePetData",
                required: false,
              },
            ],
          },
        ],
        order: [["dateTime", "DESC"]],
      });
    }

    const formatedShift = allShift.map((shift) => ({
      id: shift.id,
      dateTime: shift.dateTime,
      typeConsult: shift.typeConsult,
      description: shift.description,
      pet: {
        id: shift.pet?.id || null,
        name: shift.pet?.name || "Sin mascota",
        breedData: {
          nameBreed: shift.pet?.breedData?.nameBreed || "Sin raza",
        },
        typePetData: {
          typePetName: shift.pet?.typePetData?.typePetName || "Sin tipo",
        },
      },
      client: {
        firstName: shift.client.firstName,
        lastName: shift.client.lastName,
      },
      state: shift.state,
    }));

    return res
      .status(200)
      .json({ message: "Turno cancelado con exito.", formatedShift });
  } catch (err) {
    return res.status(500).json({ error: "Error interno del servidor." });
  }
};

export const getSpeciality = async (req, res) => {
  try {
    const specialities = await Speciality.findAll();
    if (!specialities)
      return res
        .status(404)
        .json({ message: "no se pudo encontarar especialidades" });
    const veterinarians = await User.findAll({
      where: { idRole: 2 },
      include: [
        {
          model: Veterinarian,
          as: "veterinarian",
          include: [{ model: Speciality, as: "speciality" }],
        },
      ],
    });
    if (!veterinarians)
      return res
        .status(404)
        .json({ message: "no se encontraron veterinarios" });

    return res.status(200).send({
      message: "se econtraron especialidades y veterinarios",
      specialities,
      veterinarians,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
