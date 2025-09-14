import { Router } from "express";
import { login, register } from "../Services/user.service.js";

const userRoutes = Router()

userRoutes.post('/register', register)
userRoutes.post('/login', login)


export default userRoutes
