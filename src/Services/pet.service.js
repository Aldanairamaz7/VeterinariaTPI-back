import { Pet } from "../entities/Pet.js";
import { User } from "../entities/User.js";

/* Testear */
export const editPet = async (req, res) => {
  try {
    const { id, name, age, breed, imageURL } = req.body;
    if (!id) {
      return res.status(400).json({ message: "ID de la mascota es requerido" });
    }
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    const pet = await Pet.findOne({
      where: {
        id,
        userId: user.id,
      },
    });
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
          userId: user.id,
        },
      }
    );
    return res.status(200).json({ user });
  } catch (error) {
    console.error("Error al modificar la mascota", error);
    res.status(500).json({ message: "Error interno del servidor" });
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

    }
} */
