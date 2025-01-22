import express, { Request, Response } from "express";
import { AsyncParser } from '@json2csv/node';
import { prisma } from '../prisma'
import { Part } from '../interfaces'

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
    const inventory = req.query.inventory === 'true' ? {
        inventory: true,
        _count: {
            select: { inventory: true },
        },
    } : {};
    const parts = await prisma.part.findMany({
        include: inventory
    });
    res.send(parts);
});
router.post("/", async (req: Request, res: Response) => {
    for (const [_, el] of ['name', 'vendor', 'category', 'location'].entries()) {
        if (req.body[el] === undefined) {
            res.status(400).send({ error: true, message: `Field ${el} cannot be blank`, data: { field: el } })
            return;
        }
    }
    const { vendor, name, location, category, image_url, website } = req.body;
    const parts = await prisma.part.findMany({
        where: {
            name: {
                equals: name,
                mode: 'insensitive', // Default value: default
            },
            vendor: {
                equals: vendor,
                mode: 'insensitive', // Default value: default
            },
        }
    });
    if (parts.length > 0) {
        res.status(400).send({ error: true, message: `Part ${vendor} ${name} already exists. Part vendor & names muct be unique.`, data: { field: 'name' } })
        return;
    }
    try {
        await prisma.part.create({
            data: {
                name: name,
                vendor: vendor,
                category: category,
                location: location,
                image_url: image_url !== undefined ? image_url : '',
                website: website !== undefined ? website : ''
            }
        })
        res.status(201).send({ error: false, message: "Part created." });
    } catch (error) {
        res.status(500).send({ error: true, message: error })
    }

});
router.post("/bulk", async (req: Request, res: Response) => {
    const parts: Part[] = req.body.parts;
    const response: { error: boolean, message: string }[] = [];
    if (parts.length === 0) {
        res.status(400).send({ error: true, message: "Part list is empty" })
        return;
    }
    for (const [_, part] of parts.entries()) {
        let part_check = await prisma.part.findMany({
            where: {
                name: {
                    equals: part.name,
                    mode: 'insensitive', // Default value: default
                },
                vendor: {
                    equals: part.vendor,
                    mode: 'insensitive', // Default value: default
                },
            }
        });
        if (part_check.length > 0) {
            response.push({ error: true, message: `Part ${part.vendor} ${part.name} already exists. Part vendor & names muct be unique.` })
            continue;
        }
        try {
            await prisma.part.create({
                data: {
                    name: part.name,
                    vendor: part.vendor,
                    category: part.category,
                    location: part.location !== undefined ? part.location : '',
                    image_url: part.image_url !== undefined ? part.image_url : '',
                    website: part.website !== undefined ? part.website : ''
                }
            });
            response.push({ error: false, message: `Created part ${part.vendor} ${part.name}` });
        } catch (error) {
            response.push({ error: true, message: `Something went wrong creating ${part.vendor} ${part.name}: ${error}` });
        }
    }
    let error = response.filter(x => x.error).length > 0;
    let status = response.filter(x => !x.error).length === 0 ? 400 : 201;
    let message = "Parts Created."
    if (response.filter(x => x.error).length > 0) {
        message += " Some errors occured. Please see the response for more details"
    }
    res.status(status).send({ error: error, message: message, data: response });
});
router.get("/export", async (req: Request, res: Response) => {
    let parts = await prisma.part.findMany({
        select: {
            vendor: true,
            name: true,
            category: true,
            location: true,
            image_url: true,
            website: true,
        }
    });
    let date = new Date();
    const opts = {};
    const transformOpts = {};
    const asyncOpts = {};
    const parser = new AsyncParser(opts, asyncOpts, transformOpts);
    const csv = await parser.parse(parts).promise();
    res.setHeader('Content-disposition', `attachment; filename=parts-export-${date.toISOString()}.csv`).set('Content-Type', 'text/csv').send(csv)
});
router.get("/categories", async (req: Request, res: Response) => {
    let categories = await prisma.part.findMany({
        select: {
            category: true
        }
    });
    let filtered_categories = Array.from(new Set(categories.map(x => x.category.toLocaleLowerCase())));
    res.send(filtered_categories)
});
router.get("/locations", async (req: Request, res: Response) => {
    let locations = await prisma.part.findMany({
        select: {
            location: true
        }
    });
    let filtered_location = Array.from(new Set(locations.map(x => x.location.toLocaleLowerCase())));
    res.send(filtered_location)
});

router.get("/:partId([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})", async (req: Request, res: Response) => {
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
router.put("/:partId([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})", async (req: Request, res: Response) => {
    const partId = req.params.partId;
    try {
        await prisma.part.findFirstOrThrow({ where: { id: partId } });
    } catch (error) {
        res.status(400).send({ error: true, message: 'Part does not exist.' })
        return;
    }
    for (const [_, el] of ['name', 'vendor', 'category', 'location'].entries()) {
        if (req.body[el] === undefined) {
            res.status(400).send({ error: true, message: `Field ${el} cannot be blank`, data: { field: el } })
            return;
        }
    }
    const { vendor, name, location, category, image_url, website } = req.body;
    const parts = await prisma.part.findMany({ where: { name: name, vendor: vendor, id: { not: partId } } });
    if (parts.length > 0) {
        res.status(400).send({ error: true, message: `Part ${vendor} ${name} already exists. Part vendor & names muct be unique.`, data: { field: 'name' } })
        return;
    }
    try {
        await prisma.part.update({
            where: {
                id: partId
            },
            data: {
                name: name,
                vendor: vendor,
                category: category,
                location: location,
                image_url: image_url !== undefined ? image_url : '',
                website: website !== undefined ? website : ''
            }
        })
        res.status(200).send({ error: false, message: "Part updated." });
    } catch (error) {
        res.status(500).send({ error: true, message: error })
    }
});
router.delete("/:partId([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})", async (req: Request, res: Response) => {
    const partId = req.params.partId;
    try {
        await prisma.part.findFirstOrThrow({ where: { id: partId } });
    } catch (error) {
        res.status(400).send({ error: true, message: 'Part does not exist.' })
        return;
    }
    try {
        const inventory = await prisma.inventory.findMany({
            where: {
                partId: partId
            }
        });
        if (inventory.length > 0) {
            res.status(400).send({ error: true, message: 'Cannot delete a part with active inventory' })
            return;
        }
        await prisma.part.delete({
            where: {
                id: partId
            }
        })
        res.status(200).send({ error: false, message: "Part deleted." });
    } catch (error) {
        res.status(500).send({ error: true, message: error })
    }
});
export default router;
