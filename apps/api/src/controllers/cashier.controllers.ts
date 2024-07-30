import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { sign } from "jsonwebtoken";

const prisma = new PrismaClient()
export class CashierControllers {
    async CashierLogin(req:Request, res: Response) {
        try {
            const {email, password} = req.body
            const cashier = await prisma.cashier.findUnique({
                where: { email }
            })
            if(!cashier) {
                return res.status(404).json({error: 'Cashier Not Found'})
            }
            if(password !== cashier.password) {
                return res.status(401).json({ error: 'Invalid Password' });
            }
            const payload = {id: cashier.id, email: cashier.email}
            const token = sign(payload, process.env.KEY_JWT!, {expiresIn: '1h'})
            res.status(200).json(token)
        } catch (error) {
            res.status(500).json({error: 'Internal Server Error'})
        }
    } 
}