import express, { Request, Response } from "express";
import { prisma } from '../prisma'

const router = express.Router();


router.get("/", async (req: Request, res: Response) => {
    const parts = await prisma.inventory.findMany({
        include: {
            part: true,
            project: true,
        }
    });
    res.send(parts);
});
export default router;
