import express, { Request, Response } from "express";
import { passport } from './auth.strategies'
import { User } from "@prisma/client";
import jwt from "jsonwebtoken";
import { JWT_SECRET_KEY } from '../config'

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
    passport.authenticate('google', { session: false }, (err: Error, user: User | null, info: object, status: number | Array<number | undefined>) => {
        if (err) { return next(err) }
        if (!user) {
            return res.status(401).send({ ...info, error: true, token: null })
        }
        let data = {
            time: Date(),
            ...user
        }
        const token = jwt.sign(data, JWT_SECRET_KEY, { algorithm: "HS256", expiresIn: 60 * 60 * 6, subject: user.id }); //Expires in 6 hours
        res.send({ ...info, error: false, token: token });
    })(req, res, next);
});
router.get('/login/github', (req, res, next) => {
    const { origin } = req.query
    const state = origin
        ? Buffer.from(JSON.stringify({ origin })).toString('base64')
        : undefined

    const authenticator = passport.authenticate('github', { state })

    authenticator(req, res, next)
})
router.post('/redirect/github', function (req, res, next) {
    passport.authenticate('github', { session: false }, (err: Error, user: User | null, info: object, status: number | Array<number | undefined>) => {
        if (err) { return next(err) }
        if (!user) {
            return res.status(401).send({ ...info, error: true, token: null })
        }
        let data = {
            time: Date(),
            ...user
        }
        const token = jwt.sign(data, JWT_SECRET_KEY, { algorithm: "HS256", expiresIn: 60 * 60 * 6, subject: user.id }); //Expires in 6 hours
        res.send({ ...info, error: false, token: token });
    })(req, res, next);
});
export default router;
