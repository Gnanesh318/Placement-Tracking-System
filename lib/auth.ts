import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from './db'
import * as bcrypt from 'bcryptjs'

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error('Email and password required')
                }

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email },
                })

                if (!user) {
                    throw new Error('Invalid email or password')
                }

                const isValidPassword = await bcrypt.compare(
                    credentials.password,
                    user.password
                )

                if (!isValidPassword) {
                    throw new Error('Invalid email or password')
                }

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                    profileCompleted: user.profileCompleted,
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user, trigger, session }) {
            if (user) {
                token.id = user.id
                token.role = user.role
                token.profileCompleted = user.profileCompleted
            }

            if (
                trigger === 'update' &&
                session?.user &&
                typeof session.user.profileCompleted === 'boolean'
            ) {
                token.profileCompleted = session.user.profileCompleted
            }

            return token
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string
                session.user.role = token.role as string
                session.user.profileCompleted = token.profileCompleted as boolean
            }
            return session
        },
    },
    pages: {
        signIn: '/login',
    },
    session: {
        strategy: 'jwt',
    },
    secret: process.env.NEXTAUTH_SECRET,
}
