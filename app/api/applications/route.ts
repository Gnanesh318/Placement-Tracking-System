import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        let applications

        if (session.user.role === 'ADMIN') {
            // Admin sees all applications
            applications = await prisma.application.findMany({
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
                    drive: {
                        include: {
                            company: true,
                        },
                    },
                },
                orderBy: { appliedDate: 'desc' },
            })
        } else {
            // Students see only their applications
            applications = await prisma.application.findMany({
                where: { studentId: session.user.id },
                include: {
                    drive: {
                        include: {
                            company: true,
                        },
                    },
                },
                orderBy: { appliedDate: 'desc' },
            })
        }

        return NextResponse.json({ applications })
    } catch (error) {
        console.error('Applications fetch error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch applications' },
            { status: 500 }
        )
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user || session.user.role !== 'STUDENT') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await req.json()
        const { driveId } = body

        if (!driveId) {
            return NextResponse.json(
                { error: 'Drive ID is required' },
                { status: 400 }
            )
        }

        // Check if already applied
        const existingApplication = await prisma.application.findUnique({
            where: {
                studentId_driveId: {
                    studentId: session.user.id,
                    driveId,
                },
            },
        })

        if (existingApplication) {
            return NextResponse.json(
                { error: 'You have already applied to this drive' },
                { status: 400 }
            )
        }

        // Get user and drive for eligibility check
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
        })

        const drive = await prisma.placementDrive.findUnique({
            where: { id: driveId },
        })

        if (!drive) {
            return NextResponse.json({ error: 'Drive not found' }, { status: 404 })
        }

        if (!drive.active) {
            return NextResponse.json(
                { error: 'Drive is not active' },
                { status: 400 }
            )
        }

        // Check eligibility
        if (
            user &&
            user.cgpa &&
            user.department &&
            (user.cgpa < drive.eligibilityCgpa ||
                !(drive.allowedDepartments as string[]).includes(user.department))
        ) {
            return NextResponse.json(
                { error: 'You are not eligible for this drive' },
                { status: 400 }
            )
        }

        // Create application
        const application = await prisma.application.create({
            data: {
                studentId: session.user.id,
                driveId,
                status: 'APPLIED',
            },
            include: {
                drive: {
                    include: {
                        company: true,
                    },
                },
            },
        })

        return NextResponse.json({ application }, { status: 201 })
    } catch (error) {
        console.error('Application creation error:', error)
        return NextResponse.json(
            { error: 'Failed to create application' },
            { status: 500 }
        )
    }
}
