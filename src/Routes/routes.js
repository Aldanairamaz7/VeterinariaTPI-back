import { Router } from "express";

const router = Router();



router.get('/pets', (req,res) => {
    res.send("pidiendo mascotas")
});



export default router;