import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    const adminEmail = 'admin@college.edu'
    const adminPassword = 'admin123'

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
        console.log(`Password: ${adminPassword}`)
    } catch (e) {
        console.error(e)
        process.exit(1)
    } finally {
        await prisma.$disconnect()
    }
}

main()
