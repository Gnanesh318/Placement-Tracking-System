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
    ChevronRight
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
        <aside className="sidebar-container shadow-xl" aria-label="Main navigation">
            <div className="sidebar-brand">
                <div className="brand-logo" aria-hidden="true">
                    <GraduationCap size={24} />
                </div>
                <div className="brand-text">
                    <h2 className="sidebar-brand-title">IPIMP</h2>
                    <p className="sidebar-brand-subtitle">Placement Portal</p>
                </div>
            </div>

            <nav className="sidebar-nav">
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
                                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                            </span>
                            <span className="sidebar-nav-label">
                                {item.label}
                            </span>
                            {isActive && <ChevronRight size={16} className="ml-auto opacity-50" />}
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
                </div>
                <button
                    onClick={() => signOut()}
                    className="sidebar-logout-btn"
                >
                    <LogOut size={18} />
                    <span>Logout</span>
                </button>
            </div>

            <style jsx>{`
                .sidebar-container {
                    width: 260px;
                    height: 100vh;
                    background: #020617;
                    color: #e5e7eb;
                    display: flex;
                    flex-direction: column;
                    position: fixed;
                    inset-block: 0;
                    left: 0;
                    z-index: 90;
                    border-right: 1px solid rgba(15, 23, 42, 0.85);
                    box-shadow: 0 0 40px rgba(15, 23, 42, 0.8);
                }

                .sidebar-brand {
                    padding: 1.6rem 1.4rem 1.4rem;
                    display: flex;
                    align-items: center;
                    gap: 0.9rem;
                    border-bottom: 1px solid rgba(30, 64, 175, 0.6);
                    background: radial-gradient(circle at top left, #1d4ed8 0, transparent 55%);
                }

                .brand-logo {
                    width: 2.4rem;
                    height: 2.4rem;
                    border-radius: 0.9rem;
                    background: radial-gradient(circle at 30% 0, #6366f1 0, #4f46e5 45%, #0ea5e9 100%);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #f9fafb;
                    box-shadow: 0 16px 35px rgba(79, 70, 229, 0.6);
                }

                .sidebar-brand-title {
                    font-size: 1.05rem;
                    font-weight: 800;
                    margin: 0;
                    color: #f9fafb;
                    letter-spacing: -0.04em;
                }

                .sidebar-brand-subtitle {
                    font-size: 0.7rem;
                    opacity: 0.6;
                    margin: 0;
                    text-transform: uppercase;
                    letter-spacing: 0.14em;
                    color: #9ca3af;
                }

                .sidebar-nav {
                    padding: 1.3rem 0.9rem 1.1rem;
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }

                .sidebar-nav-link {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    padding: 0.85rem 1rem;
                    margin-inline: 0.25rem;
                    border-radius: 0.9rem;
                    color: #9ca3af;
                    text-decoration: none;
                    font-size: 0.9rem;
                    font-weight: 500;
                    transition: background 0.15s ease, color 0.15s ease, transform 0.08s ease;
                }

                .sidebar-nav-link:hover {
                    background: rgba(15, 23, 42, 0.9);
                    color: #e5e7eb;
                    transform: translateY(-1px);
                }

                .sidebar-nav-link.active {
                    background: linear-gradient(90deg, rgba(37, 99, 235, 0.18), rgba(79, 70, 229, 0.1));
                    color: #e5e7eb;
                    box-shadow: inset 0 0 0 1px rgba(37, 99, 235, 0.7);
                }

                .sidebar-footer {
                    padding: 1.2rem 1rem 1.4rem;
                    border-top: 1px solid rgba(15, 23, 42, 0.9);
                    background: radial-gradient(circle at bottom, rgba(79, 70, 229, 0.3) 0, transparent 55%);
                }

                .sidebar-user-card {
                    display: flex;
                    align-items: center;
                    gap: 0.8rem;
                    margin-bottom: 0.9rem;
                }

                .user-avatar {
                    width: 2.3rem;
                    height: 2.3rem;
                    border-radius: 0.9rem;
                    background: radial-gradient(circle at 30% 0, #1d4ed8 0, #020617 65%);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 700;
                    font-size: 0.95rem;
                    color: #f9fafb;
                    box-shadow: 0 10px 24px rgba(15, 23, 42, 0.9);
                }

                .sidebar-user-name {
                    font-size: 0.9rem;
                    font-weight: 600;
                    margin: 0;
                    color: #e5e7eb;
                }

                .sidebar-user-role {
                    font-size: 0.75rem;
                    margin: 0.1rem 0 0;
                    color: #9ca3af;
                }

                .sidebar-logout-btn {
                    width: 100%;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.4rem;
                    padding: 0.55rem 0.9rem;
                    border-radius: 999px;
                    border: 1px solid rgba(248, 113, 113, 0.6);
                    background: rgba(127, 29, 29, 0.14);
                    color: #fecaca;
                    font-size: 0.8rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: background 0.15s ease, border-color 0.15s ease, transform 0.08s ease, box-shadow 0.1s ease;
                }

                .sidebar-logout-btn:hover {
                    background: rgba(248, 113, 113, 0.18);
                    border-color: #fca5a5;
                    box-shadow: 0 10px 26px rgba(127, 29, 29, 0.55);
                    transform: translateY(-1px);
                }
            `}</style>
        </aside>
    )
}
