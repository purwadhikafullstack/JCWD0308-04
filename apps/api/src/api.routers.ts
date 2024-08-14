import { Router } from "express";
import { AdminRouter } from "./routers/admin.router";
import { CashierRouter } from "./routers/cashier.router";
import { AccountRouter } from "./routers/account.router";

export class ApiRouter {
    private adminRouter: AdminRouter
    private cashierRouter: CashierRouter
    private accountRouter: AccountRouter
    private router: Router 
    constructor() {
        this.router = Router()
        this.adminRouter = new AdminRouter()
        this.cashierRouter = new CashierRouter()
        this.accountRouter = new AccountRouter()
        this.initializeRoutes()
    }
    private initializeRoutes(): void {
        this.router.use('/admin', this.adminRouter.getRouter())
        this.router.use('/cashier', this.cashierRouter.getRouter())
        this.router.use('/account', this.accountRouter.getRouter())
    }
    getRouter(): Router  {
        return this.router
    }
}