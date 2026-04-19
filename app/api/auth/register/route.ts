import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import * as bcrypt from 'bcryptjs'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

function isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData()
        const name = formData.get('name')
        const email = formData.get('email')
        const password = formData.get('password')
        const registerNumber = formData.get('registerNumber')
        const department = formData.get('department')
        const batch = formData.get('batch')
        const cgpa = formData.get('cgpa')
        const resume = formData.get('resume') as File | null

        const cleanedName = typeof name === 'string' ? name.trim() : ''
        const cleanedEmail = typeof email === 'string' ? email.trim().toLowerCase() : ''
        const cleanedPassword = typeof password === 'string' ? password : ''
        const cleanedRegisterNumber = typeof registerNumber === 'string' ? registerNumber.trim() : ''
        const cleanedDepartment = typeof department === 'string' ? department.trim() : ''
        const cleanedBatch = typeof batch === 'string' ? batch.trim() : ''
        const parsedCgpa =
            cgpa === '' || cgpa === null || cgpa === undefined
                ? null
                : Number(cgpa)

        // Validation
        if (!cleanedName || !cleanedEmail || !cleanedPassword) {
            return NextResponse.json(
                { error: 'Name, email, and password are required' },
                { status: 400 }
            )
        }

        if (!isValidEmail(cleanedEmail)) {
            return NextResponse.json(
                { error: 'Please enter a valid email address' },
                { status: 400 }
            )
        }

        if (cleanedPassword.length < 6) {
            return NextResponse.json(
                { error: 'Password must be at least 6 characters' },
                { status: 400 }
            )
        }

        if (!cleanedRegisterNumber || !cleanedDepartment || !cleanedBatch) {
            return NextResponse.json(
                {
                    error:
                        'Register number, department, and batch are required',
                },
                { status: 400 }
            )
        }

        if (parsedCgpa !== null && (Number.isNaN(parsedCgpa) || parsedCgpa < 0 || parsedCgpa > 10)) {
            return NextResponse.json(
                { error: 'CGPA must be a number between 0 and 10' },
                { status: 400 }
            )
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email: cleanedEmail },
        })

        if (existingUser) {
            return NextResponse.json(
                { error: 'User with this email already exists' },
                { status: 400 }
            )
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(cleanedPassword, 10)

        // Save the resume file if it exists
        let resumeUrl = null
        let atsScore = null
        if (resume) {
            const bytes = await resume.arrayBuffer()
            const buffer = Buffer.from(bytes)

            // Create uploads directory if not exists
            const uploadDir = path.join(process.cwd(), 'public/uploads/resumes')
            try {
                await mkdir(uploadDir, { recursive: true })
            } catch (err) {
                console.error('Error creating upload directory:', err)
            }

            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
            const filename = `resume-${uniqueSuffix}.pdf`
            const filepath = path.join(uploadDir, filename)

            await writeFile(filepath, buffer)
            resumeUrl = `/uploads/resumes/${filename}`
            
            // Simulate ATS score calculation (Random score between 60 and 95)
            atsScore = Math.floor(Math.random() * (95 - 60 + 1)) + 60
        }

        // Create user
        const user = await prisma.user.create({
            data: {
                name: cleanedName,
                email: cleanedEmail,
                password: hashedPassword,
                registerNumber: cleanedRegisterNumber,
                department: cleanedDepartment,
                batch: cleanedBatch,
                cgpa: parsedCgpa,
                resumeUrl,
                atsScore,
                role: 'STUDENT',
                profileCompleted: false,
                placementStatus: 'NOT_PLACED',
            },
        })

        return NextResponse.json(
            {
                message: 'User registered successfully',
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                },
            },
            { status: 201 }
        )
    } catch (error: any) {
        if (error?.code === 'P2002') {
            const target = Array.isArray(error.meta?.target)
                ? error.meta.target.join(', ')
                : String(error.meta?.target || '')

            if (target.includes('email')) {
                return NextResponse.json(
                    { error: 'User with this email already exists' },
                    { status: 409 }
                )
            }

            if (target.includes('registerNumber')) {
                return NextResponse.json(
                    { error: 'Register number already exists' },
                    { status: 409 }
                )
            }

            return NextResponse.json(
                { error: 'Duplicate value found. Please use unique details.' },
                { status: 409 }
            )
        }

        console.error('Registration error:', error)
        return NextResponse.json(
            { error: 'Failed to register user' },
            { status: 500 }
        )
    }
}
