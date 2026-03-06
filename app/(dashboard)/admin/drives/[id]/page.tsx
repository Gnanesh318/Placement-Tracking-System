'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Card from '@/app/components/Card'
import Badge from '@/app/components/Badge'
import { formatDate, formatCurrency } from '@/lib/utils'
import { 
    Building2, 
    Briefcase, 
    DollarSign, 
    Target, 
    Calendar, 
    Users, 
    CheckCircle2, 
    XCircle, 
    Clock, 
    ArrowUpRight, 
    Loader2, 
    ChevronLeft, 
    Filter, 
    Search,
    GraduationCap,
    Activity,
    UserCheck,
    AlertCircle,
    UserX,
    MoreVertical
} from 'lucide-react'
import Link from 'next/link'

export default function DriveManagementPage() {
    const params = useParams()
    const router = useRouter()
    const [drive, setDrive] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [updatingId, setUpdatingId] = useState<string | null>(null)

    const loadDrive = useCallback(() => {
        setLoading(true)
        fetch(`/api/drives/${params.id}`)
            .then((r) => r.json())
            .then((data) => {
                setDrive(data.drive)
                setLoading(false)
            })
            .catch(() => setLoading(false))
    }, [params.id])

    useEffect(() => {
        loadDrive()
    }, [loadDrive])

    const updateStatus = async (applicationId: string, status: string) => {
        setUpdatingId(applicationId)
        try {
            const response = await fetch(`/api/applications/${applicationId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status }),
            })

            if (response.ok) {
                loadDrive()
            } else {
                console.error('Failed to update status')
            }
        } catch (err) {
            console.error('An error occurred', err)
        } finally {
            setUpdatingId(null)
        }
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
                <p className="text-slate-500 font-medium">Loading drive management details...</p>
            </div>
        )
    }

    if (!drive) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
                    <Briefcase size={40} className="text-red-500" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Drive not found</h3>
                <p className="text-slate-500 max-w-sm mx-auto mb-8">
                    The placement drive you are looking for might have been removed or doesn't exist.
                </p>
                <button 
                    onClick={() => router.back()}
                    className="inline-flex items-center gap-2 text-blue-600 font-bold hover:underline"
                >
                    <ChevronLeft size={20} />
                    Go back to drives
                </button>
            </div>
        )
    }

    const statusCounts = drive.applications?.reduce((acc: any, app: any) => {
        acc[app.status] = (acc[app.status] || 0) + 1
        return acc
    }, {}) || {}

    return (
        <div className="space-y-8 fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => router.back()}
                        className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-all shadow-sm active:scale-95"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
                            Drive Management
                        </h1>
                        <p className="text-slate-500 font-medium flex items-center gap-2">
                            <Building2 size={16} />
                            {drive.company.companyName}
                            <span className="text-slate-300">•</span>
                            <span className="text-blue-600 font-bold">{drive.company.jobRole}</span>
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <span className={`px-3 py-1.5 rounded-xl text-xs font-bold border ${
                        drive.active 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                        : 'bg-slate-50 text-slate-600 border-slate-200'
                    }`}>
                        {drive.active ? 'Active Drive' : 'Inactive Drive'}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Drive Details */}
                <div className="lg:col-span-1 space-y-6">
                    <Card title="Drive Specifications" className="border-none shadow-xl shadow-slate-200/50">
                        <div className="space-y-6">
                            <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                                <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                                    <DollarSign size={24} />
                                </div>
                                <div>
                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">CTC Offered</div>
                                    <div className="text-xl font-black text-slate-900">{formatCurrency(drive.company.ctc)} LPA</div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100/50">
                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Min CGPA</div>
                                    <div className="flex items-center gap-2 text-blue-700 font-bold">
                                        <Target size={16} />
                                        {drive.eligibilityCgpa}
                                    </div>
                                </div>
                                <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100/50">
                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Drive Date</div>
                                    <div className="flex items-center gap-2 text-indigo-700 font-bold">
                                        <Calendar size={16} />
                                        {formatDate(drive.driveDate)}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                    <GraduationCap size={16} className="text-slate-400" />
                                    Target Departments
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {drive.allowedDepartments.map((dept: string) => (
                                        <span 
                                            key={dept} 
                                            className="px-3 py-1 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-600"
                                        >
                                            {dept}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card title="Application Funnel" className="border-none shadow-xl shadow-slate-200/50 overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-4 opacity-5">
                            <Activity size={80} />
                        </div>
                        <div className="space-y-4 relative z-10">
                            {[
                                { label: 'Total Applicants', value: drive.applications?.length || 0, icon: Users, color: 'blue' },
                                { label: 'Shortlisted', value: statusCounts['SHORTLISTED'] || 0, icon: Target, color: 'amber' },
                                { label: 'Selected', value: statusCounts['SELECTED'] || 0, icon: UserCheck, color: 'emerald' },
                            ].map((stat, i) => (
                                <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-lg bg-${stat.color}-50 flex items-center justify-center text-${stat.color}-600`}>
                                            <stat.icon size={20} />
                                        </div>
                                        <span className="text-sm font-bold text-slate-700">{stat.label}</span>
                                    </div>
                                    <div className="text-lg font-black text-slate-900">{stat.value}</div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                {/* Applications List */}
                <div className="lg:col-span-2">
                    <Card className="border-none shadow-xl shadow-slate-200/50 overflow-hidden">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                <Users size={20} className="text-blue-600" />
                                Candidate List
                            </h3>
                            <div className="flex items-center gap-2">
                                <div className="relative">
                                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input 
                                        type="text" 
                                        placeholder="Search candidate..." 
                                        className="pl-10 pr-4 py-2 bg-slate-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500 transition-all w-48 md:w-64"
                                    />
                                </div>
                            </div>
                        </div>

                        {!drive.applications || drive.applications.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 text-center opacity-60">
                                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                                    <Users size={40} className="text-slate-300" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">No Applications Yet</h3>
                                <p className="text-slate-500 max-w-xs mx-auto">
                                    Waiting for students to apply for this placement drive.
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto -mx-6">
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50/50 border-y border-slate-100">
                                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Candidate</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Academic Profile</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {drive.applications.map((app: any) => (
                                            <tr key={app.id} className="hover:bg-slate-50/50 transition-colors group">
                                                <td className="px-6 py-5 whitespace-nowrap">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold border border-blue-100">
                                                            {app.student.name.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <div className="text-sm font-bold text-slate-900">{app.student.name}</div>
                                                            <div className="text-xs text-slate-500 font-medium">#{app.student.registerNumber}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5 whitespace-nowrap">
                                                    <div className="text-sm font-semibold text-slate-700">{app.student.department}</div>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                                                            CGPA: {app.student.cgpa?.toFixed(2)}
                                                        </span>
                                                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                                                            Applied {formatDate(app.appliedDate)}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    {updatingId === app.id ? (
                                                        <div className="flex items-center gap-2 text-blue-600">
                                                            <Loader2 size={16} className="animate-spin" />
                                                            <span className="text-xs font-bold">Updating...</span>
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center gap-3">
                                                            <Badge status={app.status}>{app.status}</Badge>
                                                            <select
                                                                className="bg-slate-100 border-none rounded-lg px-2 py-1 text-[10px] font-bold text-slate-600 focus:ring-2 focus:ring-blue-500 cursor-pointer outline-none"
                                                                value={app.status}
                                                                onChange={(e) => updateStatus(app.id, e.target.value)}
                                                            >
                                                                <option value="APPLIED">APPLIED</option>
                                                                <option value="SHORTLISTED">SHORTLISTED</option>
                                                                <option value="INTERVIEWED">INTERVIEWED</option>
                                                                <option value="SELECTED">SELECTED</option>
                                                                <option value="REJECTED">REJECTED</option>
                                                            </select>
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-5 text-right">
                                                    <Link 
                                                        href={`/admin/students/${app.student.id}`}
                                                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all inline-block"
                                                        title="View Full Profile"
                                                    >
                                                        <ArrowUpRight size={20} />
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </Card>
                </div>
            </div>
        </div>
    )
}

