import { Router } from "express";
import { AdminRouter } from "./routers/admin.router";
import { CashierRouter } from "./routers/cashier.router";

export class ApiRouter {
    private adminRouter: AdminRouter
    private cashierRouter: CashierRouter
    private router: Router
    constructor() {
        this.router = Router()
        this.adminRouter = new AdminRouter()
        this.cashierRouter = new CashierRouter()
        this.initializeRoutes()
    }
    private initializeRoutes(): void {
        this.router.use('/admin', this.adminRouter.getRouter())
        this.router.use('/cashier', this.cashierRouter.getRouter())
    }
    getRouter(): Router  {
        return this.router
    }
}