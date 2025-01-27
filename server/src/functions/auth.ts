import { User } from '@prisma/client'
import { prisma } from '../prisma'

const lookupUserFromOAuth = async (id: string) => {
    let user: User = await prisma.user.findFirstOrThrow({ where: { id: id } });
    return user;
}

const createUserFromOAuth = async (id: string) => {
    let user: User = await prisma.user.findFirstOrThrow({ where: { id: id } });
    return user;
}

export { lookupUserFromOAuth, createUserFromOAuth }
