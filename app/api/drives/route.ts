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

        let drives

        if (session.user.role === 'ADMIN') {
            // Admin sees all drives
            drives = await prisma.placementDrive.findMany({
                include: {
                    company: true,
                    _count: {
                        select: { applications: true },
                    },
                },
                orderBy: { driveDate: 'desc' },
            })
        } else {
            // Students see only eligible drives
            const user = await prisma.user.findUnique({
                where: { id: session.user.id },
            })

            if (!user || !user.department || user.cgpa === null) {
                return NextResponse.json({ drives: [] })
            }

            drives = await prisma.placementDrive.findMany({
                where: {
                    active: true,
                    eligibilityCgpa: { lte: user.cgpa },
                    allowedDepartments: { array_contains: user.department },
                },
                include: {
                    company: true,
                    applications: {
                        where: { studentId: session.user.id },
                        select: { id: true, status: true },
                    },
                },
                orderBy: { driveDate: 'asc' },
            })
        }

        return NextResponse.json({ drives })
    } catch (error) {
        console.error('Drives fetch error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch drives' },
            { status: 500 }
        )
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await req.json()
        const {
            companyId,
            eligibilityCgpa,
            allowedDepartments,
            driveDate,
            active,
            maxOffers,
        } = body

        if (
            !companyId ||
            !eligibilityCgpa ||
            !allowedDepartments ||
            !driveDate
        ) {
            return NextResponse.json(
                { error: 'Required fields missing' },
                { status: 400 }
            )
        }

        const drive = await prisma.placementDrive.create({
            data: {
                companyId,
                eligibilityCgpa: parseFloat(eligibilityCgpa),
                allowedDepartments,
                driveDate: new Date(driveDate),
                active: active !== false,
                maxOffers: maxOffers ? parseInt(maxOffers) : null,
            },
            include: {
                company: true,
            },
        })

        return NextResponse.json({ drive }, { status: 201 })
    } catch (error) {
        console.error('Drive creation error:', error)
        return NextResponse.json(
            { error: 'Failed to create drive' },
            { status: 500 }
        )
    }
}
