import { User } from "../entities/User.js";
import { Pet } from "../entities/Pet.js";
import { Roles } from "../entities/Roles.js";
import { Speciality } from "../entities/Speciality.js";

export const adminGetUser = async (req, res) => {
  const allUsers = await User.findAll({
    attributes: ["id", "firstName", "lastName", "email", "dni", "idRole"],
    include: [
      {
        model: Pet,
        as: "pets",
      },
      {
        model: Roles,
        as: "roles",
      },
    ],
  });

  res.send(allUsers);
};

export const adminDeleteUser = async (req, res) => {
  const { idUserDelete } = req.body;
  if (!idUserDelete)
    return res
      .status(404)
      .json({ message: "Se necesita un id para eliminar un usuario" });
  const user = await User.findByPk(idUserDelete);
  if (!user)
    return res.status(404).json({ message: "No se encontro al usuario" });
  await user.destroy();

  const allUsers = await User.findAll({
    include: [
      {
        model: Roles,
        as: "roles",
      },
    ],
  });
  res.status(200).json({ message: `Usuario eliminado`, allUsers });
};

export const adminGetUserPets = async (req, res) => {
  const { id } = req.params;
  if (!id)
    return res.status(400).send({
      message: "Es necesario una id de usuario para buscar las mascotas",
    });
  const pets = await Pet.findAll({
    where: { userId: id },
  });
  if (!pets)
    return res.status(404).send({ message: "Mascotas no encontradas" });
  res.status(200).send({ message: "Mascota/s encontrada/s con exito", pets });
};

export const adminGetAllPets = async (req, res) => {
  if (req.user.idRole !== 3)
    return res.status(403).send({ message: "no tienes permisos" });

  const pets = await Pet.findAll({
    include: [
      {
        model: User,
        as: "user",
      },
    ],
  });

  if (!pets)
    return res.status(404).send({ message: "no se encontraron las mascotas" });

  res.status(200).send({ message: "mascotas encontradas", pets });
};

export const adminGetSpecialities = async (req, res) => {
  const specialities = await Speciality.findAll();

  if (!specialities)
    return res
      .status(404)
      .send({ message: "No se encontraron especialidades" });

  res.status(200).send({ message: "especialidades encontradas", specialities });
};

export const adminDeleteSpeciality = async (req, res) => {
  const { idSpe } = req.params;
  if (!idSpe)
    return res
      .status(404)
      .send({ message: "Se necesita una id para eliminar la especialidad" });

  const speciality = await Speciality.findByPk(idSpe);

  if (!speciality)
    return res.status(404).send({ message: "No se encontro la especialidad" });

  await speciality.destroy();

  const specialities = await Speciality.findAll();

  return res
    .status(200)
    .send({ message: "Especialidad borrada con exito", specialities });
};

export const adminGetEditSpe = async (req, res) => {
  const { idSpe } = req.params;

  if (!idSpe)
    return res
      .status(500)
      .send({ message: "Se necesita una id para buscar la especialidad" });

  const speciality = await Speciality.findByPk(idSpe);

  if (!speciality)
    return res.status(404).send({ message: "no se encontro la especialidad" });

  res.status(200).send({ message: "se encontro al especialidad", speciality });
};

export const adminPutEditSpe = async (req, res) => {
  const { idSpe } = req.params;
  if (!idSpe)
    return res
      .status(500)
      .send({ message: "Se necesita una id para actualizar una especialidad" });

  const { speciality } = req.body;
  if (!speciality)
    return res
      .status(500)
      .send({ message: "No se recibio ninguna especialidad" });
  const { idSpeciality, specialityName } = speciality;

  if (Number(idSpe) !== idSpeciality)
    return res.status(500).send({ message: "Error en los datos enviados" });

  const updateSpe = await Speciality.findByPk(idSpe);

  if (!updateSpe)
    return res.status(404).send({ message: "No se encontro la especialidad" });

  updateSpe.specialityName = specialityName;

  await updateSpe.save();

  res.status(200).send({ message: "Especialidad actualizada correctamente" });
};
