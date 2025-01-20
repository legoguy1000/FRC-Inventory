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
router.post("/", async (req: Request, res: Response) => {
    const { name, owner } = req.body;
    const projects = await prisma.project.findMany({ where: { name: name } });
    if (projects.length > 0) {
        res.status(400).send({ error: true, message: `Project ${name} already exists. Project names muct be unique.`, data: { field: 'message' } })
    }
    try {
        await prisma.project.create({
            data: {
                name: name,
                owner: owner !== "" ? owner : null
            }
        })
        res.status(201).send({ error: false, message: "Project created." });
    } catch (error) {
        res.status(500).send({ error: true, message: error })
    }

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
