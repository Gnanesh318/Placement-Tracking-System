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

        const companies = await prisma.company.findMany({
            orderBy: { createdAt: 'desc' },
        })

        return NextResponse.json({ companies })
    } catch (error) {
        console.error('Companies fetch error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch companies' },
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
        const { companyName, jobRole, ctc, location, industryType } = body

        if (!companyName || !jobRole || !ctc || !location || !industryType) {
            return NextResponse.json(
                { error: 'All fields are required' },
                { status: 400 }
            )
        }

        const company = await prisma.company.create({
            data: {
                companyName,
                jobRole,
                ctc: parseFloat(ctc),
                location,
                industryType,
            },
        })

        return NextResponse.json({ company }, { status: 201 })
    } catch (error) {
        console.error('Company creation error:', error)
        return NextResponse.json(
            { error: 'Failed to create company' },
            { status: 500 }
        )
    }
}
