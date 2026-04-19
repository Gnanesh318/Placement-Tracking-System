import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user || session.user.role !== 'STUDENT') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const formData = await req.formData()
        const resumeFile = formData.get('resume') as File | null

        if (!resumeFile) {
            return NextResponse.json({ error: 'Resume file is required' }, { status: 400 })
        }

        const buffer = Buffer.from(await resumeFile.arrayBuffer())
        const filename = `${session.user.id}-${Date.now()}-${resumeFile.name.replace(/\s+/g, '_')}`
        const uploadDir = join(process.cwd(), 'public', 'uploads', 'resumes')

        if (!existsSync(uploadDir)) {
            await mkdir(uploadDir, { recursive: true })
        }

        const filepath = join(uploadDir, filename)
        await writeFile(filepath, buffer)

        const resumeUrl = `/uploads/resumes/${filename}`

        // Simulate an ATS Score based on the file content/size (randomized for demo)
        // In a real application, you would pass the buffer to an LLM or ATS parser
        const atsScore = Math.floor(Math.random() * (95 - 60 + 1)) + 60

        // Update user record
        await prisma.user.update({
            where: { id: session.user.id },
            data: {
                resumeUrl,
                atsScore,
            },
        })

        return NextResponse.json({ 
            message: 'Resume uploaded successfully',
            resumeUrl,
            atsScore
        })
    } catch (error) {
        console.error('Resume upload error:', error)
        return NextResponse.json(
            { error: 'Failed to upload resume' },
            { status: 500 }
        )
    }
}
