import express, { Request, Response } from "express";
import { prisma } from '../prisma'


const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
    const users = await prisma.user.findMany();
    res.send(users);
});
// router.post("/", async (req: Request, res: Response) => {
//     const { name, owner } = req.body;
//     const projects = await prisma.project.findMany({ where: { name: name } });
//     if (projects.length > 0) {
//         res.status(400).send({ error: true, message: `Project ${name} already exists. Project names muct be unique.`, data: { field: 'name' } })
//         return;
//     }
//     try {
//         await prisma.project.create({
//             data: {
//                 name: name,
//                 owner: owner !== "" ? owner : null
//             }
//         })
//         res.status(201).send({ error: false, message: "Project created." });
//     } catch (error) {
//         res.status(500).send({ error: true, message: error })
//     }
// });
router.put("/:userId([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})", async (req: Request, res: Response) => {
    const userId = req.params.userId;
    try {
        await prisma.user.findFirstOrThrow({ where: { id: userId } });
    } catch (error) {
        res.status(400).send({ error: true, message: 'User does not exist.' })
        return;
    }
    const { first_name, last_name, avatar, admin, enabled } = req.body;
    try {
        await prisma.user.update({
            where: {
                id: userId
            },
            data: {
                first_name: first_name,
                last_name: last_name,
                avatar: avatar,
                admin: admin,
                enabled: enabled,
            }
        })
        res.status(200).send({ error: false, message: "Project updated." });
    } catch (error) {
        res.status(500).send({ error: true, message: error })
    }
});
router.post("/:userId([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/enable", async (req: Request, res: Response) => {
    const userId = req.params.userId;
    try {
        await prisma.project.findFirstOrThrow({ where: { id: userId } });
    } catch (error) {
        res.status(400).send({ error: true, message: 'User does not exist.' })
        return;
    }
    try {
        await prisma.user.update({
            where: {
                id: userId
            },
            data: {
                enabled: true,
            }
        })
        res.status(200).send({ error: false, message: "User enabled." });
    } catch (error) {
        res.status(500).send({ error: true, message: error })
    }
});
router.post("/:userId([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/disable", async (req: Request, res: Response) => {
    const userId = req.params.userId;
    try {
        await prisma.project.findFirstOrThrow({ where: { id: userId } });
    } catch (error) {
        res.status(400).send({ error: true, message: 'User does not exist.' })
        return;
    }
    try {
        await prisma.user.update({
            where: {
                id: userId
            },
            data: {
                enabled: false,
            }
        })
        res.status(200).send({ error: false, message: "User enabled." });
    } catch (error) {
        res.status(500).send({ error: true, message: error })
    }
});
export default router;
