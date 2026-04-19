'use client'

import { useEffect, useState, useCallback } from 'react'
import Card from '@/app/components/Card'
import { 
    Building2, 
    Plus, 
    X, 
    Search, 
    Filter, 
    MapPin, 
    Briefcase, 
    DollarSign, 
    Factory,
    Loader2,
    CheckCircle2,
    ChevronRight,
    ArrowRight,
    Trash2,
    Edit3
} from 'lucide-react'

export default function AdminCompaniesPage() {
    const [companies, setCompanies] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [submitting, setSubmitting] = useState(false)
    const [formData, setFormData] = useState({
        companyName: '',
        jobRole: '',
        ctc: '',
        location: '',
        industryType: '',
    })

    const loadCompanies = useCallback(() => {
        setLoading(true)
        fetch('/api/companies')
            .then((r) => r.json())
            .then((data) => {
                setCompanies(data.companies || [])
                setLoading(false)
            })
            .catch(() => setLoading(false))
    }, [])

    useEffect(() => {
        loadCompanies()
    }, [loadCompanies])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSubmitting(true)

        try {
            const response = await fetch('/api/companies', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            })

            if (response.ok) {
                setShowForm(false)
                setFormData({
                    companyName: '',
                    jobRole: '',
                    ctc: '',
                    location: '',
                    industryType: '',
                })
                loadCompanies()
            } else {
                const data = await response.json()
                alert(data.error || 'Failed to add company')
            }
        } catch (err) {
            alert('An error occurred. Please try again.')
        } finally {
            setSubmitting(false)
        }
    }

    const filteredCompanies = companies.filter(company => 
        company.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        company.industryType.toLowerCase().includes(searchQuery.toLowerCase()) ||
        company.location.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="space-y-8 fade-in">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="min-w-0 flex-1">
                    <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3 mb-2">
                        <div className="w-11 h-11 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                            <Building2 className="text-blue-600" size={24} />
                        </div>
                        <span className="truncate">Company Management</span>
                    </h1>
                    <p className="text-slate-500 text-sm">
                        Register and manage partner companies for placement drives.
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
                            Add Company
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
                            <h2 className="text-xl font-bold text-slate-900">Add New Company</h2>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                        <Building2 size={16} className="text-slate-400" />
                                        Company Name
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-600 transition-all outline-none"
                                        placeholder="e.g. Google"
                                        value={formData.companyName}
                                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                        <Briefcase size={16} className="text-slate-400" />
                                        Job Role
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-600 transition-all outline-none"
                                        placeholder="e.g. Software Engineer"
                                        value={formData.jobRole}
                                        onChange={(e) => setFormData({ ...formData, jobRole: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                        <DollarSign size={16} className="text-slate-400" />
                                        CTC (LPA)
                                    </label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-600 transition-all outline-none"
                                        placeholder="e.g. 12.5"
                                        value={formData.ctc}
                                        onChange={(e) => setFormData({ ...formData, ctc: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                        <MapPin size={16} className="text-slate-400" />
                                        Location
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-600 transition-all outline-none"
                                        placeholder="e.g. Bangalore"
                                        value={formData.location}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="space-y-2 lg:col-span-2">
                                    <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                        <Factory size={16} className="text-slate-400" />
                                        Industry Type
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-600 transition-all outline-none"
                                        placeholder="e.g. Technology / FinTech"
                                        value={formData.industryType}
                                        onChange={(e) => setFormData({ ...formData, industryType: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end pt-4">
                                <button 
                                    type="submit" 
                                    disabled={submitting}
                                    className="btn btn-primary w-full md:w-auto px-10"
                                >
                                    {submitting ? (
                                        <>
                                            <Loader2 size={18} className="animate-spin" />
                                            <span>Adding...</span>
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle2 size={18} />
                                            <span>Register Company</span>
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
                            <Factory size={20} />
                        </div>
                        <div className="min-w-0">
                            <h2 className="font-bold text-slate-900 truncate">Registered Companies</h2>
                            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mt-0.5">
                                Total: {companies.length} Companies
                            </p>
                        </div>
                    </div>

                    <div className="relative group w-full md:w-72 flex-shrink-0">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors z-10" size={16} />
                        <input 
                            type="text" 
                            placeholder="Search companies..."
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:ring-4 focus:ring-blue-100 focus:border-blue-600 transition-all outline-none"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="py-20 flex flex-col items-center justify-center">
                        <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
                        <p className="text-slate-500 font-medium">Loading companies...</p>
                    </div>
                ) : filteredCompanies.length === 0 ? (
                    <div className="py-20 flex flex-col items-center justify-center text-center px-6">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                            <Building2 className="text-slate-200" size={32} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900">No Companies Found</h3>
                        <p className="text-slate-500 max-w-xs mx-auto mt-2 leading-relaxed">
                            {searchQuery 
                                ? `We couldn't find any results for "${searchQuery}".` 
                                : "Start by adding your first partner company to the system."}
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-100">
                                    <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-left">Company Info</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-left">Job Details</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-left">Compensation</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-left">Industry</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredCompanies.map((company) => (
                                    <tr key={company.id} className="group hover:bg-blue-50/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 border border-blue-200 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-sm group-hover:shadow-md transition-all flex-shrink-0">
                                                    {company.companyName.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <div className="font-bold text-slate-900 group-hover:text-blue-700 transition-colors truncate">
                                                        {company.companyName}
                                                    </div>
                                                    <div className="text-sm text-slate-500 flex items-center gap-1 mt-0.5 truncate">
                                                        <MapPin size={12} className="flex-shrink-0" />
                                                        <span className="truncate">{company.location}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-sm text-slate-700 font-semibold truncate">
                                                <Briefcase size={14} className="text-slate-400 flex-shrink-0" />
                                                <span className="truncate">{company.jobRole}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-bold whitespace-nowrap">
                                                <DollarSign size={14} className="flex-shrink-0" />
                                                <span>{company.ctc} LPA</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap truncate block max-w-[200px]">
                                                {company.industryType}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className="text-xs text-slate-400 font-medium">Active</span>
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
