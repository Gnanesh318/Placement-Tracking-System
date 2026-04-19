'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Card from '@/app/components/Card'
import Badge from '@/app/components/Badge'
import { getDomainLabel, formatDate, formatCurrency } from '@/lib/utils'
import { 
    User, 
    GraduationCap, 
    Calendar, 
    Award, 
    Briefcase, 
    Target, 
    ChevronLeft, 
    Building2, 
    DollarSign, 
    Clock, 
    ArrowUpRight, 
    Loader2,
    CheckCircle2,
    Activity,
    FileText,
    History
} from 'lucide-react'
import Link from 'next/link'

export default function StudentIntelligencePage() {
    const params = useParams()
    const router = useRouter()
    const [data, setData] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch(`/api/admin/students/${params.id}`)
            .then((r) => r.json())
            .then((data) => {
                setData(data)
                setLoading(false)
            })
            .catch(() => setLoading(false))
    }, [params.id])

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
                <p className="text-slate-500 font-medium">Analyzing student intelligence...</p>
            </div>
        )
    }

    if (!data || !data.student) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
                    <User size={40} className="text-red-500" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Student not found</h3>
                <p className="text-slate-500 max-w-sm mx-auto mb-8">
                    The student profile you are looking for might have been removed or doesn&apos;t exist.
                </p>
                <button 
                    onClick={() => router.back()}
                    className="inline-flex items-center gap-2 text-blue-600 font-bold hover:underline"
                >
                    <ChevronLeft size={20} />
                    Go back to list
                </button>
            </div>
        )
    }

    const { student, intelligence } = data

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
                        <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                            Student Intelligence
                        </h1>
                        <p className="text-slate-500 font-medium">
                            Comprehensive profile and placement performance analytics
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Badge status={student.placementStatus}>
                        {student.placementStatus.replace('_', ' ')}
                    </Badge>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Profile Card */}
                <div className="lg:col-span-1 space-y-6">
                    <Card className="text-center overflow-hidden border-none shadow-xl shadow-slate-200/50">
                        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-blue-600 to-indigo-700" />
                        <div className="relative pt-8">
                            <div className="relative inline-block">
                                <div className="w-32 h-32 rounded-3xl bg-white p-1 shadow-2xl mx-auto">
                                    <div className="w-full h-full rounded-2xl bg-slate-50 flex items-center justify-center text-4xl font-black text-blue-600 border border-slate-100">
                                        {student.name.charAt(0)}
                                    </div>
                                </div>
                                <div className={`absolute -bottom-2 -right-2 w-10 h-10 rounded-2xl border-4 border-white flex items-center justify-center shadow-lg ${
                                    student.placementStatus === 'PLACED' ? 'bg-emerald-500' : 'bg-slate-400'
                                }`}>
                                    {student.placementStatus === 'PLACED' ? (
                                        <CheckCircle2 size={20} className="text-white" />
                                    ) : (
                                        <Clock size={20} className="text-white" />
                                    )}
                                </div>
                            </div>
                            
                            <div className="mt-6 px-4">
                                <h2 className="text-2xl font-bold text-slate-900">{student.name}</h2>
                                <p className="text-slate-500 font-bold mt-1 uppercase tracking-widest text-xs">
                                    {student.registerNumber}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mt-8 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <div className="text-center">
                                    <div className="text-xs font-bold text-slate-400 uppercase tracking-tighter mb-1">Batch</div>
                                    <div className="text-sm font-bold text-slate-700">{student.batch}</div>
                                </div>
                                <div className="text-center border-l border-slate-200">
                                    <div className="text-xs font-bold text-slate-400 uppercase tracking-tighter mb-1">CGPA</div>
                                    <div className="text-sm font-bold text-blue-600">{student.cgpa?.toFixed(2)}</div>
                                </div>
                            </div>

                            <div className="mt-8 space-y-4 px-2">
                                <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-100 text-left">
                                    <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                                        <GraduationCap size={20} />
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Department</div>
                                        <div className="text-sm font-bold text-slate-700">{student.department}</div>
                                    </div>
                                </div>
                                {student.atsScore !== null && (
                                    <div className="flex flex-col gap-3 p-4 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100/50 shadow-inner relative overflow-hidden">
                                        <div className="absolute -top-6 -right-6 w-24 h-24 bg-purple-200/50 rounded-full blur-xl"></div>
                                        <div className="relative flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-white/80 shadow-sm flex items-center justify-center text-indigo-600 backdrop-blur-md">
                                                <Activity size={20} />
                                            </div>
                                            <div className="flex-1">
                                                <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-0.5">Lumina AI Analysis</div>
                                                <div className="flex items-end gap-2">
                                                    <span className={`text-2xl font-black leading-none ${
                                                        student.atsScore >= 80 ? 'text-emerald-600' :
                                                        student.atsScore >= 60 ? 'text-amber-600' :
                                                        'text-rose-600'
                                                    }`}>
                                                        {student.atsScore}
                                                    </span>
                                                    <span className="text-xs font-bold text-slate-400 mb-0.5">/ 100 ATS Match</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="relative text-xs font-medium text-indigo-900/70 leading-relaxed mt-1">
                                            {student.atsScore >= 80 ? 'Exceptional profile. Highly recommended for top-tier product companies.' :
                                             student.atsScore >= 60 ? 'Solid profile. Candidate is well-prepared for standard placement drives.' :
                                             'Needs improvement. Recommend updating resume formatting and skills.'}
                                        </div>
                                    </div>
                                )}
                                {student.resumeUrl && (
                                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/60 group hover:bg-white hover:border-blue-200 hover:shadow-lg transition-all cursor-pointer" onClick={() => window.open(student.resumeUrl, '_blank')}>
                                        <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 group-hover:scale-110 group-hover:rotate-3 transition-all">
                                            <FileText size={24} />
                                        </div>
                                        <div className="flex-1">
                                            <div className="text-sm font-black text-slate-900">Candidate Resume</div>
                                            <div className="text-xs font-medium text-slate-500 mt-0.5">PDF Document</div>
                                        </div>
                                        <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                            <ArrowUpRight size={16} />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </Card>

                    <Card title="Domain Interests" className="border-none shadow-xl shadow-slate-200/50">
                        <div className="flex flex-wrap gap-2">
                            {student.interests.map((interest: any) => (
                                <span 
                                    key={interest.domain} 
                                    className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100/50"
                                >
                                    {getDomainLabel(interest.domain)}
                                </span>
                            ))}
                        </div>
                    </Card>
                </div>

                {/* Right: Stats and Timeline */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { label: 'Applications', value: intelligence.totalApplications, icon: FileText, color: 'blue' },
                            { label: 'Attended', value: intelligence.companiesAttended, icon: Activity, color: 'indigo' },
                            { label: 'Shortlisted', value: intelligence.shortlistedCount, icon: Target, color: 'emerald' },
                        ].map((stat, i) => (
                            <Card key={i} className="border-none shadow-lg shadow-slate-200/40 hover:scale-[1.02] transition-transform">
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-2xl bg-${stat.color}-50 flex items-center justify-center text-${stat.color}-600`}>
                                        <stat.icon size={24} />
                                    </div>
                                    <div>
                                        <div className="text-2xl font-black text-slate-900 leading-none">{stat.value}</div>
                                        <div className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-wide">{stat.label}</div>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>

                    {/* Final Offer if any */}
                    {intelligence.finalOffer && (
                        <Card className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-none shadow-xl shadow-emerald-500/20 overflow-hidden relative">
                            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 w-full">
                                <div className="flex items-center gap-5">
                                    <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                                        <Building2 size={32} />
                                    </div>
                                    <div>
                                        <div className="text-xs font-bold uppercase tracking-widest opacity-80 mb-1">Placed At</div>
                                        <h3 className="text-2xl font-black">{intelligence.finalOffer.companyName}</h3>
                                        <p className="text-emerald-50 font-medium">{intelligence.finalOffer.jobRole}</p>
                                    </div>
                                </div>
                                <div className="bg-white/20 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/10 text-center">
                                    <div className="text-[10px] font-bold uppercase tracking-widest opacity-80 mb-1">Package (CTC)</div>
                                    <div className="text-3xl font-black">{formatCurrency(intelligence.finalOffer.ctc)}</div>
                                </div>
                            </div>
                        </Card>
                    )}

                    {/* Application Timeline */}
                    <Card className="border-none shadow-xl shadow-slate-200/50 overflow-hidden">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                <History size={20} className="text-blue-600" />
                                Application History
                            </h3>
                            <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold">
                                {student.applications.length} Records
                            </span>
                        </div>

                        {student.applications.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 text-center opacity-60">
                                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                                    <FileText size={32} className="text-slate-300" />
                                </div>
                                <p className="text-slate-500 font-medium">No applications recorded yet</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto -mx-6">
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50/50 border-y border-slate-100">
                                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Company & Role</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Package</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Timeline</th>
                                            <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {student.applications.map((app: any) => (
                                            <tr key={app.id} className="hover:bg-slate-50/50 transition-colors group">
                                                <td className="px-6 py-5">
                                                    <div className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                                                        {app.drive.company.companyName}
                                                    </div>
                                                    <div className="text-xs font-medium text-slate-500 mt-0.5">
                                                        {app.drive.company.jobRole}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-bold">
                                                        <DollarSign size={12} />
                                                        {formatCurrency(app.drive.company.ctc)}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <Badge status={app.status}>{app.status}</Badge>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className="flex flex-col gap-1">
                                                        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                                                            <Calendar size={12} className="text-slate-400" />
                                                            Applied: {formatDate(app.appliedDate)}
                                                        </div>
                                                        <div className="flex items-center gap-1.5 text-xs text-slate-400">
                                                            <Clock size={12} />
                                                            Updated: {formatDate(app.updatedAt)}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5 text-right">
                                                    <Link 
                                                        href={`/admin/drives/${app.drive.id}`}
                                                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all inline-block"
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

