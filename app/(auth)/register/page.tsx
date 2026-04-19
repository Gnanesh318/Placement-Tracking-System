'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { 
    Mail, 
    Lock, 
    User, 
    Hash, 
    BookOpen, 
    Calendar, 
    Award, 
    Loader2, 
    ArrowRight,
    GraduationCap
} from 'lucide-react'

export default function RegisterPage() {
    const router = useRouter()
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        registerNumber: '',
        department: '',
        batch: '',
        cgpa: '',
    })
    const [resumeFile, setResumeFile] = useState<File | null>(null)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const submitData = new FormData()
            Object.entries(formData).forEach(([key, value]) => {
                submitData.append(key, value)
            })
            if (resumeFile) {
                submitData.append('resume', resumeFile)
            }

            const response = await fetch('/api/auth/register', {
                method: 'POST',
                body: submitData,
            })

            const data = await response.json()

            if (!response.ok) {
                setError(data.error || 'Registration failed')
                setLoading(false)
                return
            }

            await signIn('credentials', {
                email: formData.email,
                password: formData.password,
                redirect: false,
            })

            router.push('/student/setup')
        } catch (err) {
            setError('An error occurred. Please try again.')
            setLoading(false)
        }
    }

    return (
        <div
            id="main-content"
            className="min-h-screen bg-slate-100 px-4 py-10 sm:px-6"
            role="main"
            aria-label="Create placement portal account"
        >
            <div className="mx-auto w-full max-w-2xl">
                <div className="w-full bg-white p-8 sm:p-10 rounded-3xl shadow-xl shadow-slate-900/5 border border-slate-200">
                    <div className="mb-10">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-semibold border border-blue-100">
                                <GraduationCap size={16} />
                                <span>Academic Success Portal</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">
                                P
                            </div>
                            <span className="text-2xl font-bold text-slate-900 tracking-tight">IPIMP</span>
                        </div>
                        <h2 className="text-3xl font-bold text-slate-900 mb-2">Create Account</h2>
                        <p className="text-slate-500">Enter your details to register for the placement portal</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 animate-shake">
                            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                                <Lock size={16} />
                            </div>
                            <p className="text-sm font-medium">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700 ml-1">Full Name</label>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                                        <User size={18} />
                                    </div>
                                    <input
                                        type="text"
                                        className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-600 transition-all outline-none"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="John Doe"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700 ml-1">Email Address</label>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                                        <Mail size={18} />
                                    </div>
                                    <input
                                        type="email"
                                        className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-600 transition-all outline-none"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        placeholder="john@college.edu"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 ml-1">Password</label>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                                    <Lock size={18} />
                                </div>
                                <input
                                    type="password"
                                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-600 transition-all outline-none"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required
                                    minLength={6}
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700 ml-1">Register Number</label>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                                        <Hash size={18} />
                                    </div>
                                    <input
                                        type="text"
                                        className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-600 transition-all outline-none"
                                        value={formData.registerNumber}
                                        onChange={(e) => setFormData({ ...formData, registerNumber: e.target.value })}
                                        placeholder="2021XX001"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700 ml-1">Department</label>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                                        <BookOpen size={18} />
                                    </div>
                                    <select
                                        className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-600 transition-all outline-none appearance-none"
                                        value={formData.department}
                                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                        required
                                    >
                                        <option value="">Select Department</option>
                                        <option value="Computer Science">Computer Science</option>
                                        <option value="Information Technology">Information Technology</option>
                                        <option value="Electronics">Electronics</option>
                                        <option value="Mechanical">Mechanical</option>
                                        <option value="Civil">Civil</option>
                                        <option value="Electrical">Electrical</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700 ml-1">Batch</label>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                                        <Calendar size={18} />
                                    </div>
                                    <input
                                        type="text"
                                        className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-600 transition-all outline-none"
                                        value={formData.batch}
                                        onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
                                        placeholder="e.g., 2021"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700 ml-1">CGPA</label>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                                        <Award size={18} />
                                    </div>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        max="10"
                                        className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-600 transition-all outline-none"
                                        value={formData.cgpa}
                                        onChange={(e) => setFormData({ ...formData, cgpa: e.target.value })}
                                        placeholder="0.00"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 ml-1">Resume (PDF)</label>
                            <div className="relative group">
                                <input
                                    type="file"
                                    accept=".pdf"
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-600 transition-all outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                    onChange={(e) => setResumeFile(e.target.files ? e.target.files[0] : null)}
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-primary w-full mt-6 py-4"
                        >
                            {loading ? (
                                <Loader2 className="animate-spin" size={20} />
                            ) : (
                                <>
                                    <span>Create Account</span>
                                    <ArrowRight size={20} />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-10 text-center">
                        <p className="text-slate-500">
                            Already have an account?{' '}
                            <Link href="/login" className="text-blue-600 font-bold hover:text-blue-700 transition-colors">
                                Sign in here
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
