// import prisma from "@/prisma";
// import { Request, Response } from "express";

// export class AccControllers {
//     async GetRole(req: Request, res: Response) {
//         try {
//             // Ensure the user is authenticated and has a role
//             if (!req.user || !req.user.role) {
//                 return res.status(401).json({ error: "Unauthorized" });
//             }
//             let user;
//             // Fetch user data based on their role
//             if (req.user.role === "cashier") {
//                 user = await prisma.cashier.findUnique({
//                     where: { id: req.user.id }
//                 });
//             } else if (req.user.role === "admin") {
//                 user = await prisma.admin.findUnique({
//                     where: { id: req.user.id }
//                 });
//             }
//             // Check if the user was found
//             if (!user) {
//                 return res.status(404).json({ error: "User not found" });
//             }
//             // Return the user data
//             res.status(200).json(user);
//         } catch (error) {
//             console.error("Error fetching user role:", error);
//             res.status(500).json({ error: "Internal Server Error" });
//         }
//     }
// }
