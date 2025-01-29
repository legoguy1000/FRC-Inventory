import { User } from '@prisma/client'
import { prisma } from '../prisma'

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
        return [false, user];
    } catch (error) {
        return [true, 'User is not authorized to login'] //{ error: true, message: 'User does not exist.' }
    }
}

const createUserFromOAuth = async (id: string) => {
    let user: User = await prisma.user.findFirstOrThrow({ where: { id: id } });
    return user;
}

export { lookupUserFromOAuth, createUserFromOAuth }
