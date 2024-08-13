import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { Router } from "express";

const prisma = new PrismaClient()
export class AccountControllers {
    async GetRole(req: Request, res: Response) {
        try {
            if (!req.user || !req.user.role) {
              return res.status(401).json({ error: 'User role not found' });
            }
            const role = req.user.role;
            let userData;
      
            if (role === 'admin') {
              userData = await prisma.admin.findUnique({
                where: { id: req.user.id },
              });
      
            } else if (role === 'cashier') {
              userData = await prisma.cashier.findUnique({
                where: { id: req.user.id },
              });
      
            } else {
              return res.status(400).json({ error: 'Invalid role' });
            }
            res.status(200).json({ role });
          } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
          }
      }
}