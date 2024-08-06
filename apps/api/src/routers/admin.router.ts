import { AdminControllers } from "@/controllers/admin.controllers";
import { UserMiddleware } from "@/middleware/user.middleware";
import { Router } from "express";

export class AdminRouter{
    private router : Router
    private adminControllers: AdminControllers
    private userMiddleware: UserMiddleware
    constructor () {
        this.router = Router()
        this.adminControllers = new AdminControllers()
        this.userMiddleware = new UserMiddleware()
        this.initializeRoutes()
    }
    private initializeRoutes(): void {
        this.router.post('/login', this.adminControllers.AdminLogin) //done
        // Cashier
        this.router.get('/getCashier' , this.adminControllers.GetCashier) //done
        this.router.post('/createCashier', this.adminControllers.CreateCashier) //done
        this.router.put('/updateCashier/:id', this.adminControllers.UpdateCashier) //done
        this.router.delete('/deleteCashier/:id', this.adminControllers.DeleteCashier) //done
        // Product
        this.router.post('/createProduct', this.adminControllers.createProduct) //done
        this.router.get('/getProduct', this.adminControllers.getProducts) //done
        this.router.put('/updateProduct/:id', this.adminControllers.updateProduct) //done
        this.router.delete('/delete-product/:id', this.adminControllers.deleteProduct) //done
        // this.router.patch('/adjustStock', this.adminControllers.adjustStock) //done
        // Sales Report
        this.router.get('/getDailySalesReport', this.adminControllers.getDailySalesReport)
        this.router.get('/getProductSalesReport', this.adminControllers.getProductSalesReport)
        this.router.get('/getShiftSalesReport', this.adminControllers.getShiftSalesReport)
    }
    getRouter()  {
        return this.router
    }
}