'use client'

import Card from '@/app/components/Card'
import { 
    Bell, 
    CheckCircle2, 
    Briefcase, 
    Calendar, 
    Building2,
    AlertCircle,
    Info,
    Check
} from 'lucide-react'

const MOCK_NOTIFICATIONS = [
    {
        id: 1,
        type: 'success',
        title: 'Application Shortlisted',
        message: 'Congratulations! Your application for Software Engineer at Google has been shortlisted for the next round.',
        time: '2 hours ago',
        isRead: false,
        icon: CheckCircle2,
        color: 'emerald'
    },
    {
        id: 2,
        type: 'info',
        title: 'New Placement Drive Scheduled',
        message: 'Microsoft has scheduled a new campus drive for SDE roles. Check eligibility and apply before Friday.',
        time: '5 hours ago',
        isRead: false,
        icon: Briefcase,
        color: 'blue'
    },
    {
        id: 3,
        type: 'warning',
        title: 'Interview Scheduled',
        message: 'Your technical interview with Amazon is scheduled for tomorrow at 10:00 AM. Check your email for the meeting link.',
        time: '1 day ago',
        isRead: true,
        icon: Calendar,
        color: 'amber'
    },
    {
        id: 4,
        type: 'neutral',
        title: 'Company Profile Updated',
        message: 'TCS has updated their job description and CTC details for the upcoming Ninja drive.',
        time: '2 days ago',
        isRead: true,
        icon: Building2,
        color: 'slate'
    },
    {
        id: 5,
        type: 'alert',
        title: 'Profile Incomplete',
        message: 'Please update your resume and latest CGPA to participate in upcoming drives.',
        time: '3 days ago',
        isRead: true,
        icon: AlertCircle,
        color: 'rose'
    }
]

export default function NotificationsPage() {
    return (
        <div className="space-y-8 fade-in max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                        <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                            <Bell className="text-blue-600" size={24} />
                        </div>
                        Notifications Center
                    </h1>
                    <p className="text-slate-500 mt-2 font-medium">
                        Stay updated with your latest placement activities and alerts.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-all shadow-sm">
                        <Check size={18} />
                        Mark all as read
                    </button>
                </div>
            </div>

            <Card className="border-none shadow-xl shadow-slate-200/50 p-0 overflow-hidden bg-white">
                <div className="divide-y divide-slate-100">
                    {MOCK_NOTIFICATIONS.map((notification) => {
                        const Icon = notification.icon;
                        
                        const colorStyles = {
                            emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
                            blue: 'bg-blue-50 text-blue-600 border-blue-100',
                            amber: 'bg-amber-50 text-amber-600 border-amber-100',
                            rose: 'bg-rose-50 text-rose-600 border-rose-100',
                            slate: 'bg-slate-50 text-slate-600 border-slate-200',
                        }[notification.color] || 'bg-slate-50 text-slate-600';

                        return (
                            <div 
                                key={notification.id} 
                                className={`p-6 flex gap-5 transition-all duration-300 hover:bg-slate-50/80 ${!notification.isRead ? 'bg-blue-50/10' : ''}`}
                            >
                                <div className="flex-shrink-0 mt-1">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center border shadow-sm ${colorStyles}`}>
                                        <Icon size={22} />
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-4 mb-1">
                                        <h3 className={`text-lg font-bold truncate ${!notification.isRead ? 'text-slate-900' : 'text-slate-700'}`}>
                                            {notification.title}
                                        </h3>
                                        <span className="text-xs font-bold text-slate-400 whitespace-nowrap flex-shrink-0">
                                            {notification.time}
                                        </span>
                                    </div>
                                    <p className={`text-[15px] leading-relaxed ${!notification.isRead ? 'text-slate-700 font-medium' : 'text-slate-500'}`}>
                                        {notification.message}
                                    </p>
                                    
                                    {!notification.isRead && (
                                        <div className="mt-4 flex items-center gap-3">
                                            <button className="text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors">
                                                View Details
                                            </button>
                                            <span className="text-slate-300">•</span>
                                            <button className="text-sm font-bold text-slate-500 hover:text-slate-700 transition-colors">
                                                Mark as read
                                            </button>
                                        </div>
                                    )}
                                </div>
                                {!notification.isRead && (
                                    <div className="flex-shrink-0 flex items-center justify-center w-4">
                                        <div className="w-2.5 h-2.5 bg-blue-600 rounded-full shadow-[0_0_8px_rgba(37,99,235,0.6)] animate-pulse"></div>
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            </Card>
        </div>
    )
}
