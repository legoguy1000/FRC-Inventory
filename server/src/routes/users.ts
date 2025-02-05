import express, { Request, Response } from "express";
import { prisma } from '../prisma'
import { Request as JWTRequest } from "express-jwt";
import { adminMiddleware } from '../config'

const router = express.Router();
router.use(adminMiddleware);
router.get("/", async (req: JWTRequest, res: Response) => {
    const users = await prisma.user.findMany();
    res.send(users);
});
router.post("/", async (req: Request, res: Response) => {
    const { email } = req.body;
    const projects = await prisma.user.findMany({ where: { email: email } });
    if (projects.length > 0) {
        res.status(400).send({ error: true, message: `User account with email "${email}" already exists.`, data: { field: 'email' } })
        return;
    }
    try {
        await prisma.user.create({
            data: {
                email: email,
                enabled: true,
            }
        })
        res.status(201).send({ error: false, message: "User created." });
    } catch (error) {
        res.status(500).send({ error: true, message: error })
    }
});
router.put("/:userId([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})", async (req: Request, res: Response) => {
    const userId = req.params.userId;
    try {
        await prisma.user.findFirstOrThrow({ where: { id: userId } });
    } catch (error) {
        res.status(400).send({ error: true, message: 'User does not exist.' })
        return;
    }
    const { email } = req.body;
    try {
        await prisma.user.update({
            where: {
                id: userId
            },
            data: {
                email: email
            }
        })
        res.status(200).send({ error: false, message: "User updated." });
    } catch (error) {
        res.status(500).send({ error: true, message: error })
    }
});
router.post("/:userId([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/enable", async (req: Request, res: Response) => {
    const userId = req.params.userId;
    try {
        await prisma.user.findFirstOrThrow({ where: { id: userId } });
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
router.post("/:userId([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/disable", async (req: JWTRequest, res: Response) => {
    const userId = req.params.userId;
    try {
        await prisma.user.findFirstOrThrow({ where: { id: userId } });
    } catch (error) {
        res.status(400).send({ error: true, message: 'User does not exist.' })
        return;
    }
    if (req.auth?.sub === userId) {
        res.status(400).send({ error: true, message: 'You cannot disable yourself.' });
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
