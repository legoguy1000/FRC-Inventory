import express, { Express, Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import partRoutes from './routes/parts';
import ProjectRoutes from './routes/projects';
import InventoryRoutes from "./routes/inventory";
import AuthRoutes from './routes/auth'
import UserRoutes from './routes/users'
import { prisma } from './prisma'
import cors from "cors";
import session from 'express-session';
import { expressjwt, Request as JWTRequest } from "express-jwt";
import { JWT_SECRET_KEY, SERVER_PORT, pathRegex } from './config'

dotenv.config();

const app: Express = express();

app.use(express.json());
app.use(express.urlencoded());
app.use(cors());
app.use(session({ secret: 'keyboard cat', cookie: { maxAge: 60000, secure: false } }))
app.use(expressjwt({
    secret: JWT_SECRET_KEY,
    algorithms: ["HS256"],
    credentialsRequired: true,
    getToken: function fromHeaderOrQuerystring(req) {
        if (
            req.headers.authorization &&
            req.headers.authorization.split(" ")[0] === "Bearer"
        ) {
            return req.headers.authorization.split(" ")[1] as string;
        } else if (req.query && req.query.token) {
            return req.query.token as string;
        }
        return "";
    },
}).unless({
    path: [
        pathRegex('/auth{/*path}'),
        pathRegex('/ready')
    ]
}));
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err.name === 'UnauthorizedError') {
        res.status(401).send({
            error: true,
            message: 'No token provided.'
        });
    }
});
app.get('/ready', async (req, res) => {
    try {
        await prisma.$queryRaw`SELECT 1`;
        res.status(200).send('OK');
    } catch (error) {
        res.status(500).send('Not Ready');
    }
});
app.get("/", async (req: Request, res: Response) => {
    res.send("Express + TypeScript Server");
    try {
        const part = await prisma.part.create({
            data: {
                name: "Spark max",
                vendor: "Rev",
                location: "Falcon Bin",
                category: "electronics",
                image_url: "https://store.ctr-electronics.com/cdn/shop/files/3__19352_1673993701_1280_1280.png?v=1723228114&width=416",
                website: "https://store.ctr-electronics.com/products/falcon-500-powered-by-talon-fx"
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
app.use('/users', UserRoutes);
app.use('/auth', AuthRoutes);

app.listen(SERVER_PORT, () => {
    console.log(`[server]: Server is running at http://localhost:${SERVER_PORT}`);
});
