import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    const adminEmail = process.env.SEED_ADMIN_EMAIL
    const adminPassword = process.env.SEED_ADMIN_PASSWORD

    if (!adminEmail || !adminPassword) {
        console.log(
            'Skipping admin seed. Set SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD to create an admin user.'
        )
        return
    }

    const hashedPassword = await bcrypt.hash(adminPassword, 10)

    try {
        const admin = await prisma.user.upsert({
            where: { email: adminEmail },
            update: {
                password: hashedPassword,
            },
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
        // process.exit(1)
    } finally {
        await prisma.$disconnect()
    }
}

main()
