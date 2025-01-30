import { User } from '@prisma/client'
import { prisma } from '../prisma'
import * as crypto from 'crypto';

const generateInitialAdmin = async (provider: string, id: string, data: any): Promise<boolean> => {
    const count = await prisma.user.count();
    if (count > 0) {
        return false;
    }
    try {
        await prisma.user.create({
            data: {
                first_name: data.first_name,
                last_name: data.last_name,
                enabled: true,
                admin: true,
                avatar: data.avatar,
                OAuth: {
                    create: [{
                        provider: provider,
                        providerId: id
                    }]
                }
            }
        });
        return true
    } catch (error) {
        return false
    }

}

const lookupUserFromOAuth = async (provider: string, id: string) => {
    try {
        const user = await prisma.user.findFirstOrThrow({
            where: {
                enabled: true,
                OAuth: {
                    some: {
                        provider: provider,
                        providerId: id
                    }
                }
            }
        });
        return { error: false, user: user, message: "" }
    } catch (error) {
        return { error: true, user: false, message: 'User is not authorized to login' }
    }
}

const createUserFromOAuth = async (id: string) => {
    let user: User = await prisma.user.findFirstOrThrow({ where: { id: id } });
    return user;
}

const generateRandomString = (length: number): string => {
    return crypto.randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length);
}

export { lookupUserFromOAuth, createUserFromOAuth, generateInitialAdmin, generateRandomString }
