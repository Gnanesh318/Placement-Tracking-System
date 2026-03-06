'use client'

import { useEffect, useState } from 'react'
import Card from '@/app/components/Card'
import { Bar } from 'react-chartjs-2'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js'
import { getDomainLabel, formatDate } from '@/lib/utils'
import Badge from '@/app/components/Badge'
import { 
    Users, 
    Briefcase, 
    Building2, 
    TrendingUp, 
    FileText, 
    PieChart, 
    Calendar,
    ArrowRight,
    Loader2,
    LayoutDashboard,
    AlertCircle,
    UserCheck,
    BarChart3,
    History
} from 'lucide-react'
import Link from 'next/link'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export default function AdminDashboard() {
    const [analytics, setAnalytics] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch('/api/admin/analytics')
            .then((r) => r.json())
            .then((data) => {
                setAnalytics(data)
                setLoading(false)
            })
    }, [])

    if (loading || !analytics) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
                <p className="text-slate-500 font-medium">Loading analytics...</p>
            </div>
        )
    }

    const chartData = {
        labels: analytics.domainDistribution.map((d: any) =>
            getDomainLabel(d.domain)
        ),
        datasets: [
            {
                label: 'Number of Students',
                data: analytics.domainDistribution.map((d: any) => d.count),
                backgroundColor: 'rgba(37, 99, 235, 0.8)',
                borderRadius: 8,
                hoverBackgroundColor: 'rgba(37, 99, 235, 1)',
            },
        ],
    }

    const kpis = [
        { label: 'Total Students', value: analytics.kpis.totalStudents, icon: Users, color: 'blue', trend: 'Registered' },
        { label: 'Placed Students', value: analytics.kpis.placedStudents, icon: UserCheck, color: 'emerald', trend: 'Successful' },
        { label: 'Total Companies', value: analytics.kpis.totalCompanies, icon: Building2, color: 'amber', trend: 'Recruiters' },
        { label: 'Active Drives', value: analytics.kpis.activeDrives, icon: Briefcase, color: 'purple', trend: 'In Progress' },
        { label: 'Total Applications', value: analytics.kpis.totalApplications, icon: FileText, color: 'cyan', trend: 'Total' },
        {
            label: 'Placement Rate',
            value: `${Math.round((analytics.kpis.placedStudents / analytics.kpis.totalStudents) * 100)}%`,
            icon: TrendingUp,
            color: 'rose',
            trend: 'Overall'
        },
    ]

    return (
        <div className="space-y-8 fade-in">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                        <BarChart3 className="text-blue-600" size={32} />
                        Admin Dashboard
                    </h1>
                    <p className="text-slate-500 mt-1">
                        Real-time analytics and placement activities overview.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="inline-flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-5 py-2.5 rounded-xl font-semibold hover:bg-slate-50 transition-all active:scale-95">
                        Export Report
                    </button>
                    <Link 
                        href="/admin/drives/new" 
                        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-lg shadow-blue-600/20 active:scale-95"
                    >
                        Create Drive
                    </Link>
                </div>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {kpis.map((kpi, index) => {
                    const Icon = kpi.icon;
                    const colorVariants = {
                        blue: { bg: 'bg-blue-50', bgMed: 'bg-blue-100', text: 'text-blue-600', textDark: 'text-blue-700' },
                        emerald: { bg: 'bg-emerald-50', bgMed: 'bg-emerald-100', text: 'text-emerald-600', textDark: 'text-emerald-700' },
                        amber: { bg: 'bg-amber-50', bgMed: 'bg-amber-100', text: 'text-amber-600', textDark: 'text-amber-700' },
                        purple: { bg: 'bg-purple-50', bgMed: 'bg-purple-100', text: 'text-purple-600', textDark: 'text-purple-700' },
                        cyan: { bg: 'bg-cyan-50', bgMed: 'bg-cyan-100', text: 'text-cyan-600', textDark: 'text-cyan-700' },
                        rose: { bg: 'bg-rose-50', bgMed: 'bg-rose-100', text: 'text-rose-600', textDark: 'text-rose-700' }
                    }[kpi.color as keyof typeof colorVariants] || { bg: 'bg-slate-50', bgMed: 'bg-slate-100', text: 'text-slate-600', textDark: 'text-slate-700' };

                    return (
                        <Card key={index} className="relative overflow-hidden group hover:shadow-xl transition-all duration-300 border-none bg-white">
                            <div className={`absolute top-0 right-0 w-28 h-28 ${colorVariants.bg} rounded-full -mr-10 -mt-10 transition-transform group-hover:scale-110 opacity-60`} />
                            <div className="relative z-10 flex items-center gap-4">
                                <div className={`w-14 h-14 ${colorVariants.bgMed} rounded-xl flex items-center justify-center ${colorVariants.text} flex-shrink-0 shadow-sm`}>
                                    <Icon size={26} strokeWidth={2} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-2xl font-extrabold text-slate-900 leading-tight">
                                        {kpi.value}
                                    </div>
                                    <div className="text-xs font-semibold text-slate-500 mt-1.5 uppercase tracking-wider truncate">
                                        {kpi.label}
                                    </div>
                                </div>
                                <div className={`text-[10px] font-bold px-2.5 py-1 ${colorVariants.bg} ${colorVariants.textDark} rounded-md self-start flex-shrink-0`}>
                                    {kpi.trend}
                                </div>
                            </div>
                        </Card>
                    );
                })}
            </div>

            {/* Middle Section: Charts & Placements */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border-none shadow-xl shadow-slate-200/50">
                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2.5">
                            <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center">
                                <PieChart className="text-blue-600" size={20} />
                            </div>
                            <span>Domain Distribution</span>
                        </h3>
                    </div>
                    <div className="p-3">
                        <Bar
                            data={chartData}
                            options={{
                                responsive: true,
                                maintainAspectRatio: true,
                                plugins: {
                                    legend: { display: false },
                                    tooltip: {
                                        backgroundColor: '#1e293b',
                                        padding: 12,
                                        titleFont: { size: 14, weight: 'bold' },
                                        bodyFont: { size: 13 },
                                        cornerRadius: 8,
                                        displayColors: false
                                    }
                                },
                                scales: {
                                    y: {
                                        beginAtZero: true,
                                        ticks: { stepSize: 1, color: '#94a3b8', font: { size: 12 } },
                                        grid: { color: '#f1f5f9', drawBorder: false }
                                    },
                                    x: {
                                        ticks: { color: '#64748b', font: { weight: '600', size: 11 } },
                                        grid: { display: false }
                                    }
                                },
                            }}
                        />
                    </div>
                </Card>

                <Card className="border-none shadow-xl shadow-slate-200/50">
                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2.5">
                            <div className="w-9 h-9 bg-emerald-50 rounded-lg flex items-center justify-center">
                                <UserCheck className="text-emerald-600" size={20} />
                            </div>
                            <span>Recent Placements</span>
                        </h3>
                        <Link href="/admin/students?status=PLACED" className="text-blue-600 text-sm font-semibold hover:underline transition-colors">
                            View All
                        </Link>
                    </div>
                    
                    {analytics.recentActivity.placements.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                                <AlertCircle className="text-slate-300" size={32} />
                            </div>
                            <p className="text-slate-500 font-medium">No placements yet</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {analytics.recentActivity.placements.map((placement: any) => (
                                <div
                                    key={placement.id}
                                    className="flex items-center justify-between p-4 bg-slate-50/50 rounded-xl hover:bg-slate-50 transition-all duration-200 border border-transparent hover:border-slate-200"
                                >
                                    <div className="flex items-center gap-3 min-w-0 flex-1">
                                        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 border-2 border-emerald-100 flex items-center justify-center text-white font-bold text-sm shadow-sm flex-shrink-0">
                                            {placement.student.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="font-bold text-slate-900 truncate">{placement.student.name}</div>
                                            <div className="text-xs font-medium text-slate-500 truncate">
                                                {placement.drive.company.companyName} • {placement.drive.company.jobRole}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right flex-shrink-0 ml-4">
                                        <div className="font-bold text-emerald-600 text-sm">₹{placement.drive.company.ctc} LPA</div>
                                        <div className="text-[10px] font-semibold text-slate-400 uppercase mt-0.5">
                                            {formatDate(placement.updatedAt)}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </Card>
            </div>

            {/* Bottom Section: Recent Applications */}
            <Card className="border-none shadow-xl shadow-slate-200/50 overflow-hidden">
                <div className="flex items-center justify-between p-6 pb-4 border-b border-slate-100">
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2.5">
                        <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center">
                            <History className="text-blue-600" size={20} />
                        </div>
                        <span>Recent Applications</span>
                    </h3>
                    <Link href="/admin/students" className="text-blue-600 text-sm font-semibold hover:underline transition-colors">
                        View All Applications
                    </Link>
                </div>

                {analytics.recentActivity.applications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                            <AlertCircle className="text-slate-300" size={32} />
                        </div>
                        <p className="text-slate-500 font-medium">No recent applications found</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50 border-b border-slate-100">
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Student Info</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Company & Role</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Applied Date</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {analytics.recentActivity.applications.map((app: any) => (
                                    <tr key={app.id} className="hover:bg-blue-50/30 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm flex-shrink-0">
                                                    {app.student.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="min-w-0">
                                                    <div className="font-bold text-slate-900 truncate">{app.student.name}</div>
                                                    <div className="text-xs text-slate-500 font-medium truncate">{app.student.registerNumber}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-slate-700 truncate">{app.drive.company.companyName}</div>
                                            <div className="text-xs text-slate-500 font-medium truncate">{app.drive.company.jobRole}</div>
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
                                        <td className="px-6 py-4 text-right">
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
