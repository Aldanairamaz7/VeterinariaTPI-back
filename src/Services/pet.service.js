import { Breed } from "../entities/Breed.js";
import { Pet } from "../entities/Pet.js";
import { Shift } from "../entities/Shift.js";
import { TypePet } from "../entities/TypePets.js";
import { User } from "../entities/User.js";

export const initializationTypePet = async () => {
  const basicTypes = [
    {
      idType: 1,
      typePetName: "Perro",
    },
    {
      idType: 2,
      typePetName: "Gato",
    },
    {
      idType: 3,
      typePetName: "Ave",
    },
    {
      idType: 4,
      typePetName: "Pez",
    },
  ];

  await TypePet.bulkCreate(basicTypes, {
    ignoreDuplicates: true,
  });
};

export const getInfo = async (req, res) => {
  try {
    const typePet = await TypePet.findAll();
    if (!typePet)
      return res
        .status(404)
        .send({ message: "no se encontraron las especies" });
    const breed = await Breed.findAll();
    if (!breed)
      return res
        .status(404)
        .send({ message: "no se encontraron las especies" });

    res.status(200).send({ breed, typePet });
  } catch (err) {}
};

export const getPet = async (req, res) => {
  try {
    const { petId } = req.params;
    const user = await User.findByPk(req.user.id);
    if (!petId) return res.status(404).json({ message: "Debe enviar una id" });
    let pet;
    if (user.idRole !== 3) {
      pet = await Pet.findOne({
        where: {
          id: petId,
          userId: user.id,
        },
      });
    } else {
      pet = await Pet.findByPk(petId);
    }

    if (!pet) return res.status(404).json({ message: "Macota no encontrada" });

    const allTypePet = await TypePet.findAll();
    if (!allTypePet)
      return (404).json({ message: "no se encontraron tipos de mascota" });
    const allBreed = await Breed.findAll();
    if (!allBreed)
      return res.status(404).json({ message: "no se encotro ninguna raza" });

    return res.status(200).send({
      message: "mascota encontrada con exito",
      pet,
      allTypePet,
      allBreed,
    });
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor", error });
  }
};

export const editPet = async (req, res) => {
  try {
    const { pet } = req.body;
    const {
      id,
      petName,
      petAge,
      typePet,
      otherTypePet,
      breed,
      otherBreed,
      imageURL,
    } = pet;

    if (!id) {
      return res.status(400).json({ message: "ID de la mascota es requerido" });
    }
    const user = await User.findByPk(req.user.id, {
      attributes: ["id", "firstName", "lastName", "dni", "idRole"],
      include: [
        {
          model: Pet,
          as: "pets",
          include: [
            {
              model: Breed,
              as: "breedData",
            },
            {
              model: TypePet,
              as: "typePetData",
            },
          ],
        },
      ],
    });
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    let findedPet;
    if (user.idRole < 2) {
      findedPet = await Pet.findOne({
        where: {
          id,
          userId: user.id,
        },
      });
    } else {
      findedPet = await Pet.findOne({
        where: {
          id,
        },
      });
    }

    if (!findedPet) {
      return res.status(404).json({ message: "Mascota no encontrada" });
    }
    let typePetData;
    let breedData;
    if (typePet === 0) {
      typePetData = await TypePet.create({
        typePetName: otherTypePet,
      });
      if (!typePetData)
        return res.status(500).send({ message: "no se pudo crear la especie" });
    }

    if (breed === 0) {
      breedData = await Breed.create({
        nameBreed: otherBreed,
        idTypePet: typePet === 0 ? typePetData.idType : typePet,
      });
      if (!breedData)
        return res.status(500).send({ message: "no se pudo crear la raza" });
    }

    await Pet.update(
      {
        name: !petName ? findedPet.name : petName,
        age: !petAge ? findedPet.age : petAge,
        typePet: typePet === 0 ? typePetData.idType : typePet,
        breed: breed === 0 ? breedData.idBreed : breed,
        imageURL: !imageURL ? findedPet.imageURL : imageURL,
      },
      {
        where: {
          id,
        },
      }
    );
    const updatedPet = await Pet.findByPk(id);

    const updatedUser = await User.findByPk(req.user.id, {
      attributes: ["id", "firstName", "lastName", "dni", "email", "idRole"],
      include: [
        {
          model: Pet,
          as: "pets",
          include: [
            {
              model: Breed,
              as: "breedData",
            },
            {
              model: TypePet,
              as: "typePetData",
            },
          ],
        },
      ],
    });

    return res.status(200).json({
      message: "Mascota actualizada con exito.",
      user: updatedUser,
      pet: updatedPet,
    });
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const removePet = async (req, res) => {
  try {
    const { petId } = req.params;

    if (!petId) {
      return res
        .status(400)
        .json({ message: "ID de la mascota es requerido." });
    }

    const user = await User.findByPk(req.user.id, {
      include: [
        {
          model: Pet,
          as: "pets",
        },
      ],
    });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }
    let pet;
    if (user.idRole !== 3) {
      pet = await Pet.findOne({
        where: {
          id: petId,
          userId: user.id,
        },
      });
    } else {
      pet = await Pet.findOne({
        where: {
          id: petId,
        },
      });
    }

    if (!pet) {
      return res.status(404).json({ message: "Mascota no encontrada." });
    }

    const shift = await Shift.count({
      where: {
        petId: pet.id,
      },
    });
    if (shift <= 0) {
      pet.destroy();
    } else {
      pet.isActive = false;
      await pet.save();
    }

    const updatedUser = await User.findByPk(req.user.id, {
      include: [
        {
          model: Pet,
          as: "pets",
          where: { isActive: true },
          required: false,
          include: [
            {
              model: Breed,
              as: "breedData",
            },
            {
              model: TypePet,
              as: "typePetData",
            },
          ],
        },
      ],
    });

    return res.status(200).json({
      message: "Mascota eliminada con exito.",
      user: updatedUser,
      shift,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error interno del servidor." });
  }
};
