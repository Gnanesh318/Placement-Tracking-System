'use client'

import { useEffect, useState } from 'react'
import Card from '@/app/components/Card'
import Badge from '@/app/components/Badge'
import { formatDate, formatCurrency } from '@/lib/utils'
import { 
    FileText, 
    Search, 
    Filter, 
    Calendar, 
    Building2, 
    MapPin, 
    DollarSign,
    Loader2,
    Inbox,
    ChevronRight,
    Clock,
    CheckCircle2,
    AlertCircle,
    XCircle,
    Briefcase,
    Trophy,
    ArrowUpRight,
    ExternalLink
} from 'lucide-react'

export default function StudentApplicationsPage() {
    const [applications, setApplications] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [statusFilter, setStatusFilter] = useState('ALL')
    const [searchQuery, setSearchQuery] = useState('')

    useEffect(() => {
        fetch('/api/applications')
            .then((r) => r.json())
            .then((data) => {
                setApplications(data.applications || [])
                setLoading(false)
            })
    }, [])

    const filteredApplications = applications.filter((app) => {
        const matchesStatus = statusFilter === 'ALL' || app.status === statusFilter
        const matchesSearch = app.drive.company.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            app.drive.company.jobRole.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesStatus && matchesSearch
    })

    const statuses = [
        { id: 'ALL', label: 'All', icon: FileText },
        { id: 'APPLIED', label: 'Applied', icon: Clock },
        { id: 'SHORTLISTED', label: 'Shortlisted', icon: CheckCircle2 },
        { id: 'SELECTED', label: 'Selected', icon: Trophy },
        { id: 'REJECTED', label: 'Rejected', icon: XCircle }
    ]

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <div className="relative">
                    <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-ping" />
                    </div>
                </div>
                <p className="text-slate-500 font-bold mt-6 tracking-wide uppercase text-xs">Loading your applications...</p>
            </div>
        )
    }

    return (
        <div className="space-y-8 fade-in pb-20">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="min-w-0 flex-1">
                    <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3 mb-2">
                        <div className="w-11 h-11 bg-blue-600 rounded-xl flex items-center justify-center text-white flex-shrink-0 shadow-lg shadow-blue-600/20">
                            <FileText size={24} />
                        </div>
                        <span className="truncate">My Applications</span>
                    </h1>
                    <p className="text-slate-500 text-sm">
                        Keep track of your journey with various placement drives.
                    </p>
                </div>
                
                <div className="flex items-center gap-3 w-full md:w-auto flex-shrink-0">
                    <div className="relative flex-1 md:w-80 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors z-10" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search company or role..."
                            className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-600 transition-all outline-none font-medium text-slate-700"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Status Tabs */}
            <div className="flex items-center gap-3 overflow-x-auto pb-4 scrollbar-hide">
                {statuses.map((status) => {
                    const Icon = status.icon
                    const isActive = statusFilter === status.id
                    const count = status.id === 'ALL' 
                        ? applications.length 
                        : applications.filter(app => app.status === status.id).length

                    return (
                        <button
                            key={status.id}
                            onClick={() => setStatusFilter(status.id)}
                            className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-black whitespace-nowrap transition-all duration-300 border-2 ${
                                isActive 
                                    ? 'bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-200 -translate-y-1' 
                                    : 'bg-white text-slate-600 border-slate-100 hover:border-blue-200 hover:bg-slate-50'
                            }`}
                        >
                            <Icon size={18} strokeWidth={isActive ? 3 : 2} />
                            <span className="text-sm tracking-tight">{status.label}</span>
                            <span className={`ml-1 px-2.5 py-0.5 rounded-lg text-xs font-black ${
                                isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-400'
                            }`}>
                                {count}
                            </span>
                        </button>
                    )
                })}
            </div>

            {filteredApplications.length === 0 ? (
                <Card className="border-none shadow-xl shadow-slate-200/50 py-24">
                    <div className="flex flex-col items-center justify-center text-center">
                        <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-8 text-slate-300">
                            <Inbox size={48} strokeWidth={1.5} />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900">No Applications Found</h3>
                        <p className="text-slate-500 max-w-sm mx-auto mt-3 leading-relaxed font-medium">
                            {searchQuery 
                                ? `No applications matching "${searchQuery}" found.`
                                : statusFilter === 'ALL' 
                                    ? "You haven't applied to any placement drives yet. Start exploring!" 
                                    : `You don't have any applications currently in "${statusFilter}" status.`}
                        </p>
                    </div>
                </Card>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {filteredApplications.map((app) => (
                        <Card key={app.id} className="group hover:shadow-xl hover:shadow-blue-200/10 transition-all duration-300 border-none bg-white p-0 overflow-hidden">
                            <div className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                                <div className="flex items-center gap-5 min-w-0 flex-1">
                                    <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center text-white font-black text-2xl border border-transparent group-hover:shadow-lg transition-all duration-300 flex-shrink-0">
                                        {app.drive.company.companyName.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                                            <h3 className="text-xl font-black text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                                                {app.drive.company.companyName}
                                            </h3>
                                            <Badge status={app.status} className="flex-shrink-0">{app.status}</Badge>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm font-bold text-slate-400">
                                            <div className="flex items-center gap-1.5 whitespace-nowrap">
                                                <Briefcase size={14} className="text-slate-300 flex-shrink-0" />
                                                <span className="truncate">{app.drive.company.jobRole}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 whitespace-nowrap">
                                                <DollarSign size={14} className="text-emerald-500 flex-shrink-0" />
                                                <span className="text-emerald-600">{formatCurrency(app.drive.company.ctc)}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 whitespace-nowrap">
                                                <Calendar size={14} className="text-slate-300 flex-shrink-0" />
                                                <span>Applied {formatDate(app.appliedDate)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 w-full md:w-auto flex-shrink-0">
                                    <button className="btn btn-primary flex-1 md:flex-none">
                                        <span>View Details</span>
                                        <ArrowUpRight size={18} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                    </button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
