import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken"
import { User } from "../entities/User.js";
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
            where: {
                email
            }
        })

        if (!user)
            return res.status(401).send({ message: "Usuario no existente"})

        const comparison = await bcrypt.compare(password, user.password)

        if(!comparison)
            return res.status(401).send({message: "Contraseña incorrecta"})

        const secretKey = 'TUP-VetCare';

        const token = jwt.sign({email}, secretKey, {expiresIn: "1h"})

        return res.json({
            token,
            user:{
                id: user.id,
                firstName: user.firstName,
                email: user.email

            }
        })

    

}

export const authenticateToken = (req, res, next) =>{

    const secretKey = 'TUP-VetCare'
    const authHeader = req.headers['authorization'];

    const token = authHeader && authHeader.split(' ')[1];

    if(!token) return res.status(401).json({message: 'Token no proporcionado'})
    
    jwt.verify(token, secretKey, (err, userData) =>{
        if(err) return res.status(403).json({message: 'Token invalido o expirado'})

        req.user = userData
        next()
    })
}