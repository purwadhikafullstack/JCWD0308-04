import { CashierControllers } from "@/controllers/cashier.controllers";
import { UserMiddleware } from "@/middleware/user.middleware";
import { Router } from "express";

export class CashierRouter{
    private router: Router
    private cashierControllers: CashierControllers
    private userMiddleware : UserMiddleware
    constructor () {
        this.router = Router()
        this.cashierControllers = new CashierControllers()
        this.userMiddleware = new UserMiddleware()
        this.initializeRoutes()
    }
    private initializeRoutes(): void{
        this.router.post('/login', this.cashierControllers.CashierLogin)
        this.router.post('/start-shift', this.userMiddleware.verifyToken , this.cashierControllers.StartShift)
        this.router.post('/end-shift', this.cashierControllers.EndShift)
        this.router.post('/transactions', this.cashierControllers.RecordTransaction)
        this.router.get('/products', this.cashierControllers.GetProducts)
        this.router.get('/transactions/:cashierId', this.cashierControllers.GetDailyTransactions)
    }
    getRouter()  {
        return this.router
    }
    
}