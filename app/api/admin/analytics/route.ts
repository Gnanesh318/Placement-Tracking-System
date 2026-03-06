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

        // KPIs
        const totalStudents = await prisma.user.count({
            where: { role: 'STUDENT' },
        })

        const totalCompanies = await prisma.company.count()

        const activeDrives = await prisma.placementDrive.count({
            where: { active: true },
        })

        const totalApplications = await prisma.application.count()

        const placedStudents = await prisma.user.count({
            where: {
                role: 'STUDENT',
                placementStatus: 'PLACED',
            },
        })

        // Domain Interest Distribution
        const interestCounts = await prisma.studentInterest.groupBy({
            by: ['domain'],
            _count: {
                domain: true,
            },
        })

        const domainDistribution = interestCounts.map((item) => ({
            domain: item.domain,
            count: item._count.domain,
        }))

        // Recent Activity
        const recentApplications = await prisma.application.findMany({
            take: 5,
            orderBy: { appliedDate: 'desc' },
            include: {
                student: {
                    select: {
                        name: true,
                        registerNumber: true,
                    },
                },
                drive: {
                    include: {
                        company: true,
                    },
                },
            },
        })

        const recentDrives = await prisma.placementDrive.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: {
                company: true,
            },
        })

        const recentPlacements = await prisma.application.findMany({
            where: { status: 'SELECTED' },
            take: 5,
            orderBy: { updatedAt: 'desc' },
            include: {
                student: {
                    select: {
                        name: true,
                        registerNumber: true,
                    },
                },
                drive: {
                    include: {
                        company: true,
                    },
                },
            },
        })

        return NextResponse.json({
            kpis: {
                totalStudents,
                totalCompanies,
                activeDrives,
                totalApplications,
                placedStudents,
            },
            domainDistribution,
            recentActivity: {
                applications: recentApplications,
                drives: recentDrives,
                placements: recentPlacements,
            },
        })
    } catch (error) {
        console.error('Analytics fetch error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch analytics' },
            { status: 500 }
        )
    }
}
