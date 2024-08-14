import { AdminControllers } from '@/controllers/admin.controllers';
import { UserMiddleware } from '@/middleware/user.middleware';
import { Router } from 'express';

export class AdminRouter {
  private router: Router;
  private adminControllers: AdminControllers;
  private userMiddleware: UserMiddleware;
  constructor() {
    this.router = Router();
    this.adminControllers = new AdminControllers();
    this.userMiddleware = new UserMiddleware();
    this.initializeRoutes();
  }
  private initializeRoutes(): void {
    this.router.post('/login', this.adminControllers.AdminLogin); //done
    this.router.get(
      '/get-role',
      this.userMiddleware.verifyToken,
      this.adminControllers.GetRole,
    );
    // Cashier
    this.router.get('/get-cashier', this.adminControllers.GetCashier); //done
    this.router.post('/create-cashier', this.adminControllers.CreateCashier); //done
    this.router.put('/update-cashier/:id', this.adminControllers.UpdateCashier); //done
    this.router.delete('/delete-cashier/:id',
      this.adminControllers.DeleteCashier,
    ); //done
    // Product
    this.router.post('/create-product', this.adminControllers.createProduct); //done
    this.router.get('/get-product', this.adminControllers.getProducts); //done
    this.router.put('/update-product/:id', this.adminControllers.updateProduct); //done
    this.router.delete('/delete-product/:id', this.userMiddleware.verifyToken ,this.adminControllers.deleteProduct,); //done
    // Sales Report
    this.router.get('/total-sales', this.adminControllers.getTotalSales); //done
    this.router.get(
      '/total-cash-sales',
      this.adminControllers.getTotalCashSales,
    ); //done
    this.router.get(
      '/total-card-sales',
      this.adminControllers.getTotalCardSales,
    ); //done
    this.router.get(
      '/consolidated-daily-sales-report',
      this.adminControllers.getConsolidatedDailySalesReport,
    ); //done
    // this.router.get('/getDailySalesReport', this.adminControllers.getDailySalesReport)
    // this.router.get('/getProductSalesReport', this.adminControllers.getProductSalesReport)
    // this.router.get('/getShiftSalesReport', this.adminControllers.getShiftSalesReport)
  }
  getRouter() {
    return this.router;
  }
}
