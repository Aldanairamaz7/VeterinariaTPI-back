import { Breed } from "../entities/Breed.js";
import { Pet } from "../entities/Pet.js";
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

    const typePets = await TypePet.findAll();
    if (!typePets)
      return (404).json({ message: "no se encontraron tipos de mascota" });
    const breed = await Breed.findAll();
    if (!breed)
      return res.status(404).json({ message: "no se encotro ninguna raza" });

    return res
      .status(200)
      .send({ message: "mascota encontrada con exito", pet, typePets, breed });
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor", error });
  }
};

export const editPet = async (req, res) => {
  try {
    const { id, name, age, breed, imageURL } = req.body;
    if (!id) {
      return res.status(400).json({ message: "ID de la mascota es requerido" });
    }
    const user = await User.findByPk(req.user.id, {
      attributes: ["id", "firstName", "lastName", "dni", "idRole"],
      include: [
        {
          model: Pet,
          as: "pets",
        },
      ],
    });
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    let pet;
    if (user.idRole < 2) {
      pet = await Pet.findOne({
        where: {
          id,
          userId: user.id, //quitar para modificar mascota como admin
        },
      });
    } else {
      pet = await Pet.findOne({
        where: {
          id,
        },
      });
    }

    if (!pet) {
      return res.status(404).json({ message: "Mascota no encontrada" });
    }
    await Pet.update(
      {
        name,
        age,
        breed,
        imageURL,
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
        },
      ],
    });

    return res.status(200).json({
      message: "Mascota actualizada con exito.",
      user: updatedUser,
      pet: updatedPet,
    });
  } catch (error) {
    console.error("Error al modificar la mascota", error);
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

    await pet.destroy();

    const updatedUser = await User.findByPk(req.user.id, {
      include: [
        {
          model: Pet,
          as: "pets",
        },
      ],
    });

    return res
      .status(200)
      .json({ message: "Mascota eliminada con exito.", user: updatedUser });
  } catch (error) {
    console.error("Error al eliminar mascota", error);
    return res.status(500).json({ message: "Error interno del servidor." });
  }
};
/* export const removePet = async (req, res) =>{
    try{
        const {name, age, breed, imageURL } = req.body

        const user = await User.findByPk(req.user.id, {
                    attributes: ["id", "firstName", "lastName", "dni", "email", "password"],
                    include:[
                        {
                            model: Pet,
                            as:'pets'
                        }
                    ]
                });
        
        if (user){
            const deletedPet = Pet.drop({
                id,
                name,
                age,
                breed,
                imageURL,
                userId: user.id
            })
        }

        return res.status(200).json({ deletedPet })

    }catch(error){
      console.log("Error al eliminar la mascota", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
} */
