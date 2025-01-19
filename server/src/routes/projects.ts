import express, { Request, Response } from "express";
import { Inventory, Project } from "../models";
import { Part } from "../models";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
    const parts = await Project.findAll({ include: Inventory });
    res.send(parts);
});
export default router;
