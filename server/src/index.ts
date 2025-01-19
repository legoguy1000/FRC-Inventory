import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { v4 as uuidv4 } from 'uuid';
import partRoutes from './routes/parts';
import ProjectRoutes from './routes/projects';
import InventoryRoutes from "./routes/inventory";
import { User, Part, Project } from './models';
import { Inventory } from "./models/inventory";
import { sequelize } from "./sequelizeClient";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

sequelize.sync({ force: true });

app.use(express.json());
app.use(express.urlencoded());
app.get("/", async (req: Request, res: Response) => {
    res.send("Express + TypeScript Server");
    const user = await User.create({ id: uuidv4(), firstName: 'John', lastName: 'Doe' });
    const part = await Part.create({ name: 'Vex Falcon 500' });
    const inventory = await Inventory.create({ id: uuidv4(), purchased: new Date(), 'partId': part.id });
    const project = await Project.create({ id: uuidv4(), name: 'asdf' });
    project.addInventory(inventory);
    console.log(user.firstName); // 'John Doe'
    const users = await User.findAll();
    console.log(users);
});
app.use('/parts', partRoutes);
app.use('/projects', ProjectRoutes);
app.use('/inventory', InventoryRoutes);

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
