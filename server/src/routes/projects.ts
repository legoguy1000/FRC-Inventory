import express, { Request, Response } from "express";
import { prisma } from '../prisma'


const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
    const parts = await prisma.project.findMany({
        include: {
            inventory: false,
            _count: {
                select: { inventory: true },
            },
        }
    });
    res.send(parts);
});
router.get("/:projectId/inventory", async (req: Request, res: Response) => {
    const projectId = req.params.projectId;

    try {
        const project = await prisma.project.findFirstOrThrow({ where: { id: projectId } });
        const inventory = await prisma.part.findMany({
            include: {
                inventory: {
                    where: {
                        projectId: project?.id
                    }
                },
            },
            where: {
                inventory: {
                    some: {}
                }
            }
        });
        res.send(inventory);
    } catch (error) {
        res.send({ message: "Project does not exist" })
    }
});
export default router;
