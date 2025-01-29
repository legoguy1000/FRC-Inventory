import { PrismaClient } from '@prisma/client'
import { User } from './interfaces'
export const prisma = new PrismaClient().$extends({
    result: {
        user: {
            full_name: {
                needs: { first_name: true, last_name: true },
                compute(user: User) {
                    return `${user.first_name} ${user.last_name}`
                },
            },
        },
    },
})
