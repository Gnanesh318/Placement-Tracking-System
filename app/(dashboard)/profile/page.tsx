'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Card from '@/app/components/Card'
import { 
    User, 
    Mail, 
    Briefcase, 
    Calendar, 
    Shield, 
    MapPin, 
    BookOpen,
    Settings,
    Edit3,
    Camera,
    UploadCloud,
    FileText,
    CheckCircle2,
    Loader2,
    Activity
} from 'lucide-react'
import { formatDate } from '@/lib/utils'

export default function ProfilePage() {
    const { data: session, status: sessionStatus } = useSession()
    const [profile, setProfile] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [uploading, setUploading] = useState(false)

    useEffect(() => {
        if (sessionStatus === 'authenticated') {
            fetch('/api/profile')
                .then(r => r.json())
                .then(data => {
                    setProfile(data.user)
                    setLoading(false)
                })
        } else if (sessionStatus === 'unauthenticated') {
            setLoading(false)
        }
    }, [sessionStatus])

    const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return
        
        const file = e.target.files[0]
        const formData = new FormData()
        formData.append('resume', file)

        setUploading(true)
        try {
            const res = await fetch('/api/student/resume', {
                method: 'POST',
                body: formData
            })
            if (res.ok) {
                const data = await res.json()
                setProfile({ ...profile, resumeUrl: data.resumeUrl, atsScore: data.atsScore })
            } else {
                alert('Failed to upload resume')
            }
        } catch (error) {
            alert('Upload error occurred')
        } finally {
            setUploading(false)
        }
    }

    if (loading || sessionStatus === 'loading') {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4" />
                <p className="text-slate-500 font-medium">Loading profile...</p>
            </div>
        )
    }

    if (!session?.user || !profile) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <User size={48} className="text-slate-300 mb-4" />
                <h2 className="text-xl font-bold text-slate-700">Not Signed In</h2>
                <p className="text-slate-500">Please sign in to view your profile.</p>
            </div>
        )
    }

    const { user } = session
    
    // Circular Progress logic
    const score = profile.atsScore || 0
    const dashArray = 2 * Math.PI * 40
    const dashOffset = dashArray - (dashArray * score) / 100
    
    const getScoreColor = (s: number) => {
        if (s >= 80) return 'text-emerald-500'
        if (s >= 60) return 'text-amber-500'
        return 'text-rose-500'
    }

    return (
        <div className="space-y-8 fade-in max-w-5xl mx-auto">
            {/* Header / Cover */}
            <div className="relative rounded-2xl overflow-hidden shadow-lg bg-white border border-slate-100">
                <div className="h-48 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 mix-blend-overlay"></div>
                    <button className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-lg text-white transition-all shadow-sm">
                        <Edit3 size={18} />
                    </button>
                </div>
                
                <div className="px-8 pb-8 relative">
                    <div className="flex flex-col md:flex-row gap-6 items-end -mt-16 mb-6">
                        <div className="relative group">
                            <div className="w-32 h-32 rounded-full border-4 border-white bg-slate-100 flex items-center justify-center shadow-xl overflow-hidden text-5xl font-bold text-blue-600 shadow-blue-900/10">
                                {user.name?.charAt(0).toUpperCase()}
                            </div>
                            <button className="absolute bottom-0 right-0 p-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95 border-2 border-white">
                                <Camera size={16} />
                            </button>
                        </div>
                        
                        <div className="flex-1 pb-2">
                            <h1 className="text-3xl font-extrabold text-slate-900 mb-1 tracking-tight">
                                {user.name}
                            </h1>
                            <div className="flex items-center gap-3 text-slate-500 font-medium">
                                <span className="flex items-center gap-1.5">
                                    <Shield size={16} className="text-blue-500" />
                                    {user.role}
                                </span>
                                <span>•</span>
                                <span className="flex items-center gap-1.5">
                                    <MapPin size={16} className="text-slate-400" />
                                    Chennai, India
                                </span>
                            </div>
                        </div>

                        <div className="pb-2 w-full md:w-auto flex justify-end">
                            <button className="btn btn-primary w-full md:w-auto shadow-blue-500/30">
                                <Settings size={18} />
                                Account Settings
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Personal Info */}
                <Card className="lg:col-span-1 shadow-xl shadow-slate-200/50 border-none bg-white">
                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2.5">
                            <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                                <User className="text-blue-600" size={18} />
                            </div>
                            Personal Info
                        </h3>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                <Mail size={14} /> Email Address
                            </label>
                            <div className="font-semibold text-slate-800 break-all">{user.email}</div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                <BookOpen size={14} /> Department
                            </label>
                            <div className="font-semibold text-slate-800">
                                {user.role === 'STUDENT' ? 'Computer Science & Engineering' : 'Administration'}
                            </div>
                        </div>

                        {user.role === 'STUDENT' && (
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                    <Briefcase size={14} /> Placement Status
                                </label>
                                <div className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold text-sm shadow-sm border border-emerald-100">
                                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-2 animate-pulse" />
                                    Eligible for Placements
                                </div>
                            </div>
                        )}

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                <Calendar size={14} /> Member Since
                            </label>
                            <div className="font-semibold text-slate-800">August 2023</div>
                        </div>
                    </div>
                </Card>

                {/* Right Column: Bio / Activity */}
                <div className="lg:col-span-2 space-y-8">
                    <Card className="shadow-xl shadow-slate-200/50 border-none bg-white">
                        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2.5">
                                <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center">
                                    <BookOpen className="text-indigo-600" size={18} />
                                </div>
                                About Me
                            </h3>
                            <button className="text-blue-600 hover:text-blue-700 text-sm font-bold transition-colors">
                                Edit Bio
                            </button>
                        </div>
                        <p className="text-slate-600 leading-relaxed text-[15px]">
                            {user.role === 'STUDENT' 
                                ? "I'm a passionate computer science student looking for exciting opportunities in Software Engineering and Full Stack Development. I have strong problem-solving skills and experience with modern web technologies including React, Node.js, and TypeScript. Eager to contribute to innovative teams and learn new technologies." 
                                : "System administrator managing the placement portal, coordinating between companies and students, and ensuring smooth placement drives."}
                        </p>
                    </Card>

                    <Card className="shadow-xl shadow-slate-200/50 border-none bg-white">
                        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2.5">
                                <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
                                    <Briefcase className="text-emerald-600" size={18} />
                                </div>
                                Skills & Expertise
                            </h3>
                            <button className="text-blue-600 hover:text-blue-700 text-sm font-bold transition-colors">
                                Manage Skills
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {['JavaScript', 'TypeScript', 'React.js', 'Next.js', 'Node.js', 'Prisma', 'MySQL', 'Tailwind CSS'].map((skill) => (
                                <span key={skill} className="px-4 py-2 bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-sm font-bold shadow-sm hover:border-blue-300 hover:bg-blue-50 transition-all cursor-default">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </Card>
                        
                    <Card className="shadow-xl shadow-slate-200/50 border-none bg-white">
                        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2.5">
                                <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                                    <FileText className="text-blue-600" size={18} />
                                </div>
                                Resume & ATS Analytics
                            </h3>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                            {/* Resume Section */}
                            <div className="space-y-4">
                                {profile.resumeUrl ? (
                                    <div className="flex items-center justify-between p-4 bg-emerald-50 border border-emerald-100 rounded-2xl">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                                                <CheckCircle2 size={20} />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-emerald-900">Resume Uploaded</h4>
                                                <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Ready for Drives</p>
                                            </div>
                                        </div>
                                        <a href={profile.resumeUrl} target="_blank" rel="noreferrer" className="px-4 py-2 bg-emerald-600 text-white font-bold text-sm rounded-xl hover:bg-emerald-700 shadow-sm transition-all">
                                            View Resume
                                        </a>
                                    </div>
                                ) : (
                                    <div className="p-6 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50 flex flex-col items-center justify-center text-center transition-all hover:bg-blue-50 hover:border-blue-200 group">
                                        <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center text-slate-400 group-hover:text-blue-600 group-hover:scale-110 transition-all mb-3">
                                            {uploading ? <Loader2 className="animate-spin" size={24} /> : <UploadCloud size={24} />}
                                        </div>
                                        <h4 className="font-bold text-slate-700 mb-1">Upload Your Resume</h4>
                                        <p className="text-xs text-slate-500 mb-4 px-4">PDF format, max 5MB. Required for placements.</p>
                                        <label className="cursor-pointer">
                                            <span className="px-5 py-2.5 bg-blue-600 text-white font-bold text-sm rounded-xl hover:bg-blue-700 shadow-md shadow-blue-600/20 transition-all active:scale-95 inline-block">
                                                {uploading ? 'Uploading...' : 'Browse File'}
                                            </span>
                                            <input type="file" accept=".pdf" className="hidden" onChange={handleResumeUpload} disabled={uploading} />
                                        </label>
                                    </div>
                                )}
                            </div>

                            {/* ATS Section */}
                            <div className="flex items-center justify-center relative">
                                <div className="absolute inset-0 bg-gradient-to-tr from-blue-50 to-indigo-50 rounded-full scale-[0.8] opacity-50 blur-2xl"></div>
                                <div className="relative flex flex-col items-center">
                                    <svg width="140" height="140" className="rotate-[-90deg]">
                                        <circle cx="70" cy="70" r="40" fill="none" stroke="#f1f5f9" strokeWidth="12" />
                                        <circle 
                                            cx="70" cy="70" r="40" 
                                            fill="none" 
                                            stroke="currentColor" 
                                            strokeWidth="12" 
                                            strokeLinecap="round"
                                            strokeDasharray={dashArray}
                                            strokeDashoffset={profile.resumeUrl ? dashOffset : dashArray}
                                            className={`transition-all duration-1000 ease-out ${profile.resumeUrl ? getScoreColor(score) : 'text-slate-200'}`}
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        {profile.resumeUrl ? (
                                            <>
                                                <span className={`text-3xl font-black tracking-tighter ${getScoreColor(score)}`}>{score}</span>
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Score</span>
                                            </>
                                        ) : (
                                            <span className="text-slate-300 font-bold">N/A</span>
                                        )}
                                    </div>
                                    <div className="mt-4 text-center">
                                        <h4 className="font-bold text-slate-800 flex items-center justify-center gap-1.5">
                                            <Activity size={16} className="text-blue-500" />
                                            Simulated ATS Score
                                        </h4>
                                        <p className="text-xs text-slate-500 font-medium mt-0.5">
                                            {profile.resumeUrl ? 'Based on layout & keywords' : 'Upload resume to calculate'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    )
}
