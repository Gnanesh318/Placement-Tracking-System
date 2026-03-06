'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getDomainLabel } from '@/lib/utils'
import Card from '@/app/components/Card'
import { 
    Check, 
    ChevronRight, 
    Rocket, 
    Target, 
    Sparkles,
    Loader2,
    AlertCircle
} from 'lucide-react'

const DOMAINS = [
    'SOFTWARE_DEV',
    'AI_ML',
    'DATA_SCIENCE',
    'DEVOPS',
    'CYBER_SECURITY',
    'CORE_ENGINEERING',
    'NON_IT',
]

export default function StudentSetupPage() {
    const router = useRouter()
    const [selectedDomains, setSelectedDomains] = useState<string[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const toggleDomain = (domain: string) => {
        if (selectedDomains.includes(domain)) {
            setSelectedDomains(selectedDomains.filter((d) => d !== domain))
        } else {
            setSelectedDomains([...selectedDomains, domain])
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (selectedDomains.length === 0) {
            setError('Please select at least one area of interest')
            return
        }

        setLoading(true)
        setError('')

        try {
            const response = await fetch('/api/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ interests: selectedDomains }),
            })

            if (!response.ok) {
                throw new Error('Failed to update profile')
            }

            router.push('/student')
            router.refresh()
        } catch (err) {
            setError('An error occurred. Please try again.')
            setLoading(false)
        }
    }

    return (
        <div
            id="main-content"
            className="min-h-[90vh] flex items-center justify-center p-6 bg-slate-50/50"
            role="main"
            aria-label="Student interest setup"
        >
            <div className="max-w-4xl w-full">
                <Card className="p-8 md:p-12 border-none shadow-2xl shadow-slate-200/50 overflow-hidden relative">
                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full -mr-32 -mt-32 blur-3xl opacity-50" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-50 rounded-full -ml-32 -mb-32 blur-3xl opacity-50" />

                    <div className="relative z-10">
                        <div className="flex flex-col items-center text-center mb-10">
                            <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-blue-200 mb-6 rotate-3 hover:rotate-0 transition-transform duration-300">
                                <Rocket size={40} />
                            </div>
                            <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">
                                Complete Your Profile
                            </h1>
                            <p className="text-slate-500 max-w-lg text-lg leading-relaxed">
                                Welcome aboard! Select your areas of interest to help us match you with the perfect career opportunities.
                            </p>
                        </div>

                        {error && (
                            <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 animate-shake">
                                <AlertCircle size={20} />
                                <span className="font-semibold text-sm">{error}</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                        <Target className="text-blue-600" size={24} />
                                        Areas of Interest
                                    </h3>
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-100 px-3 py-1 rounded-full">
                                        Select Multiple
                                    </span>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {DOMAINS.map((domain) => {
                                        const isSelected = selectedDomains.includes(domain)
                                        return (
                                            <div
                                                key={domain}
                                                onClick={() => toggleDomain(domain)}
                                                className={`group flex items-center gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                                                    isSelected
                                                        ? 'bg-blue-50 border-blue-600 shadow-lg shadow-blue-100'
                                                        : 'bg-white border-slate-100 hover:border-blue-200 hover:bg-slate-50'
                                                }`}
                                            >
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                                                    isSelected 
                                                        ? 'bg-blue-600 text-white scale-110' 
                                                        : 'bg-slate-100 text-slate-400 group-hover:bg-blue-100 group-hover:text-blue-500'
                                                }`}>
                                                    {isSelected ? <Check size={20} strokeWidth={3} /> : <Sparkles size={18} />}
                                                </div>
                                                <div className="flex-1">
                                                    <span className={`font-bold transition-colors ${
                                                        isSelected ? 'text-blue-900' : 'text-slate-600 group-hover:text-slate-900'
                                                    }`}>
                                                        {getDomainLabel(domain)}
                                                    </span>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading || selectedDomains.length === 0}
                                className={`w-full py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition-all duration-300 ${
                                    loading || selectedDomains.length === 0
                                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                        : 'bg-blue-600 text-white hover:bg-blue-700 shadow-xl shadow-blue-200 hover:shadow-blue-300 hover:-translate-y-1'
                                }`}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="animate-spin" size={24} />
                                        <span>Saving Profile...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Finish Setup & Get Started</span>
                                        <ChevronRight size={24} />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </Card>
            </div>
        </div>
    )
}

