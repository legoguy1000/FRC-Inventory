import express, { Request, Response } from "express";
import { passport } from './auth.strategies'
import { User } from "@prisma/client";
import jwt from "jsonwebtoken";
const router = express.Router();


router.get('/login/google', passport.authenticate('google'));
router.post('/redirect/google', function (req, res, next) {
    passport.authenticate('google', { session: false }, (err: any, user: User | null, info: object | string | Array<string | undefined>, status: number | Array<number | undefined>) => {
        if (err) { return next(err) }
        if (!user) {
            return res.status(401).send("Something went wrong. " + JSON.stringify(info))
        }
        let jwtSecretKey = process.env.JWT_SECRET_KEY || "asdfadsfadsfasdf";
        let data = {
            time: Date(),
            ...user
        }
        const token = jwt.sign(data, jwtSecretKey);
        res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
        res.send(token);
    })(req, res, next);
});
export default router;
