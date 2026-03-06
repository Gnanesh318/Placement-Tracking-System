'use client'

import { useEffect, useState } from 'react'
import Card from '@/app/components/Card'
import Badge from '@/app/components/Badge'
import { formatDate } from '@/lib/utils'
import { 
    FileText, 
    Briefcase, 
    CheckCircle2, 
    Clock, 
    TrendingUp, 
    Calendar,
    ArrowRight,
    Loader2,
    LayoutDashboard,
    AlertCircle
} from 'lucide-react'
import Link from 'next/link'

export default function StudentDashboard() {
    const [applications, setApplications] = useState<any[]>([])
    const [drives, setDrives] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        Promise.all([
            fetch('/api/applications').then((r) => r.json()),
            fetch('/api/drives').then((r) => r.json()),
        ]).then(([appData, drivesData]) => {
            setApplications(appData.applications || [])
            setDrives(drivesData.drives || [])
            setLoading(false)
        })
    }, [])

    const statusCount = applications.reduce((acc, app) => {
        acc[app.status] = (acc[app.status] || 0) + 1
        return acc
    }, {} as Record<string, number>)

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
                <p className="text-slate-500 font-medium">Loading your dashboard...</p>
            </div>
        )
    }

    return (
        <div className="space-y-8 fade-in">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                        <LayoutDashboard className="text-blue-600" size={32} />
                        Student Dashboard
                    </h1>
                    <p className="text-slate-500 mt-1">
                        Welcome back! Here's what's happening with your placement progress.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Link 
                        href="/student/drives" 
                        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-lg shadow-blue-600/20 active:scale-95"
                    >
                        Explore Drives
                        <ArrowRight size={18} />
                    </Link>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { 
                        label: 'Total Applications', 
                        value: applications.length, 
                        icon: FileText, 
                        color: 'blue',
                        trend: 'Submitted'
                    },
                    { 
                        label: 'Eligible Drives', 
                        value: drives.length, 
                        icon: Briefcase, 
                        color: 'emerald',
                        trend: 'Active'
                    },
                    { 
                        label: 'Shortlisted', 
                        value: statusCount['SHORTLISTED'] || 0, 
                        icon: CheckCircle2, 
                        color: 'amber',
                        trend: 'Success'
                    }
                ].map((stat, i) => {
                    const Icon = stat.icon;
                    const bgLight = { blue: 'bg-blue-50', emerald: 'bg-emerald-50', amber: 'bg-amber-50' }[stat.color as 'blue' | 'emerald' | 'amber'];
                    const bgMed = { blue: 'bg-blue-100', emerald: 'bg-emerald-100', amber: 'bg-amber-100' }[stat.color as 'blue' | 'emerald' | 'amber'];
                    const textMain = { blue: 'text-blue-600', emerald: 'text-emerald-600', amber: 'text-amber-600' }[stat.color as 'blue' | 'emerald' | 'amber'];
                    const textDark = { blue: 'text-blue-700', emerald: 'text-emerald-700', amber: 'text-amber-700' }[stat.color as 'blue' | 'emerald' | 'amber'];

                    return (
                        <Card key={i} className="relative overflow-hidden group hover:shadow-xl transition-all duration-300 border-none bg-white">
                            <div className={`absolute top-0 right-0 w-28 h-28 ${bgLight} rounded-full -mr-10 -mt-10 transition-transform group-hover:scale-110 opacity-60`} />
                            <div className="relative z-10">
                                <div className={`w-12 h-12 ${bgMed} rounded-xl flex items-center justify-center ${textMain} mb-5 shadow-sm`}>
                                    <Icon size={24} strokeWidth={2} />
                                </div>
                                <div className="flex items-end justify-between gap-3">
                                    <div className="min-w-0 flex-1">
                                        <div className="text-3xl font-extrabold text-slate-900 leading-tight">
                                            {stat.value}
                                        </div>
                                        <div className="text-sm font-semibold text-slate-500 mt-2 uppercase tracking-wider truncate">
                                            {stat.label}
                                        </div>
                                    </div>
                                    <div className={`text-xs font-bold px-2.5 py-1 ${bgLight} ${textDark} rounded-md flex-shrink-0`}>
                                        {stat.trend}
                                    </div>
                                </div>
                            </div>
                        </Card>
                    );
                })}
            </div>

            {/* Recent Activity Section */}
            <Card className="border-none shadow-xl shadow-slate-200/50 overflow-hidden">
                <div className="flex items-center justify-between p-6 pb-4 border-b border-slate-100">
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2.5">
                        <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center">
                            <Clock className="text-blue-600" size={20} />
                        </div>
                        <span>Recent Applications</span>
                    </h3>
                    <Link href="/student/applications" className="text-blue-600 text-sm font-semibold hover:underline transition-colors">
                        View All
                    </Link>
                </div>

                {applications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-5">
                            <AlertCircle className="text-slate-300" size={40} />
                        </div>
                        <h4 className="text-lg font-semibold text-slate-900 mb-2">No Applications Yet</h4>
                        <p className="text-slate-500 max-w-xs mx-auto mb-6">
                            You haven't applied to any placement drives. Start exploring opportunities now!
                        </p>
                        <Link 
                            href="/student/drives" 
                            className="inline-flex items-center gap-2 text-blue-600 font-bold hover:gap-3 transition-all"
                        >
                            Browse Placement Drives <ArrowRight size={18} />
                        </Link>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50 border-b border-slate-100">
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Company & Role</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Package (CTC)</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Applied Date</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {applications.slice(0, 5).map((app) => (
                                    <tr key={app.id} className="hover:bg-blue-50/30 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-11 h-11 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-sm flex-shrink-0">
                                                    {app.drive.company.companyName.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="min-w-0">
                                                    <div className="font-bold text-slate-900 truncate">{app.drive.company.companyName}</div>
                                                    <div className="text-sm text-slate-500 truncate">{app.drive.company.jobRole}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-semibold text-slate-700">₹{app.drive.company.ctc} LPA</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge status={app.status}>{app.status}</Badge>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-sm text-slate-500">
                                                <Calendar size={14} className="flex-shrink-0" />
                                                <span className="whitespace-nowrap">{formatDate(app.appliedDate)}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all inline-flex items-center justify-center">
                                                <ArrowRight size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </Card>
        </div>
    )
}
