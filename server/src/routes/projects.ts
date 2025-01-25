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
        res.status(400).send({ error: true, message: `Project ${name} already exists. Project names muct be unique.`, data: { field: 'name' } })
        return;
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
router.put("/:projectId([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})", async (req: Request, res: Response) => {
    const projectId = req.params.projectId;
    try {
        await prisma.project.findFirstOrThrow({ where: { id: projectId } });
    } catch (error) {
        res.status(400).send({ error: true, message: 'Project does not exist.' })
        return;
    }
    const { name, owner } = req.body;
    const projects = await prisma.project.findMany({
        where: {
            name: name,
            id: {
                not: projectId
            }
        }
    });
    if (projects.length > 0) {
        res.status(400).send({ error: true, message: `Project ${name} already exists. Project names muct be unique.`, data: { field: 'name' } })
        return;
    }
    try {
        await prisma.project.update({
            where: {
                id: projectId
            },
            data: {
                name: name,
                owner: owner !== "" ? owner : null
            }
        })
        res.status(200).send({ error: false, message: "Project updated." });
    } catch (error) {
        res.status(500).send({ error: true, message: error })
    }

});
router.delete("/:projectId([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})", async (req: Request, res: Response) => {
    const projectId = req.params.projectId;
    try {
        await prisma.project.findFirstOrThrow({ where: { id: projectId } });
    } catch (error) {
        res.status(400).send({ error: true, message: 'Project does not exist.' })
        return;
    }
    try {
        const inventory = await prisma.inventory.findMany({
            where: {
                projectId: projectId
            }
        });
        if (inventory.length > 0) {
            res.status(400).send({ error: true, message: 'All parts must be unassigned before deleteing a project' })
            return;
        }
        await prisma.project.delete({
            where: {
                id: projectId
            }
        })
        res.status(200).send({ error: false, message: "Project deleted." });
    } catch (error) {
        res.status(500).send({ error: true, message: error })
    }

});
router.get("/:projectId([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/inventory", async (req: Request, res: Response) => {
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
