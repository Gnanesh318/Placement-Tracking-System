import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET(
    req: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const drive = await prisma.placementDrive.findUnique({
            where: { id: params.id },
            include: {
                company: true,
                applications: session.user.role === 'ADMIN' ? {
                    include: {
                        student: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                registerNumber: true,
                                department: true,
                                cgpa: true,
                            },
                        },
                    },
                } : undefined,
            },
        })

        if (!drive) {
            return NextResponse.json({ error: 'Drive not found' }, { status: 404 })
        }

        return NextResponse.json({ drive })
    } catch (error) {
        console.error('Drive fetch error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch drive' },
            { status: 500 }
        )
    }
}

export async function PUT(
    req: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await req.json()
        const {
            eligibilityCgpa,
            allowedDepartments,
            driveDate,
            active,
            maxOffers,
        } = body

        const drive = await prisma.placementDrive.update({
            where: { id: params.id },
            data: {
                eligibilityCgpa: eligibilityCgpa
                    ? parseFloat(eligibilityCgpa)
                    : undefined,
                allowedDepartments: allowedDepartments || undefined,
                driveDate: driveDate ? new Date(driveDate) : undefined,
                active: active !== undefined ? active : undefined,
                maxOffers: maxOffers ? parseInt(maxOffers) : undefined,
            },
            include: {
                company: true,
            },
        })

        return NextResponse.json({ drive })
    } catch (error) {
        console.error('Drive update error:', error)
        return NextResponse.json(
            { error: 'Failed to update drive' },
            { status: 500 }
        )
    }
}

export async function DELETE(
    req: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        await prisma.placementDrive.delete({
            where: { id: params.id },
        })

        return NextResponse.json({ message: 'Drive deleted successfully' })
    } catch (error) {
        console.error('Drive deletion error:', error)
        return NextResponse.json(
            { error: 'Failed to delete drive' },
            { status: 500 }
        )
    }
}
