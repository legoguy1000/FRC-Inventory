import express, { Request, Response } from "express";
import { passport } from './auth.strategies'
import { User } from "@prisma/client";
import jwt from "jsonwebtoken";
import * as crypto from 'crypto';
import { stat } from "fs";

function generateRandomString(length: number): string {
    return crypto.randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length);
}
const jwtSecretKey = process.env.JWT_SECRET_KEY || generateRandomString(50);

const router = express.Router();
router.get('/login/google', (req, res, next) => {
    const { origin } = req.query
    const state = origin
        ? Buffer.from(JSON.stringify({ origin })).toString('base64')
        : undefined

    const authenticator = passport.authenticate('google', { state })

    authenticator(req, res, next)
})
router.post('/redirect/google', function (req, res, next) {
    passport.authenticate('google', { session: false }, (err: any, user: User | null, info: object | string | Array<string | undefined>, status: number | Array<number | undefined>) => {
        if (err) { return next(err) }
        if (!user) {
            return res.status(401).send("Something went wrong. " + JSON.stringify(info))
        }
        let data = {
            time: Date(),
            ...user
        }
        const token = jwt.sign(data, jwtSecretKey);
        res.send({ token: token });
    })(req, res, next);
});
export default router;
