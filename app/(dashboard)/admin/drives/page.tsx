'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import Card from '@/app/components/Card'
import { formatDate, formatCurrency } from '@/lib/utils'
import { 
    Calendar, 
    Plus, 
    X, 
    Search, 
    Filter, 
    Building2, 
    Trophy, 
    Users, 
    ChevronRight, 
    ArrowRight,
    Loader2,
    CheckCircle2,
    Briefcase,
    DollarSign,
    Target,
    Activity,
    Edit3,
    Trash2
} from 'lucide-react'

export default function AdminDrivesPage() {
    const [drives, setDrives] = useState<any[]>([])
    const [companies, setCompanies] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [submitting, setSubmitting] = useState(false)
    const [formData, setFormData] = useState({
        companyId: '',
        eligibilityCgpa: '',
        allowedDepartments: [] as string[],
        driveDate: '',
        active: true,
        maxOffers: '',
    })

    const departments = [
        'Computer Science',
        'Information Technology',
        'Electronics',
        'Mechanical',
        'Civil',
        'Electrical',
    ]

    const loadData = useCallback(() => {
        setLoading(true)
        Promise.all([
            fetch('/api/drives').then((r) => r.json()),
            fetch('/api/companies').then((r) => r.json()),
        ]).then(([drivesData, companiesData]) => {
            setDrives(drivesData.drives || [])
            setCompanies(companiesData.companies || [])
            setLoading(false)
        }).catch(() => setLoading(false))
    }, [])

    useEffect(() => {
        loadData()
    }, [loadData])

    const toggleDepartment = (dept: string) => {
        if (formData.allowedDepartments.includes(dept)) {
            setFormData({
                ...formData,
                allowedDepartments: formData.allowedDepartments.filter((d) => d !== dept),
            })
        } else {
            setFormData({
                ...formData,
                allowedDepartments: [...formData.allowedDepartments, dept],
            })
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSubmitting(true)

        try {
            const response = await fetch('/api/drives', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            })

            if (response.ok) {
                setShowForm(false)
                setFormData({
                    companyId: '',
                    eligibilityCgpa: '',
                    allowedDepartments: [],
                    driveDate: '',
                    active: true,
                    maxOffers: '',
                })
                loadData()
            } else {
                const data = await response.json()
                alert(data.error || 'Failed to create drive')
            }
        } catch (err) {
            alert('An error occurred. Please try again.')
        } finally {
            setSubmitting(false)
        }
    }

    const filteredDrives = drives.filter(drive => 
        drive.company.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        drive.company.jobRole.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="space-y-12 fade-in pb-20">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="min-w-0 flex-1">
                    <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3 mb-2">
                        <div className="w-11 h-11 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                            <Calendar className="text-blue-600" size={24} />
                        </div>
                        <span className="truncate">Placement Drives</span>
                    </h1>
                    <p className="text-slate-500 text-sm">
                        Schedule and manage recruitment events for registered companies.
                    </p>
                </div>
                
                <button
                    onClick={() => setShowForm(!showForm)}
                    className={`btn flex-shrink-0 ${showForm ? 'btn-secondary' : 'btn-primary'}`}
                >
                    {showForm ? (
                        <>
                            <X size={20} />
                            Cancel
                        </>
                    ) : (
                        <>
                            <Plus size={20} />
                            Create Drive
                        </>
                    )}
                </button>
            </div>

            {showForm && (
                <Card className="border-none shadow-2xl shadow-blue-900/5 overflow-hidden animate-in slide-in-from-top-4 duration-300">
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-blue-600" />
                    <div className="p-8">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                                <Plus size={24} />
                            </div>
                            <h2 className="text-xl font-bold text-slate-900">Create New Drive</h2>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                        <Building2 size={16} className="text-slate-400" />
                                        Select Company
                                    </label>
                                    <select
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-600 transition-all outline-none"
                                        value={formData.companyId}
                                        onChange={(e) => setFormData({ ...formData, companyId: e.target.value })}
                                        required
                                    >
                                        <option value="">Select a partner company</option>
                                        {companies.map((company) => (
                                            <option key={company.id} value={company.id}>
                                                {company.companyName} - {company.jobRole}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                        <Target size={16} className="text-slate-400" />
                                        Eligibility CGPA
                                    </label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        min="0"
                                        max="10"
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-600 transition-all outline-none"
                                        placeholder="e.g. 7.5"
                                        value={formData.eligibilityCgpa}
                                        onChange={(e) => setFormData({ ...formData, eligibilityCgpa: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                        <Calendar size={16} className="text-slate-400" />
                                        Drive Date
                                    </label>
                                    <input
                                        type="date"
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-600 transition-all outline-none"
                                        value={formData.driveDate}
                                        onChange={(e) => setFormData({ ...formData, driveDate: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                        <Trophy size={16} className="text-slate-400" />
                                        Max Offers (Optional)
                                    </label>
                                    <input
                                        type="number"
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-600 transition-all outline-none"
                                        placeholder="No limit if empty"
                                        value={formData.maxOffers}
                                        onChange={(e) => setFormData({ ...formData, maxOffers: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                    <Briefcase size={16} className="text-slate-400" />
                                    Allowed Departments
                                </label>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    {departments.map((dept) => {
                                        const isSelected = formData.allowedDepartments.includes(dept)
                                        return (
                                            <button
                                                key={dept}
                                                type="button"
                                                onClick={() => toggleDepartment(dept)}
                                                className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-semibold transition-all ${
                                                    isSelected 
                                                    ? 'bg-blue-50 border-blue-200 text-blue-700 shadow-sm' 
                                                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                                                }`}
                                            >
                                                <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                                                    isSelected ? 'bg-blue-600 border-blue-600' : 'bg-white border-slate-300'
                                                }`}>
                                                    {isSelected && <CheckCircle2 size={10} className="text-white" />}
                                                </div>
                                                {dept}
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <div className="relative">
                                        <input
                                            type="checkbox"
                                            className="sr-only"
                                            checked={formData.active}
                                            onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                                        />
                                        <div className={`w-12 h-6 rounded-full transition-all ${formData.active ? 'bg-blue-600' : 'bg-slate-200'}`} />
                                        <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-all ${formData.active ? 'translate-x-6' : ''}`} />
                                    </div>
                                    <span className="text-sm font-bold text-slate-700 group-hover:text-slate-900 transition-colors">
                                        Mark as Active Drive
                                    </span>
                                </label>

                                <button 
                                    type="submit" 
                                    disabled={submitting}
                                    className="btn btn-primary w-full md:w-auto px-10"
                                >
                                    {submitting ? (
                                        <>
                                            <Loader2 size={18} className="animate-spin" />
                                            <span>Scheduling...</span>
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle2 size={18} />
                                            <span>Schedule Drive</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </Card>
            )}

            {/* List Section */}
            <Card className="p-0 border-none shadow-xl shadow-slate-200/40 overflow-hidden">
                <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-slate-400 border border-slate-200 flex-shrink-0">
                            <Activity size={20} />
                        </div>
                        <div className="min-w-0">
                            <h2 className="font-bold text-slate-900 truncate">Placement Drives</h2>
                            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mt-0.5">
                                Total: {drives.length} Active & Past Drives
                            </p>
                        </div>
                    </div>

                    <div className="relative group w-full md:w-72 flex-shrink-0">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors z-10" size={16} />
                        <input 
                            type="text" 
                            placeholder="Search drives..."
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:ring-4 focus:ring-blue-100 focus:border-blue-600 transition-all outline-none"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="py-20 flex flex-col items-center justify-center">
                        <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
                        <p className="text-slate-500 font-medium">Loading placement drives...</p>
                    </div>
                ) : filteredDrives.length === 0 ? (
                    <div className="py-20 flex flex-col items-center justify-center text-center px-6">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-slate-200">
                            <Calendar size={32} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900">No Drives Scheduled</h3>
                        <p className="text-slate-500 max-w-xs mx-auto mt-2 leading-relaxed">
                            {searchQuery 
                                ? `We couldn't find any drives matching "${searchQuery}".` 
                                : "No recruitment drives have been scheduled yet. Create one to start."}
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-100">
                                    <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Company & Role</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Eligibility</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Drive Date</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Applications</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredDrives.map((drive) => (
                                    <tr key={drive.id} className="group hover:bg-blue-50/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 border border-blue-200 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-sm group-hover:shadow-md transition-all flex-shrink-0">
                                                    {drive.company.companyName.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <div className="font-bold text-slate-900 group-hover:text-blue-700 transition-colors truncate">
                                                        {drive.company.companyName}
                                                    </div>
                                                    <div className="text-sm text-slate-500 flex items-center gap-1 mt-0.5 truncate">
                                                        <Briefcase size={12} className="flex-shrink-0" />
                                                        <span className="truncate">{drive.company.jobRole}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="space-y-1.5">
                                                <div className="flex items-center gap-2 text-sm text-slate-700 font-semibold">
                                                    <Trophy size={14} className="text-amber-500 flex-shrink-0" />
                                                    <span>CGPA ≥ {drive.eligibilityCgpa}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-xs text-emerald-600 font-bold">
                                                    <DollarSign size={12} className="flex-shrink-0" />
                                                    <span>{drive.company.ctc} LPA</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-sm text-slate-600 whitespace-nowrap">
                                                <Calendar size={14} className="text-blue-500 flex-shrink-0" />
                                                <span>{formatDate(drive.driveDate)}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-xs font-bold flex items-center gap-1.5 whitespace-nowrap">
                                                    <Users size={12} className="flex-shrink-0" />
                                                    <span>{drive._count?.applications || 0}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider whitespace-nowrap ${
                                                drive.active 
                                                ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
                                                : 'bg-slate-100 text-slate-500 border border-slate-200'
                                            }`}>
                                                <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${drive.active ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
                                                <span>{drive.active ? 'Active' : 'Inactive'}</span>
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={`/admin/drives/${drive.id}`}
                                                    className="btn btn-secondary !px-4 !py-2 !text-xs"
                                                >
                                                    <span>Manage</span>
                                                    <ChevronRight size={14} className="flex-shrink-0" />
                                                </Link>
                                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    {/* Additional actions can be added here later */}
                                                </div>
                                            </div>
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
