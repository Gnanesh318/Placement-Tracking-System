'use client'

import { useEffect, useState, useCallback, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Card from '@/app/components/Card'
import Badge from '@/app/components/Badge'
import { getDomainLabel } from '@/lib/utils'
import { 
    Users, 
    Search, 
    Filter, 
    GraduationCap, 
    BookOpen, 
    Trophy, 
    ChevronRight, 
    Loader2, 
    X, 
    FileText, 
    User,
    Briefcase,
    Calendar,
    Target,
    ArrowUpRight,
    SearchX,
    Hash
} from 'lucide-react'

function AdminStudentsContent() {
    const [students, setStudents] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const searchParams = useSearchParams()
    const statusQuery = searchParams ? searchParams.get('status') : null

    const [filters, setFilters] = useState({
        domain: '',
        minCgpa: '',
        maxCgpa: '',
        department: '',
        batch: '',
        placementStatus: statusQuery || '',
    })

    const loadStudents = useCallback(() => {
        setLoading(true)
        const params = new URLSearchParams()
        Object.entries(filters).forEach(([key, value]) => {
            if (value) params.append(key, value)
        })

        fetch(`/api/admin/students?${params}`)
            .then((r) => r.json())
            .then((data) => {
                setStudents(data.students || [])
                setLoading(false)
            })
            .catch(() => setLoading(false))
    }, [filters])

    useEffect(() => {
        loadStudents()
    }, [loadStudents])

    const clearFilters = () => {
        setFilters({
            domain: '',
            minCgpa: '',
            maxCgpa: '',
            department: '',
            batch: '',
            placementStatus: '',
        })
    }

    const hasActiveFilters = Object.values(filters).some(v => v !== '')

    return (
        <div className="space-y-12 fade-in pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="min-w-0 flex-1">
                    <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3 mb-2">
                        <div className="w-11 h-11 bg-blue-600 rounded-xl flex items-center justify-center text-white flex-shrink-0 shadow-lg shadow-blue-600/20">
                            <Users size={24} />
                        </div>
                        <span className="truncate">Student Management</span>
                    </h1>
                    <p className="text-slate-500 text-sm">
                        Monitor student performance, profiles, and placement analytics.
                    </p>
                </div>
            </div>

            {/* Filters Section */}
            <Card className="border-none shadow-xl shadow-slate-200/40 p-0 overflow-hidden">
                <div className="p-6 md:p-8 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
                            <Filter size={18} />
                        </div>
                        <h3 className="text-lg font-black text-slate-800 truncate">Advanced Filters</h3>
                    </div>
                    {hasActiveFilters && (
                        <button
                            onClick={clearFilters}
                            className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all text-[10px] font-black uppercase tracking-wider flex items-center gap-2 border border-slate-200"
                        >
                            <X size={14} />
                            Reset
                        </button>
                    )}
                </div>

                <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="space-y-3">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <Target size={14} className="text-slate-300" />
                            Domain / Interest
                        </label>
                        <select
                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-600 transition-all outline-none font-bold text-slate-700 appearance-none cursor-pointer"
                            value={filters.domain}
                            onChange={(e) =>
                                setFilters({ ...filters, domain: e.target.value })
                            }
                        >
                            <option value="">All Domains</option>
                            <option value="SOFTWARE_DEV">Software Development</option>
                            <option value="AI_ML">AI / Machine Learning</option>
                            <option value="DATA_SCIENCE">Data Science</option>
                            <option value="DEVOPS">DevOps / Cloud</option>
                            <option value="CYBER_SECURITY">Cyber Security</option>
                            <option value="CORE_ENGINEERING">Core Engineering</option>
                            <option value="NON_IT">Non-IT Roles</option>
                        </select>
                    </div>

                    <div className="space-y-3">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <GraduationCap size={14} className="text-slate-300" />
                            Department
                        </label>
                        <select
                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-600 transition-all outline-none font-bold text-slate-700 appearance-none cursor-pointer"
                            value={filters.department}
                            onChange={(e) =>
                                setFilters({ ...filters, department: e.target.value })
                            }
                        >
                            <option value="">All Departments</option>
                            <option value="Computer Science">Computer Science</option>
                            <option value="Information Technology">Information Technology</option>
                            <option value="Electronics">Electronics</option>
                            <option value="Mechanical">Mechanical</option>
                            <option value="Civil">Civil</option>
                            <option value="Electrical">Electrical</option>
                        </select>
                    </div>

                    <div className="space-y-3">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <Briefcase size={14} className="text-slate-300" />
                            Placement Status
                        </label>
                        <select
                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-600 transition-all outline-none font-bold text-slate-700 appearance-none cursor-pointer"
                            value={filters.placementStatus}
                            onChange={(e) =>
                                setFilters({ ...filters, placementStatus: e.target.value })
                            }
                        >
                            <option value="">All Statuses</option>
                            <option value="NOT_PLACED">Not Placed</option>
                            <option value="PLACED">Placed</option>
                        </select>
                    </div>

                    <div className="space-y-3">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <Trophy size={14} className="text-slate-300" />
                            Min CGPA
                        </label>
                        <input
                            type="number"
                            step="0.1"
                            min="0"
                            max="10"
                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-600 transition-all outline-none font-bold text-slate-700"
                            value={filters.minCgpa}
                            onChange={(e) =>
                                setFilters({ ...filters, minCgpa: e.target.value })
                            }
                            placeholder="e.g., 7.5"
                        />
                    </div>

                    <div className="space-y-3">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <Calendar size={14} className="text-slate-300" />
                            Graduation Batch
                        </label>
                        <input
                            type="text"
                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-600 transition-all outline-none font-bold text-slate-700"
                            value={filters.batch}
                            onChange={(e) =>
                                setFilters({ ...filters, batch: e.target.value })
                            }
                            placeholder="e.g., 2025"
                        />
                    </div>
                </div>
            </Card>

            {/* Results Section */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-24">
                    <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
                    <p className="text-slate-500 font-bold mt-6 tracking-wide uppercase text-xs">Filtering students...</p>
                </div>
            ) : students.length === 0 ? (
                <Card className="border-none shadow-xl shadow-slate-200/50 py-24 text-center">
                    <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-8 mx-auto text-slate-300">
                        <SearchX size={48} strokeWidth={1.5} />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900">No Students Found</h3>
                    <p className="text-slate-500 max-w-sm mx-auto mt-3 font-medium">
                        Try adjusting your filters to find the students you&apos;re looking for.
                    </p>
                    {hasActiveFilters && (
                        <button 
                            onClick={clearFilters}
                            className="btn btn-primary mt-8"
                        >
                            Clear All Filters
                        </button>
                    )}
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {students.map((student) => (
                        <Card key={student.id} className="group hover:shadow-2xl hover:shadow-blue-200/20 transition-all duration-300 border-none bg-white p-0 overflow-hidden flex flex-col">
                            <div className="p-6 flex-1">
                                <div className="flex justify-between items-start mb-5">
                                    <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-blue-200 group-hover:scale-105 transition-transform duration-300 flex-shrink-0">
                                        {student.name.charAt(0).toUpperCase()}
                                    </div>
                                    <Badge status={student.placementStatus} className="flex-shrink-0">{student.placementStatus}</Badge>
                                </div>

                                <div className="space-y-2 mb-5">
                                    <h3 className="text-xl font-black text-slate-900 leading-tight group-hover:text-blue-600 transition-colors truncate">
                                        {student.name}
                                    </h3>
                                    <div className="flex flex-col gap-1.5">
                                        <p className="text-sm font-bold text-slate-400 flex items-center gap-2 truncate">
                                            <Hash size={14} className="text-slate-300 flex-shrink-0" />
                                            <span className="truncate">#{student.registerNumber}</span>
                                        </p>
                                        <p className="text-sm font-bold text-slate-500 flex items-center gap-2 truncate">
                                            <GraduationCap size={14} className="text-slate-300 flex-shrink-0" />
                                            <span className="truncate">{student.department} • {student.batch} Batch</span>
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-50">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">CGPA</p>
                                        <p className={`text-lg font-black ${
                                            student.cgpa >= 8.5 ? 'text-emerald-600' :
                                            student.cgpa >= 7.5 ? 'text-blue-600' :
                                            'text-slate-700'
                                        }`}>
                                            {student.cgpa?.toFixed(2)}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Applications</p>
                                        <p className="text-lg font-black text-slate-700 flex items-center gap-1.5">
                                            <FileText size={16} className="text-slate-300" />
                                            {student._count.applications}
                                        </p>
                                    </div>
                                </div>
                                
                                <div className="mt-4 pt-4 border-t border-slate-50">
                                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-2">Primary Interests</p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {student.interests.slice(0, 2).map((i: any) => (
                                            <span
                                                key={i.domain}
                                                className="px-2.5 py-1 rounded-lg bg-slate-50 text-[10px] font-black text-slate-600 uppercase tracking-tight border border-slate-100"
                                            >
                                                {getDomainLabel(i.domain).split(' / ')[0]}
                                            </span>
                                        ))}
                                        {student.interests.length > 2 && (
                                            <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-[10px] font-black text-blue-600 border border-blue-100">
                                                +{student.interests.length - 2} More
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="px-6 pb-6">
                                <Link
                                    href={`/admin/students/${student.id}`}
                                    className="btn btn-primary w-full"
                                >
                                    <span>View Detailed Profile</span>
                                    <ArrowUpRight size={18} className="flex-shrink-0" />
                                </Link>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}

export default function AdminStudentsPage() {
    return (
        <Suspense fallback={
            <div className="flex flex-col items-center justify-center py-24">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
                <p className="text-slate-500 font-bold mt-6 tracking-wide uppercase text-xs">Loading...</p>
            </div>
        }>
            <AdminStudentsContent />
        </Suspense>
    )
}


