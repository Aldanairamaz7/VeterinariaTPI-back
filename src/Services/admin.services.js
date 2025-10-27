import { User } from "../entities/User.js";
import { Pet } from "../entities/Pet.js";
import { Roles } from "../entities/Roles.js";
import { Speciality } from "../entities/Speciality.js";
import { Shift } from "../entities/Shift.js";
import { where } from "sequelize";
import { Veterinarian } from "../entities/Veterinarian.js";
import { Breed } from "../entities/Breed.js";
import { TypePet } from "../entities/TypePets.js";

export const adminGetUser = async (req, res) => {
  const allUsers = await User.findAll({
    where: {
      isActive: true,
    },
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

  const allShift = await Shift.count({
    where: {
      userId: user.id,
    },
  });
  const pets = await Pet.findAll({
    where: {
      userId: user.id,
    },
  });
  if (allShift <= 0) {
    await user.destroy();
    await Promise.all(pets.map((el) => el.destroy()));
  } else {
    user.isActive = false;
    await Promise.all(
      pets.map(async (el) => {
        const allShift = await Shift.findAndCountAll({
          where: {
            petId: el.id,
            state: "Pendiente", //revisar que solo los shift con state en pendiete se cancelen cuando se elimina el usuaurio
          },
        });
        if (allShift.count <= 0) {
          await el.destroy();
        } else {
          el.isActive = false;
          allShift.rows.map(async (shift) => {
            shift.state = "Cancelado";
            await shift.save();
          });
          await el.save();
        }
      })
    );
    await user.save();
  }

  const allUsers = await User.findAll({
    where: {
      isActive: true,
    },
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

  const user = await User.findByPk(id, {
    attributes: ["id", "firstName", "lastName"],
  });

  if (!user) {
    return res.status(404).json({ message: "Usuario no encontrado" });
  }

  const pets = await Pet.findAll({
    where: { userId: id },
  });

  if (!pets)
    return res.status(404).send({ message: "Mascotas no encontradas" });
  res
    .status(200)
    .send({ message: "Mascota/s encontrada/s con exito", user, pets });
};

export const adminGetAllPets = async (req, res) => {
  if (req.user.idRole !== 3)
    return res.status(403).send({ message: "no tienes permisos" });

  const pets = await Pet.findAll({
    include: [
      {
        model: User,
        as: "user",
      },{
        model: Breed,
        as: 'breedData'
      }
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
  try {
    const { idSpe } = req.params;

    if (!idSpe) {
      return res
        .status(400)
        .json({ message: "ID de la especialidad es requerido." });
    }

    const speciality = await Speciality.findByPk(idSpe);

    if (!speciality) {
      return res.status(404).json({ message: "Especialidad no encontrada." });
    }

    const veterinariansCount = await Veterinarian.count({
      where: {
        idSpeciality: idSpe,
      },
    });

    if (veterinariansCount > 0) {
      return res.status(400).json({
        message: `No se puede eliminar esta especialidad porque tiene ${veterinariansCount} veterinario(s) asociado(s).`,
        veterinariansCount,
      });
    }

    await speciality.destroy();

    const specialities = await Speciality.findAll();

    return res.status(200).json({
      message: "Especialidad eliminada con éxito",
      specialities,
    });
  } catch (error) {
    console.error("Error al eliminar especialidad:", error);
    return res.status(500).json({ message: "Error interno del servidor." });
  }
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

export const adminGetAllBreeds = async (req,res) =>{
  const allBreeds = await Breed.findAll()

  if (!allBreeds)
    return res
      .status(404)
      .send({ message: "No se pudieron encontrar razas" });

  res.status(200).send({ message: "Razas encontradas", allBreeds });
}

export const adminDeleteBreed = async (req, res) =>{
  try
  {
    const { idBreed} = req.params

    if(!idBreed){
      return res
        .status(400)
        .json({message: 'ID de la raza es requerido'})
    }

    const findedBreed = await Breed.findByPk(idBreed)

    if(!findedBreed){
      return res
        .status(404)
        .json({message: 'Raza no encontrada'})
    }

    const petCount = await Pet.count({
      where:{
        breed: idBreed
      }
    })

    if (petCount > 0){
      return res
        .status(400)
        .json({message: `No se puede eliminar la raza ya que hay ${petCount} mascotas asociadas`})
    }

    await findedBreed.destroy()

    const allBreeds = await Breed.findAll()

    return res
      .status(200)
      .json({
        message: 'Raza eliminada con exito',
        allBreeds
      })
  }catch(err){
    console.error('Error al eliminar raza seleccionada.')
  }
}

export const adminGetAllTypes = async(req,res) =>{
  const allTypes = await TypePet.findAll()

  if (!allTypes)
    return res
      .status(404)
      .send({ message: "No se pudieron encontrar tipo de mascotas" });

  res.status(200).send({ message: "Tipos de mascotas encontradas", allTypes });
}

export const adminDeleteTypePet = async (req, res) =>{
  try
  {
    const { idType} = req.params

    if(!idType){
      return res
        .status(400)
        .json({message: 'ID del tipo de mascota es requerido'})
    }

    const findedType = await TypePet.findByPk(idType)

    if(!findedType){
      return res
        .status(404)
        .json({message: 'No se encontro el tipo de mascota'})
    }

    const petCount = await Pet.count({
      where:{
        typePet: idType
      }
    })

    if (petCount > 0){
      return res
        .status(400)
        .json({message: `No se puede eliminar el tipo de mascota ya que hay ${petCount} mascotas asociadas`})
    }

    await findedType.destroy()

    const allTypes = await TypePet.findAll()

    return res
      .status(200)
      .json({
        message: 'Tipo de mascotas con exito',
        allTypes
      })
  }catch(err){
    console.error('Error al eliminar el tipo de mascota.')
  }
}