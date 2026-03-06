'use client'

import { useEffect, useState } from 'react'
import Card from '@/app/components/Card'
import Badge from '@/app/components/Badge'
import { formatDate, formatCurrency } from '@/lib/utils'
import { 
    Building2, 
    MapPin, 
    Briefcase, 
    DollarSign, 
    Calendar, 
    ChevronRight, 
    CheckCircle2, 
    AlertCircle, 
    Loader2, 
    Search, 
    Filter, 
    ArrowUpRight, 
    Trophy, 
    Info, 
    X, 
    Check 
} from 'lucide-react'

export default function StudentDrivesPage() {
    const [drives, setDrives] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [applying, setApplying] = useState<string | null>(null)
    const [searchQuery, setSearchQuery] = useState('')
    const [confirmApply, setConfirmApply] = useState<string | null>(null)
    const [feedback, setFeedback] = useState<{ type: 'success' | 'error', message: string } | null>(null)

    useEffect(() => {
        loadDrives()
    }, [])

    useEffect(() => {
        if (feedback) {
            const timer = setTimeout(() => setFeedback(null), 5000)
            return () => clearTimeout(timer)
        }
    }, [feedback])

    const loadDrives = () => {
        fetch('/api/drives')
            .then((r) => {
                if (!r.ok) throw new Error(`HTTP error! status: ${r.status}`)
                return r.json()
            })
            .then((data) => {
                setDrives(data.drives || [])
                setLoading(false)
            })
            .catch((error) => {
                console.error('Error loading drives:', error)
                setLoading(false)
            })
    }

    const handleApply = async (driveId: string) => {
        setApplying(driveId)
        setConfirmApply(null)

        try {
            const response = await fetch('/api/applications', {
                method: 'POST', 
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ driveId }),
            })

            if (response.ok) {
                setFeedback({ type: 'success', message: 'Application submitted successfully!' })
                loadDrives()
            } else {
                const data = await response.json()
                setFeedback({ type: 'error', message: data.error || 'Failed to submit application' })
            }
        } catch (err) {
            setFeedback({ type: 'error', message: 'An error occurred. Please try again.' })
        } finally {
            setApplying(null)
        }
    }

    const filteredDrives = drives.filter(drive => 
        drive.company.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        drive.company.jobRole.toLowerCase().includes(searchQuery.toLowerCase())
    )

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <div className="relative">
                    <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-ping" />
                    </div>
                </div>
                <p className="text-slate-500 font-bold mt-6 tracking-wide uppercase text-xs">Fetching placement drives...</p>
            </div>
        )
    }

    return (
        <div className="space-y-8 fade-in pb-20">
            {/* Feedback Toast */}
            {feedback && (
                <div className={`fixed top-24 right-8 z-50 flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border transition-all duration-500 animate-slide-in ${
                    feedback.type === 'success' 
                        ? 'bg-emerald-50 border-emerald-100 text-emerald-700' 
                        : 'bg-red-50 border-red-100 text-red-700'
                }`}>
                    {feedback.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                    <span className="font-bold">{feedback.message}</span>
                    <button onClick={() => setFeedback(null)} className="ml-4 hover:opacity-70">
                        <X size={16} />
                    </button>
                </div>
            )}

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="min-w-0 flex-1">
                    <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3 mb-2">
                        <div className="w-11 h-11 bg-blue-600 rounded-xl flex items-center justify-center text-white flex-shrink-0 shadow-lg shadow-blue-600/20">
                            <Building2 size={24} />
                        </div>
                        <span className="truncate">Placement Drives</span>
                    </h1>
                    <p className="text-slate-500 text-sm">
                        Discover and apply for opportunities that match your professional goals.
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

            {filteredDrives.length === 0 ? (
                <Card className="border-none shadow-xl shadow-slate-200/50 py-24">
                    <div className="flex flex-col items-center justify-center text-center">
                        <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-8 text-slate-300">
                            <Search size={48} strokeWidth={1.5} />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900">No Matches Found</h3>
                        <p className="text-slate-500 max-w-sm mx-auto mt-3 leading-relaxed font-medium">
                            {searchQuery 
                                ? `We couldn't find any drives matching "${searchQuery}". Try adjusting your search.`
                                : "There are currently no active drives that match your eligibility. Check back soon!"}
                        </p>
                    </div>
                </Card>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {filteredDrives.map((drive) => {
                        const hasApplied = drive.applications && drive.applications.length > 0
                        const isConfirming = confirmApply === drive.id

                        return (
                            <Card key={drive.id} className="group hover:shadow-2xl hover:shadow-blue-200/20 transition-all duration-300 border-none bg-white p-0 overflow-hidden flex flex-col">
                                <div className="p-6 flex-1">
                                    <div className="flex justify-between items-start mb-6 gap-4">
                                        <div className="flex items-center gap-4 min-w-0 flex-1">
                                            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-blue-200 group-hover:scale-105 transition-transform duration-300 flex-shrink-0">
                                                {drive.company.companyName.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <h3 className="text-2xl font-black text-slate-900 leading-tight group-hover:text-blue-600 transition-colors truncate">
                                                    {drive.company.companyName}
                                                </h3>
                                                <div className="flex items-center gap-2 text-slate-400 font-bold text-sm mt-1.5 truncate">
                                                    <MapPin size={14} className="text-slate-300 flex-shrink-0" />
                                                    <span className="truncate">{drive.company.location}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-xl text-sm font-black flex items-center gap-2 shadow-sm border border-emerald-100 flex-shrink-0 whitespace-nowrap">
                                            <DollarSign size={16} className="flex-shrink-0" />
                                            <span>{formatCurrency(drive.company.ctc)}</span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 mb-6">
                                        <div className="space-y-1.5">
                                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Role</div>
                                            <div className="text-sm font-bold text-slate-700 flex items-center gap-2 truncate">
                                                <div className="w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 flex-shrink-0">
                                                    <Briefcase size={14} />
                                                </div>
                                                <span className="truncate">{drive.company.jobRole}</span>
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Drive Date</div>
                                            <div className="text-sm font-bold text-slate-700 flex items-center gap-2 truncate">
                                                <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500 flex-shrink-0">
                                                    <Calendar size={14} />
                                                </div>
                                                <span className="truncate whitespace-nowrap">{formatDate(drive.driveDate)}</span>
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Min CGPA</div>
                                            <div className="text-sm font-bold text-slate-700 flex items-center gap-2 truncate">
                                                <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center text-amber-500 flex-shrink-0">
                                                    <Trophy size={14} />
                                                </div>
                                                <span className="truncate">{drive.eligibilityCgpa}</span>
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Industry</div>
                                            <div className="text-sm font-bold text-slate-700 flex items-center gap-2 truncate">
                                                <div className="w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 flex-shrink-0">
                                                    <Building2 size={14} />
                                                </div>
                                                <span className="truncate">{drive.company.industryType}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="px-6 pb-6 pt-0 mt-auto">
                                    {hasApplied ? (
                                        <div className="w-full bg-emerald-50 text-emerald-700 py-4 px-6 rounded-2xl font-black flex items-center justify-center gap-3 text-sm border border-emerald-100 shadow-sm">
                                            <div className="w-6 h-6 bg-emerald-500 text-white rounded-full flex items-center justify-center">
                                                <Check size={14} strokeWidth={3} />
                                            </div>
                                            Applied Successfully
                                        </div>
                                    ) : isConfirming ? (
                                        <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                            <p className="text-sm font-bold text-blue-900 flex items-center gap-2">
                                                <Info size={18} />
                                                Confirm application for this drive?
                                            </p>
                                            <div className="flex gap-3">
                                                <button
                                                    onClick={() => handleApply(drive.id)}
                                                    disabled={applying === drive.id}
                                                    className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-black text-sm hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                                                >
                                                    {applying === drive.id ? <Loader2 size={16} className="animate-spin" /> : 'Confirm'}
                                                </button>
                                                <button
                                                    onClick={() => setConfirmApply(null)}
                                                    className="flex-1 bg-white text-slate-600 py-3 rounded-xl font-black text-sm border border-slate-200 hover:bg-slate-50 transition-colors"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => setConfirmApply(drive.id)}
                                            className="w-full bg-slate-900 text-white py-4 px-6 rounded-2xl font-black flex items-center justify-center gap-2 text-sm hover:bg-blue-600 transition-all duration-300 shadow-xl shadow-slate-200 group-hover:shadow-blue-200"
                                        >
                                            Apply Now
                                            <ArrowUpRight size={18} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                        </button>
                                    )}
                                </div>
                            </Card>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
