import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

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
        const { status } = body

        if (!status) {
            return NextResponse.json(
                { error: 'Status is required' },
                { status: 400 }
            )
        }

        const application = await prisma.application.update({
            where: { id: params.id },
            data: { status },
            include: {
                student: true,
                drive: {
                    include: {
                        company: true,
                    },
                },
            },
        })

        // If status is SELECTED, update student placement status
        if (status === 'SELECTED') {
            await prisma.user.update({
                where: { id: application.studentId },
                data: { placementStatus: 'PLACED' },
            })
        }

        return NextResponse.json({ application })
    } catch (error) {
        console.error('Application update error:', error)
        return NextResponse.json(
            { error: 'Failed to update application' },
            { status: 500 }
        )
    }
}
