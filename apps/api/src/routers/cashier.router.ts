import { CashierControllers } from "@/controllers/cashier.controllers"
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
        this.router.post('/login', this.cashierControllers.CashierLogin) //done
        this.router.post('/start-shift', this.userMiddleware.verifyToken , this.cashierControllers.StartShift) //done
        this.router.get('/shift-status', this.userMiddleware.verifyToken, this.cashierControllers.GetShiftStatus) //done
        this.router.get('/current-shift', this.userMiddleware.verifyToken, this.cashierControllers.GetCurrentShift) //done
        this.router.post('/end-shift', this.userMiddleware.verifyToken , this.cashierControllers.EndShift) //done
        this.router.post('/transactions', this.userMiddleware.verifyToken, this.cashierControllers.Transaction)
        this.router.get('/transactions/:cashierId', this.userMiddleware.verifyToken, this.cashierControllers.GetDailyTransactions)
        this.router.get('/products', this.cashierControllers.GetProducts) //done
        this.router.post('/getShiftId', this.userMiddleware.verifyToken, this.cashierControllers.GetShiftId)
    }
    getRouter()  {
        return this.router
    }
    
}