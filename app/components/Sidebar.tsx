'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import { 
    LayoutDashboard, 
    Briefcase, 
    FileText, 
    Users, 
    Building2, 
    LogOut,
    GraduationCap,
    ChevronRight,
    Settings
} from 'lucide-react'

export default function Sidebar() {
    const pathname = usePathname()
    const { data: session } = useSession()

    const isAdmin = session?.user?.role === 'ADMIN'

    const studentNav = [
        { href: '/student', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/student/drives', label: 'Placement Drives', icon: Briefcase },
        { href: '/student/applications', label: 'My Applications', icon: FileText },
    ]

    const adminNav = [
        { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/admin/students', label: 'Students', icon: Users },
        { href: '/admin/drives', label: 'Placement Drives', icon: Briefcase },
        { href: '/admin/companies', label: 'Companies', icon: Building2 },
    ]

    const navItems = isAdmin ? adminNav : studentNav

    return (
        <aside className="sidebar-container" aria-label="Main navigation">
            <div className="sidebar-brand">
                <div className="brand-logo" aria-hidden="true">
                    <GraduationCap size={22} className="text-white" />
                </div>
                <div className="brand-text">
                    <h2 className="sidebar-brand-title">Lumina</h2>
                    <p className="sidebar-brand-subtitle">Placement Portal</p>
                </div>
            </div>

            <nav className="sidebar-nav">
                <div className="nav-section-title">Menu</div>
                {navItems.map((item) => {
                    const isActive = pathname === item.href
                    const Icon = item.icon
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`sidebar-nav-link ${isActive ? 'active' : ''}`}
                        >
                            <span className="sidebar-nav-icon">
                                <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                            </span>
                            <span className="sidebar-nav-label">
                                {item.label}
                            </span>
                            {isActive && <ChevronRight size={14} className="ml-auto opacity-70" />}
                        </Link>
                    )
                })}
            </nav>

            <div className="sidebar-footer">
                <div className="sidebar-user-card">
                    <div className="user-avatar">
                        {session?.user?.name?.charAt(0) || 'U'}
                    </div>
                    <div className="sidebar-user-info">
                        <p className="sidebar-user-name">{session?.user?.name}</p>
                        <p className="sidebar-user-role">
                            {isAdmin ? 'Administrator' : 'Student'}
                        </p>
                    </div>
                    <button className="user-settings-btn">
                        <Settings size={16} />
                    </button>
                </div>
                <button
                    onClick={() => signOut()}
                    className="sidebar-logout-btn"
                >
                    <LogOut size={16} />
                    <span>Logout</span>
                </button>
            </div>

        </aside>
    )
}
