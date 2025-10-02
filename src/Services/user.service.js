import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken"
import { User } from "../entities/User.js";
import { Pet } from '../entities/Pet.js';
import { validateEmail, validatePassword } from '../utils/validations.js';



export const register = async (req, res) => {
    try {
        const { firstName, lastName, dni, email, password } = req.body;

        const user = await User.findOne({
        where: { email }
        });

        if (user) {
        return res.status(400).json({ message: "El usuario ya existe" });
        }

        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            firstName,
            lastName,
            dni,
            email,
            password: hashedPassword
        });

        return res.status(201).json({ newUser });
    } catch (error) {
        console.error("Error en registro:", error);
        return res.status(500).json({ message: "Error interno del servidor" });
    }
};

export const login = async (req,res) =>{
    
        const { email, password } = req.body;

        const resultEmail = validateEmail(email);
        if(!resultEmail)
                return res.status(401).send({message: "Email invalido"})
                                                
                                                // min, max, usa mayuscula, usa numeros 
        const resultPassword = validatePassword(password, 7, 20 , true, true)

        if(!resultPassword)
            return res.status(401).send({message: "Contraseña invalida"})

        const user = await User.findOne({
            where: { email },
            include:[
                {
                    model: Pet,
                    as:'pets'
                }
            ]
        })

        if (!user)
            return res.status(401).send({ message: "Usuario no existente"})

        const comparison = await bcrypt.compare(password, user.password)

        if(!comparison)
            return res.status(401).send({message: "Contraseña incorrecta"})

        const secretKey = 'TUP-VetCare';

        const token = jwt.sign({id: user.id, email: user.email}, secretKey, {expiresIn: "1h"})

        return res.json({
            token,
            user:{
                id: user.id,
                firstName: user.firstName,
                email: user.email

            }
        })

    

}

export const authenticateToken = async (req, res, next) =>{

    const secretKey = 'TUP-VetCare'
    const authHeader = req.headers['authorization'];

    const token = authHeader && authHeader.split(' ')[1];

    if(!token) return res.status(401).json({message: 'Token no proporcionado'})
    
    try{
        const decoded = jwt.verify(token, secretKey);
        const user = await User.findByPk(decoded.id)

        if(!user) return res.status(404).json({ message: 'Usuario no encontrado'})
        
        req.user = user;
        next()
    }catch(error){
        console.error('Error al verificar el token', error)
        return res.status(403).json({message: 'Token invalido'})
    }
}

export const addPet = async (req, res) => {

    try{
        const {name, age, breed, imageURL} = req.body

        if(!name || !age || !breed){
            return res.status(400).json({message: 'Faltan completar algunos campos obligatorios'})
        }

        const newPet = await Pet.create({
            name,
            age,
            breed,
            imageURL,
            userId: req.user.id
        });

        res.status(201).json(newPet)
    }catch(error){
        console.error('Error al agregar mascota', error)
        res.status(500).json({message: 'Error del servidor'});
        
    }

}

/* export const getPets = (req, res ,next) => {

} */