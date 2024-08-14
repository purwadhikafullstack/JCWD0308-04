import { PrismaClient } from '@prisma/client';
import { Request, Response, Router } from 'express';
import { sign } from 'jsonwebtoken';
import { compare, hash } from 'bcrypt';

const prisma = new PrismaClient();
export class AdminControllers {
  async AdminLogin(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const admin = await prisma.admin.findUnique({
        where: { email },
      });
      if (!admin) {
        return res.status(404).json({ error: 'Admin Not Found' });
      }
      const isValid = await compare(password, admin.password);
      if (!isValid) {
        return res.status(401).json({ error: 'Invalid Password' });
      }
      const payload = { id: admin.id, email: admin.email, role: admin.role };
      const token = sign(payload, process.env.KEY_JWT!, { expiresIn: '6h' });
      const role = admin.role;
      const adminId = admin.id;
      res.status(200).json({ token, role, adminId });
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
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
  // Cashier Managements
  async CreateCashier(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const hashedPassword = await hash(password, 8);
      const newCashier = await prisma.cashier.create({
        data: { email, password: hashedPassword },
      });
      res.status(201).json({ newCashier, message: 'Cashier Created' });
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
  async GetCashier(req: Request, res: Response) {
    try {
      const cashier = await prisma.cashier.findMany();
      res.status(200).json(cashier);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
  async UpdateCashier(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const { email, newPassword } = req.body;
      const cashier = await prisma.cashier.findUnique({
        where: { id: parseInt(id) },
      });
      if (!cashier) {
        return res.status(404).json({ error: 'Cashier not found' });
      }
      const hashedPassword = await hash(newPassword, 8);
      const updatedCashier = await prisma.cashier.update({
        where: { id: parseInt(id) },
        data: { email, password: hashedPassword },
      });

      res.status(200).json(updatedCashier);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
  async DeleteCashier(req: Request, res: Response) {
    try {
      const id = req.params.id;
      if (!id || typeof id !== 'string') {
        return res.status(400).json({ error: 'Invalid or missing ID' });
      }
      const parseId = parseInt(id, 10);
      if (isNaN(parseId)) {
        return res.status(400).json({ error: 'Invalid ID format' });
      }
      const result = await prisma.cashier.delete({
        where: { id: parseId },
      });
      res.status(200).send({ result, message: 'deleted' });
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
  // Product Managements
  async createProduct(req: Request, res: Response) {
    try {
      const { name, stock, price } = req.body;
      const newProduct = await prisma.product.create({
        data: { name, stock, price },
      });
      res.status(201).json({ newProduct, message: 'Product Created' });
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
      await prisma.transactionProduct.deleteMany({ where: { productId: +id } });

      await prisma.product.delete({ where: { id: parseInt(id) } });
      res.status(204).send({ message: 'ok' });
    } catch (error) {
      console.log(error);

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
            lt: new Date(
              new Date(date as string).setDate(
                new Date(date as string).getDate() + 1,
              ),
            ),
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
          transaction: {
            createdAt: {
              gte: new Date(date as string),
              lt: new Date(
                new Date(date as string).setDate(
                  new Date(date as string).getDate() + 1,
                ),
              ),
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
            lt: new Date(
              new Date(date as string).setDate(
                new Date(date as string).getDate() + 1,
              ),
            ),
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
  async getConsolidatedDailySalesReport(req: Request, res: Response) {
    try {
      const { date } = req.query;
      if (!date) {
        return res.status(400).json({ error: 'Date is required' });
      }

      // Define start and end date for the given day
      const startDate = new Date(date as string);
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 1);

      // Fetch shifts with related cashier and transactions
      const shifts = await prisma.shift.findMany({
        where: {
          startTime: {
            gte: startDate,
            lt: endDate,
          },
        },
        include: {
          cashier: true,
          Transaction: {
            include: {
              Payment: true,
              TransactionProduct: {
                include: {
                  product: true,
                },
              },
            },
          },
        },
      });

      const consolidatedReport = shifts.map((shift) => {
        const totalSales = shift.Transaction.reduce((total, transaction) => {
          return (
            total +
            transaction.Payment.reduce(
              (sum, payment) => sum + payment.amount,
              0,
            )
          );
        }, 0);

        return {
          shiftId: shift.id,
          cashier: {
            email: shift.cashier.email,
          },
          startAmount: shift.startAmount,
          endAmount: shift.endAmount,
          createdAt: shift.endTime,
          totalSales,
          transactions: shift.Transaction.map((transaction) => ({
            transactionId: transaction.id,
            paymentDetails: transaction.Payment,
            transactionProducts: transaction.TransactionProduct,
          })),
        };
      });

      res.status(200).json(consolidatedReport);
    } catch (error) {
      console.error('Failed to fetch consolidated daily sales report:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
  async getTotalSales(req: Request, res: Response) {
    try {
      const totalSales = await prisma.payment.aggregate({
        _sum: {
          amount: true,
          change: true,
        },
      });
  
      const totalAmount = totalSales._sum.amount ?? 0;
      const totalChange = totalSales._sum.change ?? 0;
  
      const netSales = totalAmount - totalChange;
  
      res.status(200).json({ netSales });
    } catch (error) {
      console.error('Error fetching total sales:', error);
      res.status(500).json({ error: 'Failed to fetch total sales' });
    }
  }
  
  async getTotalCashSales(req: Request, res: Response) {
    try {
      const totalCashSales = await prisma.payment.aggregate({
        _sum: {
          amount: true,
          change: true
        },
        where: {
          method: 'cash',
        },
      });
      const totalAmount = totalCashSales._sum.amount ?? 0;
      const totalChange = totalCashSales._sum.change ?? 0;
  
      const netSales = totalAmount - totalChange;
      res.status(200).json({ netSales});
    } catch (error) {
      console.error('Error fetching total cash sales:', error);
      res.status(500).json({ error: 'Failed to fetch total cash sales' });
    }
  }
  async getTotalCardSales(req: Request, res: Response) {
    try {
      const totalCardSales = await prisma.payment.aggregate({
        _sum: {
          amount: true,
        },
        where: {
          method: 'card',
        },
      });
      res.status(200).json({ totalCardSales: totalCardSales._sum.amount || 0 });
    } catch (error) {
      console.error('Error fetching total card sales:', error);
      res.status(500).json({ error: 'Failed to fetch total card sales' });
    }
  }
}
