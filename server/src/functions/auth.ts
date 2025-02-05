import { User } from '@prisma/client'
import { prisma } from '../prisma'
import * as crypto from 'crypto';

export const generateInitialAdmin = async (data: any): Promise<boolean> => {
    const count = await prisma.user.count();
    if (count > 0) {
        return false;
    }
    try {
        await prisma.user.create({
            data: {
                name: data.name,
                email: data.email,
                enabled: true,
                admin: true,
                avatar: data.avatar
            }
        });
        return true
    } catch (error) {
        return false
    }
}

export const lookupUserFromOAuth = async (email: string) => {
    try {
        const user = await prisma.user.findFirstOrThrow({
            where: {
                email: email
            }
        });
        if (!user.enabled) {
            return { error: true, user: null, message: "User account is not enabled. Please contact system admins to enable your account." }
        }
        return { error: false, user: user, message: "" }
    } catch (error) {
        return { error: true, user: null, message: 'User account does not exist' }
    }
}

export const updateUserFromOAuth = async (id: string, data: any): Promise<User | null> => {
    try {
        const user = await prisma.user.update({
            where: {
                id: id
            },
            data: {
                name: data.name,
                avatar: data.avatar,
                lastLogin: new Date()
            }
        });
        return user;
    } catch (error) {
        return null;
    }
}

// const createUserFromOAuth = async (id: string) => {
//     let user: User = await prisma.user.findFirstOrThrow({ where: { id: id } });
//     return user;
// }

export const generateRandomString = (length: number): string => {
    return crypto.randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length);
}
