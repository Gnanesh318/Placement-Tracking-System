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

        if (!session?.user || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const student = await prisma.user.findUnique({
            where: { id: params.id },
            include: {
                interests: {
                    select: {
                        domain: true,
                    },
                },
                applications: {
                    include: {
                        drive: {
                            include: {
                                company: true,
                            },
                        },
                    },
                    orderBy: {
                        appliedDate: 'desc',
                    },
                },
            },
        })

        if (!student || student.role !== 'STUDENT') {
            return NextResponse.json(
                { error: 'Student not found' },
                { status: 404 }
            )
        }

        // Calculate placement intelligence
        const totalApplications = student.applications.length
        const companiesAttended = new Set(
            student.applications.map((app) => app.drive.companyId)
        ).size
        const shortlistedCount = student.applications.filter(
            (app) =>
                app.status === 'SHORTLISTED' ||
                app.status === 'INTERVIEWED' ||
                app.status === 'SELECTED'
        ).length

        // Find final offer if placed
        const finalOffer = student.applications.find(
            (app) => app.status === 'SELECTED'
        )

        const intelligence = {
            totalApplications,
            companiesAttended,
            shortlistedCount,
            finalOffer: finalOffer
                ? {
                    companyName: finalOffer.drive.company.companyName,
                    jobRole: finalOffer.drive.company.jobRole,
                    ctc: finalOffer.drive.company.ctc,
                }
                : null,
        }

        return NextResponse.json({ student, intelligence })
    } catch (error) {
        console.error('Student intelligence fetch error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch student details' },
            { status: 500 }
        )
    }
}
