'use client'

import { SessionProvider } from 'next-auth/react'
import Sidebar from '../components/Sidebar'
import { Bell, Search, User } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()
    
    const getPageTitle = () => {
        if (!pathname) return 'Dashboard'
        if (pathname.includes('/students')) return 'Students'
        if (pathname.includes('/drives')) return 'Placement Drives'
        if (pathname.includes('/companies')) return 'Companies'
        if (pathname.includes('/profile')) return 'Profile'
        if (pathname.includes('/settings')) return 'Settings'
        if (pathname.includes('/notifications')) return 'Notifications'
        return 'Dashboard'
    }

    return (
        <SessionProvider>
            <div className="dashboard-layout">
                <Sidebar />
                <main
                    className="dashboard-main"
                    id="main-content"
                    role="main"
                    aria-label="Placement portal dashboard"
                >
                    <header className="dashboard-header">
                        <div className="dashboard-header-content">
                            <div className="dashboard-header-left">
                                <h2 className="text-xl font-bold text-slate-900">{getPageTitle()}</h2>
                            </div>
                            <div className="dashboard-header-right">
                                <Link href="/notifications" className="icon-btn" aria-label="Notifications">
                                    <Bell size={20} />
                                    <span className="notification-dot"></span>
                                </Link>
                                <div className="divider"></div>
                                <Link href="/profile" className="profile-btn" aria-label="User profile">
                                    <User size={20} />
                                </Link>
                            </div>
                        </div>
                    </header>
                    <div className="dashboard-content fade-in">
                        {children}
                    </div>
                </main>
            </div>
        </SessionProvider>
    )
}
