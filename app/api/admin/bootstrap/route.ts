import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import * as bcrypt from 'bcryptjs'

export async function GET(req: NextRequest) {
    try {
        const tokenFromHeader = req.headers.get('x-bootstrap-token')
        const tokenFromQuery = new URL(req.url).searchParams.get('token')
        const token = tokenFromHeader || tokenFromQuery
        const expectedToken = process.env.BOOTSTRAP_ADMIN_TOKEN || 'lumina-admin-secret'

        const normalizedExpected = expectedToken
            ? expectedToken.replace(/\s+/g, '')
            : ''
        const normalizedToken = token ? token.replace(/\s+/g, '') : ''

        if (!normalizedExpected || !normalizedToken || normalizedToken !== normalizedExpected) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const adminEmail = process.env.SEED_ADMIN_EMAIL || process.env.BOOTSTRAP_ADMIN_EMAIL
        const adminPassword = process.env.SEED_ADMIN_PASSWORD || process.env.BOOTSTRAP_ADMIN_PASSWORD

        if (!adminEmail || !adminPassword) {
            return NextResponse.json(
                { error: 'Bootstrap admin credentials are not configured' },
                { status: 400 }
            )
        }

        const normalizedEmail = adminEmail.trim().toLowerCase()
        const normalizedPassword = adminPassword.trim()

        if (!normalizedEmail || !normalizedPassword) {
            return NextResponse.json(
                { error: 'Bootstrap admin credentials are invalid' },
                { status: 400 }
            )
        }

        const hashedPassword = await bcrypt.hash(normalizedPassword, 10)

        const admin = await prisma.user.upsert({
            where: { email: normalizedEmail },
            update: {
                password: hashedPassword,
                role: 'ADMIN',
                profileCompleted: true,
                placementStatus: 'NOT_PLACED',
                department: 'Admin',
            },
            create: {
                email: normalizedEmail,
                name: 'Admin User',
                password: hashedPassword,
                role: 'ADMIN',
                profileCompleted: true,
                placementStatus: 'NOT_PLACED',
                department: 'Admin',
            },
        })

        return NextResponse.json({
            message: 'Admin bootstrap completed',
            adminEmail: admin.email,
        })
    } catch (error) {
        console.error('Admin bootstrap error:', error)
        return NextResponse.json(
            { error: 'Failed to bootstrap admin' },
            { status: 500 }
        )
    }
}
