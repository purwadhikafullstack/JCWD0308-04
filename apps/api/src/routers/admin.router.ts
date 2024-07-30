import { AdminControllers } from "@/controllers/admin.controllers";
import { Router } from "express";

export class AdminRouter{
    private router : Router
    private adminControllers: AdminControllers
    constructor () {
        this.router = Router()
        this.adminControllers = new AdminControllers()
        this.initializeRoutes()
    }
    private initializeRoutes(): void{
        this.router.post('/login', this.adminControllers.AdminLogin)
    }
    getRouter()  {
        return this.router
    }
}