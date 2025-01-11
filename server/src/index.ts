import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { initDB } from "./sequelizeClient";
import { User } from "./models";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

initDB();
const x = async () => {
    const user = await User.create({ firstName: 'John', lastName: 'Doe' });
    console.log(user.firstName); // 'John Doe'
    const users = await User.findAll();
    console.log(users);

}
app.use(express.json());
app.use(express.urlencoded());
app.get("/", (req: Request, res: Response) => {
    res.send("Express + TypeScript Server");
    x();
});


app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
