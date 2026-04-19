import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    const adminEmail = process.env.SEED_ADMIN_EMAIL
    const adminPassword = process.env.SEED_ADMIN_PASSWORD

    if (!adminEmail || !adminPassword) {
        throw new Error(
            'Missing SEED_ADMIN_EMAIL or SEED_ADMIN_PASSWORD. Refusing to seed admin with defaults.'
        )
    }

    const hashedPassword = await bcrypt.hash(adminPassword, 10)

    try {
        const admin = await prisma.user.upsert({
            where: { email: adminEmail },
            update: {},
            create: {
                email: adminEmail,
                name: 'Admin User',
                password: hashedPassword,
                role: 'ADMIN',
                profileCompleted: true,
                department: 'Admin',
            },
        })
        console.log(`Admin user created: ${admin.email}`)
    } catch (e) {
        console.error(e)
        process.exit(1)
    } finally {
        await prisma.$disconnect()
    }
}

main()
