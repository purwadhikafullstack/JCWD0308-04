import { AccountControllers } from "@/controllers/account.controllers";
import { UserMiddleware } from "@/middleware/user.middleware";
import { Router } from "express";

export class AccountRouter{
    private router: Router
    private accountControllers: AccountControllers
    private userMiddleware : UserMiddleware
    constructor () {
        this.router = Router()
        this.accountControllers = new AccountControllers()
        this.userMiddleware = new UserMiddleware()
        this.initializeRoutes()
    }
    private initializeRoutes(): void{
        this.router.get('/get-role', this.userMiddleware.verifyToken , this.accountControllers.GetRole)
    }
    getRouter()  {
        return this.router
    }
    
}