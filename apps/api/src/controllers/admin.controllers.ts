import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { sign } from 'jsonwebtoken'
import { hash } from "bcrypt";

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
            const payload = {id:admin.id, email:admin.email, role: admin.role}
            const token = sign(payload, process.env.KEY_JWT!, {expiresIn: '1h'})
            const role = admin.role
            res.status(200).json({token, role})
        } catch (error) {
            res.status(500).json({error: "Internal Server Error"})
        }
    } 
    // Cashier Managements
    async CreateCashier(req: Request, res: Response) {
        try {
            const { email, password } = req.body;
            const hashedPassword = await hash(password, 8);
            const newCashier = await prisma.cashier.create({
                data: {email, password : hashedPassword}
                })
            res.status(201).json({newCashier, message: "Cashier Created"});
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
    async GetCashier(req: Request, res: Response) {
        try {
            const cashier = await prisma.cashier.findMany()
            res.status(200).json(cashier)
        } catch (error) {
            res.status(500).json({error: 'Internal Server Error'})
        }
    }
    async UpdateCashier(req: Request, res: Response) {
        try {
            const  id  = req.params.id;
            const { email, newPassword } = req.body;
            // console.log(currentPassword);
            const cashier = await prisma.cashier.findUnique({
                where: { id: parseInt(id) },
            });
            if (!cashier) {
                return res.status(404).json({ error: "Cashier not found" });
            }
            // const isPasswordValid = await compare(currentPassword, cashier.password);
            // if (!isPasswordValid) {
            //     return res.status(401).json({ error: "Current password is incorrect" });
            // }
            const hashedPassword = await hash(newPassword, 8);
            const updatedCashier = await prisma.cashier.update({
                where: { id: parseInt(id) },
                data: { email, password: hashedPassword },
            });
    
            res.status(200).json(updatedCashier);
        } catch (error) {
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
    async DeleteCashier(req: Request, res: Response) {
        try {
            const id = req.params.id
            if(!id || typeof id !== 'string') {
                return res.status(400).json({error: 'Invalid or missing ID'})
            }
            const parseId = parseInt(id, 10)
            if(isNaN(parseId)) {
                return res.status(400).json({error: 'Invalid ID format'})
            }
            const result = await prisma.cashier.delete({
                where: {id: parseId}
            })
            res.status(200).send({ result, message: "deleted"})
        } catch (error) {
            res.status(500).json({error: "Internal Server Error"})
        }
    }
    // Product Managements
    async createProduct(req: Request, res: Response) {
        try {
            const { name, stock, price } = req.body;
            const newProduct = await prisma.product.create({
                data: { name, stock, price },
            });
            res.status(201).json({newProduct, message: 'Product Created'});
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
    async getProducts(req: Request, res: Response) {
        try {
            const products = await prisma.product.findMany();
            res.status(200).json(products);
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
    async updateProduct(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { name, stock, price } = req.body;
            const updatedProduct = await prisma.product.update({
                where: { id: parseInt(id) },
                data: { name, stock, price },
            });
            res.status(200).json(updatedProduct);
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
    async deleteProduct(req: Request, res: Response) {
        try {
            const id = req.params.id;
            await prisma.product.delete({ where: { id: parseInt(id) } });
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
    async adjustStock(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { adjustment } = req.body; // positive or negative value
            const updatedProduct = await prisma.product.update({
                where: { id: parseInt(id) },
                data: { stock: { increment: adjustment } },
            });
            res.status(200).json(updatedProduct);
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
    // Sales Report 
    async getDailySalesReport(req: Request, res: Response) {
        try {
            const { date } = req.query;
            if (!date) {
                return res.status(400).json({ error: 'Date is required' });
            }
            const transactions = await prisma.transaction.findMany({
                where: {
                    createdAt: {
                        gte: new Date(date as string),
                        lt: new Date(new Date(date as string).setDate(new Date(date as string).getDate() + 1)),
                    },
                },
                include: {
                    Payment: true,
                    TransactionProduct: {
                        include: {
                            product: true,
                        },
                    },
                },
            });
            res.status(200).json(transactions);
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
    async getProductSalesReport(req: Request, res: Response) {
        try {
            const { date } = req.query;
            if (!date) {
                return res.status(400).json({ error: 'Date is required' });
            }
            const sales = await prisma.transactionProduct.groupBy({
                by: ['productId'],
                where: {
                    trasaction: {
                        createdAt: {
                            gte: new Date(date as string),
                            lt: new Date(new Date(date as string).setDate(new Date(date as string).getDate() + 1)),
                        },
                    },
                },
                _sum: { quantity: true },
                _count: { _all: true },
            });
            res.status(200).json(sales);
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
    async getShiftSalesReport(req: Request, res: Response) {
        try {
            const { date } = req.query;
            if (!date) {
                return res.status(400).json({ error: 'Date is required' });
            }
            const shifts = await prisma.shift.findMany({
                where: {
                    startTime: {
                        gte: new Date(date as string),
                        lt: new Date(new Date(date as string).setDate(new Date(date as string).getDate() + 1)),
                    },
                },
                include: {
                    cashier: true,
                    Transaction: true,
                },
            });
            res.status(200).json(shifts);
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}