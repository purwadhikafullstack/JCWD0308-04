import { Request, Response } from "express";
import { sign, verify } from "jsonwebtoken";
import { User } from "@/custom";
import { PrismaClient } from "@prisma/client";
import { compare } from "bcrypt";

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
            const isValid = await compare(password, cashier.password)
            if(!isValid) {
                return res.status(401).json({ error: 'Invalid Password' });
            }
            const payload = {id: cashier.id, email: cashier.email, role: cashier.role}
            const token = sign(payload, process.env.KEY_JWT!, {expiresIn: '6h'})
            const role  = cashier.role
            const cashierId = cashier.id

            res.status(200).json({token, role, cashierId})
        } catch (error) {
            res.status(500).json({error: 'Internal Server Error'})
        }
    }
    
    async GetShiftId(req: Request, res: Response) {
      try {
          const cashierId = req.user.id;
          const shift = await prisma.shift.findFirst({
              where: {
                  cashierId,
                  endTime: null,
              },
              select: { id: true },
          });
          if (!shift) {
              return res.status(404).json({ error: 'No active shift found' });
          }
          res.json({ shiftId: shift.id });
      } catch (error) {
          console.error('Error retrieving shift ID:', error);
          res.status(500).json({ error: 'Internal Server Error' });
      }
    } 
    async getCashierId(req: Request, res: Response) {
        try {
          const userId = req.user.id;
          const cashier = await prisma.cashier.findUnique({
            where: { id: userId },
            select: { id: true }
          });
    
          if (!cashier) {
            return res.status(404).json({ error: 'Cashier not found' });
          }
    
          res.json({ cashierId: cashier.id });
        } catch (error) {
          res.status(500).json({ error: 'Internal Server Error' });
        }
    }
    async StartShift(req: Request, res: Response) {
        try {
            const { startAmount } = req.body
            const cashierId = (req.user as User )?.id
            if(!cashierId) {
                return res.status(400).json({error: 'Cashier ID is missing' })
            }
            const shift = await prisma.shift.create({
                data: {
                    cashierId,
                    startAmount,
                    endAmount: null
                }
            })
            
            res.status(201).json({shiftId: shift.id})
        } catch (error) {
            res.status(500).json({error: 'Internal Server Error'})
        }
    }
    async GetShiftStatus(req: Request, res: Response) {
    const cashierId = req.user.id;
    try {
      const shift = await prisma.shift.findFirst({
        where: {
          cashierId,
          endTime: null,
        },
        orderBy: {
          startTime: 'desc',
        },
      });
  
      res.status(200).json({ shiftStarted: !!shift });
    } catch (error) {
      console.error('Error getting shift status:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
    }
    async GetCurrentShift(req: Request, res: Response) {
        try {
          const token = req.headers.authorization?.replace('Bearer ', '');
          if (!token) return res.status(401).json({ error: 'Unauthorized' });
          const verifiedUser = verify(token, process.env.KEY_JWT!) as User;
          const shift = await prisma.shift.findFirst({
            where: {
              cashierId: verifiedUser.id,
              endTime: null,
            },
            include: {
                // Transaction: true,
                cashier: true,
                _count: true
            },
            
          });
          if (!shift) {
            return res.status(404).json({ error: 'No active shift found' });
          }
          res.status(200).json(shift);
        } catch (error) {
          res.status(500).json({ error: 'Internal Server Error' });
        }
    }  
    async EndShift(req: Request, res: Response) {
        try {
            const { shiftId, endAmount } = req.body;
            if (!shiftId) {
              return res.status(400).json({ error: 'Shift ID is required' });
            }
            // Check if shift exists and is currently open
            const shift = await prisma.shift.findUnique({
              where: { id: shiftId },
              select: {
                id: true,
                endTime: true,
              },
            });
            if (!shift) {
              return res.status(404).json({ error: 'Shift not found' });
            }
            if (shift.endTime) {
              return res.status(400).json({ error: 'Shift already ended' });
            }
            // Update the shift
            const updatedShift = await prisma.shift.update({
              where: { id: shiftId },
              data: {
                endTime: new Date(),
                endAmount,
              },
            });
            res.status(200).json(updatedShift);
          } catch (error) {
            console.error('Error ending shift:', error);
            res.status(500).json({ error: 'Internal Server Error' });
          }
    }
    async Transaction(req: Request, res: Response) {
        const { shiftId, products, paymentMethod, amountPaid, cardNumber } = req.body;
        
        if (!Array.isArray(products) || products.length === 0) {
            return res.status(400).json({ error: 'No Products Provided' });
        }
    
        try {
            const transaction = await prisma.$transaction(async (prisma) => {
                const newTransaction = await prisma.transaction.create({
                    data: {
                        shiftId: shiftId,
                        totalPrice: products.reduce((total, product) => total + product.price * product.quantity, 0),
                        createdAt: new Date(),
                    },
                });
    
                await Promise.all(products.map(async (product) => {
                    const productInDB = await prisma.product.findUnique({ where: { id: product.id } });
    
                    if (!productInDB || productInDB.stock < product.quantity) {
                        throw new Error(`Insufficient stock for product ${product.name}`);
                    }
    
                    await prisma.product.update({
                        where: { id: product.id },
                        data: { stock: productInDB.stock - product.quantity },
                    });
    
                    await prisma.transactionProduct.create({
                        data: {
                            transactionId: newTransaction.id,
                            productId: product.id,
                            quantity: product.quantity,
                        },
                    });
                }));
    
                const newPayment = await prisma.payment.create({
                    data: {
                        transactionId: newTransaction.id,
                        method: paymentMethod,
                        amount: amountPaid,
                        change: amountPaid - newTransaction.totalPrice,
                        cardNumber: cardNumber || null,
                    },
                });
    
                return { transaction: newTransaction, payment: newPayment };
            });
    
            res.status(201).json(transaction);
        } catch (error) {
            res.status(500).json({ error: 'Failed to record transaction'});
        }
    }
    async GetDailyTransactions(req: Request, res: Response) {
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
                    shift: {include : {cashier: true}}, 
                    Payment: true,
                    TransactionProduct: { include: { product: true },
                    },
                    
                },
            });
            res.status(200).json(transactions);
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } 
    async GetProducts(req: Request, res: Response) {
        try {
            const products = await prisma.product.findMany();
            res.status(200).json(products);
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}