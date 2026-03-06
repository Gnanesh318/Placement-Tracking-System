'use client'

import { SessionProvider } from 'next-auth/react'
import Sidebar from '../components/Sidebar'
import { Bell, Search, User } from 'lucide-react'

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <SessionProvider>
            <div className="dashboard-layout">
                <Sidebar />
                <main
                    className="dashboard-main bg-slate-50"
                    id="main-content"
                    role="main"
                    aria-label="Placement portal dashboard"
                >
                    <header className="dashboard-header glass shadow-sm">
                        <div className="dashboard-header-content">
                            <div className="dashboard-header-left">
                                <div className="search-bar">
                                    <Search size={18} className="text-gray-400" />
                                    <input type="text" placeholder="Search anything..." className="search-input" />
                                </div>
                            </div>
                            <div className="dashboard-header-right">
                                <button className="icon-btn" aria-label="Notifications">
                                    <Bell size={20} className="text-gray-600" />
                                    <span className="notification-dot"></span>
                                </button>
                                <div className="divider"></div>
                                <button className="profile-btn" aria-label="User profile">
                                    <User size={20} className="text-gray-600" />
                                </button>
                            </div>
                        </div>
                    </header>
                    <div className="dashboard-content fade-in">
                        {children}
                    </div>
                </main>
            </div>
            <style jsx>{`
                .dashboard-header {
                    height: 70px;
                    width: 100%;
                    position: sticky;
                    top: 0;
                    z-index: 50;
                    border-bottom: 1px solid var(--color-border);
                    background: rgba(255, 255, 255, 0.8);
                    backdrop-filter: blur(12px);
                    -webkit-backdrop-filter: blur(12px);
                }
                
                .dashboard-header-content {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    width: 100%;
                    height: 100%;
                    padding: 0 2rem;
                    max-width: 1400px;
                    margin: 0 auto;
                }
                
                .dashboard-header-left,
                .dashboard-header-right {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }
                
                .search-bar {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    background: #f1f5f9;
                    padding: 0.5rem 1rem;
                    border-radius: 10px;
                    width: 300px;
                    border: 1px solid transparent;
                    transition: all 0.2s ease;
                }
                
                .search-bar:focus-within {
                    background: white;
                    border-color: var(--color-primary);
                    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
                }
                
                .search-input {
                    background: transparent;
                    border: none;
                    outline: none;
                    font-size: 0.875rem;
                    width: 100%;
                    color: var(--color-text);
                }
                
                .icon-btn {
                    position: relative;
                    background: transparent;
                    border: none;
                    cursor: pointer;
                    padding: 0.5rem;
                    border-radius: 8px;
                    transition: all 0.2s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                .icon-btn:hover {
                    background: #f1f5f9;
                }
                
                .notification-dot {
                    position: absolute;
                    top: 8px;
                    right: 8px;
                    width: 8px;
                    height: 8px;
                    background: #ef4444;
                    border-radius: 50%;
                    border: 2px solid white;
                }
                
                .divider {
                    width: 1px;
                    height: 24px;
                    background: var(--color-border);
                }
                
                .profile-btn {
                    background: #f1f5f9;
                    border: none;
                    cursor: pointer;
                    padding: 0.5rem;
                    border-radius: 50%;
                    transition: all 0.2s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                .profile-btn:hover {
                    background: #e2e8f0;
                }
                
                @media (max-width: 768px) {
                    .dashboard-header-content {
                        padding: 0 1rem;
                    }
                    
                    .search-bar {
                        width: 200px;
                    }
                }
            `}</style>
        </SessionProvider>
    )
}
