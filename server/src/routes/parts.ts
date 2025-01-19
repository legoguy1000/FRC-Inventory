import express, { Request, Response } from "express";
import { Sequelize, Op } from "sequelize";

import { Inventory, Project } from "../models";
import { Part } from "../models";
import { InventoryModel } from "../models/inventory";
import { PartModel } from "../models/part";

const router = express.Router();

interface InventoryA extends PartModel {
    available?: number;
}
router.get("/", async (req: Request, res: Response) => {
    const parts = await Part.findAll({ include: [Inventory] });
    res.send(parts);
});
export default router;
