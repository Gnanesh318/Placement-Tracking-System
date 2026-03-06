import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { Domain } from '@prisma/client'

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            include: {
                interests: true,
            },
        })

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        return NextResponse.json({ user })
    } catch (error) {
        console.error('Profile fetch error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch profile' },
            { status: 500 }
        )
    }
}

export async function PUT(req: NextRequest) {
    console.log('PUT /api/profile called')
    try {
        const session = await getServerSession(authOptions)
        console.log('Session:', session?.user?.email)

        if (!session?.user || session.user.role !== 'STUDENT') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await req.json()
        const { interests } = body

        if (!interests || !Array.isArray(interests)) {
            return NextResponse.json(
                { error: 'Interests are required' },
                { status: 400 }
            )
        }

        // Delete existing interests
        await prisma.studentInterest.deleteMany({
            where: { userId: session.user.id },
        })

        // Create new interests
        console.log('Creating interests:', interests)
        await prisma.studentInterest.createMany({
            data: interests.map((domain: string) => ({
                userId: session.user.id,
                domain: domain as Domain,
            })),
        })

        // Update profile completion status
        console.log('Updating user profile status')
        await prisma.user.update({
            where: { id: session.user.id },
            data: { profileCompleted: true },
        })

        console.log('Profile update successful')
        return NextResponse.json({ message: 'Profile updated successfully' })
    } catch (error) {
        console.error('Profile update error:', error)
        return NextResponse.json(
            { error: 'Failed to update profile' },
            { status: 500 }
        )
    }
}


