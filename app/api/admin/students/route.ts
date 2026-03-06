import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { searchParams } = new URL(req.url)
        const domain = searchParams.get('domain')
        const minCgpa = searchParams.get('minCgpa')
        const maxCgpa = searchParams.get('maxCgpa')
        const department = searchParams.get('department')
        const batch = searchParams.get('batch')
        const placementStatus = searchParams.get('placementStatus')

        const where: any = {
            role: 'STUDENT',
        }

        if (department) {
            where.department = department
        }

        if (batch) {
            where.batch = batch
        }

        if (placementStatus) {
            where.placementStatus = placementStatus
        }

        if (minCgpa || maxCgpa) {
            where.cgpa = {}
            if (minCgpa) where.cgpa.gte = parseFloat(minCgpa)
            if (maxCgpa) where.cgpa.lte = parseFloat(maxCgpa)
        }

        if (domain) {
            where.interests = {
                some: {
                    domain,
                },
            }
        }

        const students = await prisma.user.findMany({
            where,
            select: {
                id: true,
                name: true,
                email: true,
                registerNumber: true,
                department: true,
                batch: true,
                cgpa: true,
                placementStatus: true,
                interests: {
                    select: {
                        domain: true,
                    },
                },
                _count: {
                    select: {
                        applications: true,
                    },
                },
            },
            orderBy: { name: 'asc' },
        })

        return NextResponse.json({ students })
    } catch (error) {
        console.error('Students fetch error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch students' },
            { status: 500 }
        )
    }
}
