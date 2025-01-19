import express, { Request, Response } from "express";
import { prisma } from '../prisma'

const router = express.Router();


router.get("/", async (req: Request, res: Response) => {
    const parts = await prisma.part.findMany({
        include: {
            inventory: true,
            _count: {
                select: { inventory: true },
            },
        }
    });
    res.send(parts);
});
router.get("/:partId", async (req: Request, res: Response) => {
    const partId = req.params.partId;
    try {
        const part = await prisma.part.findFirstOrThrow({
            where: {
                id: partId
            }
        });
        res.send(part);
    } catch (error) {
        res.send({ message: "Part does not exist" })
    }
});
export default router;
