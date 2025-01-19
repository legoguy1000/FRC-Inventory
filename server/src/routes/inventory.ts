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
    const inventory = await Inventory.findAll({ include: [Project, Part] });

    // let inventory: InventoryA[] = [];
    // const parts = await Part.findAll();
    // for await (const x of parts) {
    //     const count = await Inventory.count({
    //         where: {
    //             projectId: {
    //                 [Op.not]: null,
    //             },
    //             partId: {
    //                 [Op.eq]: x.id
    //             }
    //         }
    //     });
    //     let b: InventoryA = x.toJSON();
    //     b.available = count
    //     inventory.push(b)
    // }
    res.send(inventory);
});
export default router;
