import { Response, NextFunction } from "express";
import { Request as JWTRequest } from "express-jwt";
import { generateRandomString } from "./functions/auth";
import { pathToRegexp } from 'path-to-regexp';

interface IPathRequest extends JWTRequest {
    path: any
}
type Middleware = (req: IPathRequest, res: Response, next: NextFunction) => any;
export const SERVER_PORT = process.env.PORT || 3000;

// sequelize.sync({ force: true });
export const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || generateRandomString(50);

export const adminMiddleware = (req: JWTRequest, res: Response, next: NextFunction) => {
    if (req?.auth?.admin === null || !req?.auth?.admin) {
        res.status(403).send({
            error: true,
            message: 'You do not have permission to access this resource.'
        });
        return;
    }
    next();
}

export const pathRegex = (path: string): RegExp => {
    return pathToRegexp(path).regexp;
}
