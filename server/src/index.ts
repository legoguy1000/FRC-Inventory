import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import partRoutes from './routes/parts';
import ProjectRoutes from './routes/projects';
import InventoryRoutes from "./routes/inventory";
import { prisma } from './prisma'
import cors from "cors";


dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

// sequelize.sync({ force: true });


app.use(express.json());
app.use(express.urlencoded());
app.use(cors());
app.get("/", async (req: Request, res: Response) => {
    res.send("Express + TypeScript Server");
    const user = await prisma.user.create({
        data: {
            first_name: "asdfadf",
            last_name: "adr829@amco.com"
        }
    });
    console.log(user);
    try {
        const part = await prisma.part.create({
            data: {
                name: "Falcon 500",
                vendor: "Vex",
                location: "Falcon Bin",
            }
        });
        console.log(part);
        const project = await prisma.project.create({
            data: {
                name: "Stuff",
            }
        });
        console.log(project);
        const inventory = await prisma.inventory.create({
            data: {
                purchased: new Date(),
                part: {
                    connect: {
                        id: part.id
                    }
                },
                project: {
                    connect: {
                        id: project.id
                    }
                }
            }
        });
        console.log(inventory);
    } catch (error) {
        console.log(error)
    }

    // const user = await User.create({ id: uuidv4(), firstName: 'John', lastName: 'Doe' });
    // const part = await Part.create({ name: 'Vex Falcon 500' });
    // const project = await Project.create({ name: 'asdf' });
    // const inventory = await Inventory.create({ id: uuidv4(), purchased: new Date(), 'partId': part.id, 'projectId': project.id });
    // project.addInventory(inventory);
    // console.log(user.firstName); // 'John Doe'
    // const users = await User.findAll();
    // console.log(users);
});
app.use('/parts', partRoutes);
app.use('/projects', ProjectRoutes);
app.use('/inventory', InventoryRoutes);

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
