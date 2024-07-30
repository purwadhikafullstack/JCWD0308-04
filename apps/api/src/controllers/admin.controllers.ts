import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { sign } from 'jsonwebtoken'

const prisma = new PrismaClient()
export class AdminControllers {
    async AdminLogin(req:Request, res:Response){
        try {
            const {email, password} = req.body
            const admin = await prisma.admin.findUnique({
                    where : {email},
                })
            if (!admin) {
               return res.status(404).json({ error: 'Admin Not Found' });
             }
             if (password !== admin.password) {
               return res.status(401).json({ error: 'Invalid Credentials' });
             }
            const payload = {id:admin.id, email:admin.email}
            const token = sign(payload, process.env.KEY_JWT!, {expiresIn: '1h'})
            res.status(200).json({token})
        } catch (error) {
            res.status(500).json({error: "Internal Server Error"})
        }
    } 
}