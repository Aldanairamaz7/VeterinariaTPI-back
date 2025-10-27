import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../entities/User.js";
import { Pet } from "../entities/Pet.js";
import { Veterinarian } from "../entities/Veterinarian.js";
import { validateEmail, validatePassword } from "../utils/validations.js";
import { Roles } from "../entities/Roles.js";
import { Speciality } from "../entities/Speciality.js";
import { TypePet } from "../entities/TypePets.js";
import { Breed } from "../entities/Breed.js";

export const register = async (req, res) => {
  try {
    const { firstName, lastName, dni, email, password } = req.body;

    let user = await User.findOne({
      where: { email, isActive: true },
    });

    if (user) {
      return res
        .status(400)
        .send({ message: "Ya existe un usuario con ese email" });
    }

    user = await User.findOne({
      where: { dni, isActive: true },
    });

    if (user) {
      return res
        .status(400)
        .send({ message: "Ya existe un usuario con ese dni" });
    }

    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userRole = await Roles.findByPk(1);

    if (!userRole) {
      await Roles.create({
        id: 1,
        roleSumary: "Usuario",
      });
    }

    const newUser = await User.create({
      firstName,
      lastName,
      dni,
      email,
      password: hashedPassword,
      idRole: 3, //descomentar esta linea para crear un usuario con rol de admin
      isActive: true,
    });

    return res
      .status(201)
      .json({ message: "¡Usuario creado con exito!", newUser });
  } catch (error) {
    console.error("Error en registro:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  const resultEmail = validateEmail(email);
  if (!resultEmail) return res.status(401).send({ message: "Email invalido" });

  // min, max, usa mayuscula, usa numeros
  const resultPassword = validatePassword(password, 7, 20, true, true);

  if (!resultPassword)
    return res.status(401).send({ message: "Contraseña invalida" });

  const user = await User.findOne({
    where: { email, isActive: true },
    include: [
      {
        model: Pet,
        as: "pets",
        where: { isActive: true },
        required: false,
      },
    ],
  });

  if (!user) return res.status(401).send({ message: "Cuenta no registrada." });

  const comparison = await bcrypt.compare(password, user.password);

  if (!comparison)
    return res.status(401).send({ message: "Contraseña incorrecta" });

  const secretKey = "TUP-VetCare";

  const token = jwt.sign({ id: user.id, email: user.email }, secretKey, {
    expiresIn: "1h",
  });

  return res.json({
    message: "Bienvenido a VetCare",
    token,
    user,
  });
};

export const authenticateToken = async (req, res, next) => {
  const secretKey = "TUP-VetCare";
  const authHeader = req.headers["authorization"];

  const token = authHeader && authHeader.split(" ")[1];

  if (!token)
    return res.status(401).json({ message: "Token no proporcionado" });

  try {
    const decoded = jwt.verify(token, secretKey);
    const user = await User.findOne({
      where: { id: decoded.id, isActive: true },
    });

    if (!user)
      return res.status(404).json({ message: "Usuario no encontrado" });

    req.user = user;
    next();
  } catch (error) {
    console.error("Error al verificar el token", error);
    return res.status(403).json({ message: "Token invalido" });
  }
};

export const addPet = async (req, res) => {
  try {
    const {
      name,
      age,
      imageURL,
      typePetSelect,
      otherType,
      breedSelect,
      otherBreed,
    } = req.body;

    let newTypeId;
    let newBreedId;
    if (Number(typePetSelect) === 0 && otherType !== "") {
      const typePet = await TypePet.create({
        typePetName: otherType,
      });
      if (!typePet)
        return res.status(500).send({ message: "no se pudo crear la especie" });
      newTypeId = typePet.idType;
    }
    if (Number(breedSelect) === 0 && otherBreed !== "") {
      const breed = await Breed.create({
        nameBreed: otherBreed,
        idTypePet: typePetSelect !== 0 ? typePetSelect : newTypeId,
      });
      if (!breed)
        return res.status(500).send({ message: "no se pudo crear la raza" });
      newBreedId = breed.idBreed;
    }

    const newPetCreated = await Pet.create({
      name,
      age,
      typePet: Number(typePetSelect) !== 0 ? typePetSelect : newTypeId,
      breed: Number(breedSelect) !== 0 ? breedSelect : newBreedId,
      imageURL,
      userId: req.user.id,
      isActive: true,
    });

    const newPet = await Pet.findByPk(newPetCreated.id, {
      include: [
        {
          model: Breed,
          as: "breedData",
          /* attributes: ["idBreed", "nameBreed"], */
        },
        {
          model: TypePet,
          as: "typePetData",
          /* attributes: ["idTypePet", "typePetName"], */
        },
      ],
    });
    res.status(200).json({ message: "Mascota creada con exito", newPet });
  } catch (error) {
    console.error("Error al agregar mascota", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

export const editProfile = async (req, res) => {
  try {
    const { userData } = req.body;
    const {
      firstName,
      lastName,
      dni,
      email,
      password,
      idRole,
      prevIdRole,
      enrollment,
      ddSpeciality,
      speciality,
    } = userData;

    const targetUserId = req.params.id || req.user.id;
    // Fijarse si es que anda lo relacionado al veterinario.
    const user = await User.findByPk(targetUserId, {
      attributes: [
        "id",
        "firstName",
        "lastName",
        "dni",
        "email",
        "password",
        "idRole",
        "isActive",
      ],
      include: [
        {
          model: Pet,
          as: "pets",
          where: { isActive: true },
          required: false,
        },
      ],
      where: { isActive: true },
    });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;

    if (dni && dni !== user.dni) {
      const existingUserDni = await User.findOne({ where: { dni } });
      if (existingUserDni && existingUserDni.id !== user.id) {
        return res
          .status(400)
          .json({ message: "DNI ya se encuentra registrado." });
      }
      user.dni = dni;
    }

    if (email && email !== user.email) {
      const existingUserEmail = await User.findOne({ where: { email } });
      if (existingUserEmail && existingUserEmail.id !== user.id) {
        return res.status(400).json({ message: "Email ya registrado" });
      }
      user.email = email;
    }

    user.idRole = idRole;
    let message = "Usuario actualizado correctamente";

    if (idRole === 2) {
      if (!enrollment) {
        return res.status(404).send({ message: "Es necesario una matricula" });
      }

      let specialityId;

      if (Number(ddSpeciality) === 0 && !speciality) {
        return res
          .status(404)
          .send({ message: "Es necesario una especialidad" });
      }
      if (Number(ddSpeciality) === 0 && speciality) {
        const especialidad = await Speciality.create({
          specialityName: speciality,
        });
        if (!especialidad)
          return res
            .status(400)
            .send({ message: "no se pudo crear la especialidad" });
        specialityId = especialidad.idSpeciality;
      } else {
        specialityId = Number(ddSpeciality);
      }
      let veterinarian = await Veterinarian.findByPk(enrollment);

      if (!veterinarian) {
        veterinarian = await Veterinarian.create({
          enrollment,
          idSpeciality: specialityId,
          userId: targetUserId,
        });
        if (veterinarian) message = "Veterinario creado con exito";
        else {
          res
            .status(500)
            .send({ message: "No se pudo actualizar el veterinario" });
        }
      } else {
        veterinarian.idSpeciality = specialityId;

        message = "Veterinario actualizado con exito";
      }
      await veterinarian.save();
    }

    if (prevIdRole === 2 && prevIdRole !== idRole) {
      const delVet = await Veterinarian.findByPk(enrollment);
      await delVet.destroy();
    }
    const currentFirstName = user.firstName;
    if (!currentFirstName) user.firstName = currentFirstName;

    const currentLastName = user.lastName;
    if (!lastName) user.lastName = currentLastName;

    const currentDni = user.dni;
    if (!dni) user.dni = currentDni;

    const currentEmail = user.email;
    if (!email) user.email = currentEmail;

    const currentPasword = user.password;
    if (!password) user.password = currentPasword;

    if (password) {
      const saltRounds = 10;
      const salt = await bcrypt.genSalt(saltRounds);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();

    const updatedUser = user.toJSON();
    delete updatedUser.password;

    res.json({
      message,
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error en editProfile: ", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

export const editGetUser = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) return res.status(404).send({ message: "se necesita una id" });
    const user = await User.findByPk(userId, {
      where: { isActive: true },
      include: {
        model: Veterinarian,
        as: "veterinarian",
      },
    });
    const roles = await Roles.findAll();
    const specialitys = await Speciality.findAll();

    if (!user)
      return res.status(404).send({ message: "No se encontro el usuario" });

    if (req.user.id !== user.id && req.user.idRole !== 3)
      return res
        .status(403)
        .send({ message: "No tenes permisos para editar otros usuarios" });

    return res
      .status(200)
      .send({ message: "usuario encontrado", user, roles, specialitys });
  } catch (err) {
    return res.status(500).send({ message: "Error interno del servidor" });
  }
};
