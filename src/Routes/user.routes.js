import { Router } from "express";
import { authenticateToken, login, register } from "../Services/user.service.js";
import { User } from "../entities/User.js";

const userRoutes = Router()

userRoutes.post('/register', register)
userRoutes.post('/login', login)
userRoutes.get('/user/me', authenticateToken, async (req, res)=>{
    try{
        const email = req.user.email;
        const user = await User.findOne({ where: {email}});

        if(!user){
            return res.status(404).json({message: 'Usuario no encontrado'})
        }

        res.json({
            user:{
                id: user.id,
                firstName: user.firstName,
                email: user.email
            }

        });
    }catch(error){
        console.error('Error en /user/me', error);
        res.status(500).json({message: 'Error interno del servidor'})
    }
})


export default userRoutes
