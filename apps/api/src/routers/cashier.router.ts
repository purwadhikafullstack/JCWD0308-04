import { CashierControllers } from "@/controllers/cashier.controllers";
import { Router } from "express";

export class CashierRouter{
    private router: Router
    private cashierControllers: CashierControllers
    constructor () {
        this.router = Router()
        this.cashierControllers = new CashierControllers()
        this.initializeRoutes()
    }
    private initializeRoutes(): void{
        this.router.post('/login', this.cashierControllers.CashierLogin)
    }
    getRouter()  {
        return this.router
    }
    
}