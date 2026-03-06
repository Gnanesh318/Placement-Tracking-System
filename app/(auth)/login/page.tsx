'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { GraduationCap, Mail, Lock, Loader2, ArrowRight } from 'lucide-react'

export default function LoginPage() {
    const router = useRouter()
    const [formData, setFormData] = useState({ email: '', password: '' })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const result = await signIn('credentials', {
                email: formData.email,
                password: formData.password,
                redirect: false,
            })

            if (result?.error) {
                setError('Invalid email or password')
            } else {
                router.push('/student')
                router.refresh()
            }
        } catch (err) {
            setError('An error occurred. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div
            id="main-content"
            className="login-shell"
            role="main"
            aria-label="Login to placement portal"
        >
            <div className="login-panel">
                <div className="login-header">
                    <div className="login-logo">
                        <div className="login-logo-mark">
                            <GraduationCap size={24} />
                        </div>
                        <div className="login-logo-text">
                            <span className="login-logo-title">IPIMP</span>
                            <span className="login-logo-subtitle">Placement Portal</span>
                        </div>
                    </div>
                    <div className="login-heading">
                        <h1>Welcome back</h1>
                        <p>Sign in to track placements, drives, and applications.</p>
                    </div>
                </div>

                {error && (
                    <div className="login-alert" role="alert">
                        <span className="login-alert-icon">!</span>
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <label className="form-label">Email address</label>
                        <div className="input-wrapper">
                            <Mail className="input-icon" size={18} aria-hidden="true" />
                            <input
                                type="email"
                                className="form-input"
                                value={formData.email}
                                onChange={(e) =>
                                    setFormData({ ...formData, email: e.target.value })
                                }
                                required
                                placeholder="name@college.edu"
                                autoComplete="email"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <div className="input-wrapper">
                            <Lock className="input-icon" size={18} aria-hidden="true" />
                            <input
                                type="password"
                                className="form-input"
                                value={formData.password}
                                onChange={(e) =>
                                    setFormData({ ...formData, password: e.target.value })
                                }
                                required
                                placeholder="••••••••"
                                autoComplete="current-password"
                            />
                        </div>
                    </div>

                    <div className="login-meta-row">
                        <label className="login-remember">
                            <input
                                type="checkbox"
                                className="login-remember-checkbox"
                            />
                            <span>Remember me</span>
                        </label>
                        <button
                            type="button"
                            className="login-link-button"
                        >
                            Forgot password?
                        </button>
                    </div>

                    <button
                        type="submit"
                        className="login-submit"
                        disabled={loading}
                    >
                        {loading ? (
                            <Loader2 className="animate-spin" size={20} aria-hidden="true" />
                        ) : (
                            <>
                                <span>Sign in</span>
                                <ArrowRight size={18} aria-hidden="true" />
                            </>
                        )}
                    </button>
                </form>

                <div className="login-footer">
                    <p>
                        Don&apos;t have an account?{' '}
                        <Link href="/register" className="login-link">
                            Create one now
                        </Link>
                    </p>
                </div>

                <div className="login-test-creds">
                    <p className="login-test-title">Test credentials</p>
                    <div className="login-test-row">
                        <span className="login-test-role">Admin</span>
                        <code>admin@college.edu / admin123</code>
                    </div>
                    <div className="login-test-row">
                        <span className="login-test-role">Student</span>
                        <code>student1@college.edu / Student@123</code>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .login-shell {
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background:
                        radial-gradient(circle at top left, #e0f2fe 0, transparent 55%),
                        radial-gradient(circle at bottom right, #ede9fe 0, transparent 55%),
                        #f8fafc;
                    padding: 1.5rem;
                }

                .login-panel {
                    max-width: 440px;
                    width: 100%;
                    background: rgba(255, 255, 255, 0.96);
                    border-radius: 1.5rem;
                    box-shadow: 0 24px 60px rgba(15, 23, 42, 0.16);
                    padding: 2.25rem 2.5rem;
                    border: 1px solid rgba(148, 163, 184, 0.18);
                    display: flex;
                    flex-direction: column;
                    margin: auto;
                }

                @media (max-width: 640px) {
                    .login-panel {
                        padding: 1.75rem 1.75rem 1.9rem;
                        border-radius: 1.25rem;
                    }
                }

                .login-header {
                    margin-bottom: 1.75rem;
                }

                .login-logo {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    margin-bottom: 1.25rem;
                }

                .login-logo-mark {
                    width: 2.5rem;
                    height: 2.5rem;
                    border-radius: 0.9rem;
                    background: linear-gradient(135deg, #4f46e5, #7c3aed);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #ffffff;
                    box-shadow: 0 12px 30px rgba(79, 70, 229, 0.4);
                }

                .login-logo-text {
                    display: flex;
                    flex-direction: column;
                }

                .login-logo-title {
                    font-weight: 800;
                    letter-spacing: -0.03em;
                    font-size: 1.1rem;
                    color: #0f172a;
                }

                .login-logo-subtitle {
                    font-size: 0.75rem;
                    text-transform: uppercase;
                    letter-spacing: 0.14em;
                    color: #64748b;
                }

                .login-heading h1 {
                    font-size: 1.9rem;
                    line-height: 1.15;
                    letter-spacing: -0.03em;
                    font-weight: 800;
                    color: #0f172a;
                    margin: 0 0 0.35rem;
                }

                .login-heading p {
                    margin: 0;
                    font-size: 0.95rem;
                    color: #64748b;
                }

                .login-alert {
                    display: flex;
                    align-items: center;
                    gap: 0.6rem;
                    padding: 0.75rem 0.9rem;
                    border-radius: 0.9rem;
                    background: #fef2f2;
                    border: 1px solid #fecaca;
                    color: #991b1b;
                    font-size: 0.85rem;
                    margin-bottom: 1.25rem;
                }

                .login-alert-icon {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    width: 1.35rem;
                    height: 1.35rem;
                    border-radius: 999px;
                    background: #fee2e2;
                    font-weight: 700;
                    font-size: 0.75rem;
                }

                .login-form {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }

                .form-group {
                    display: flex;
                    flex-direction: column;
                    gap: 0.35rem;
                }

                .form-label {
                    font-size: 0.85rem;
                    font-weight: 600;
                    color: #0f172a;
                }

                .input-wrapper {
                    position: relative;
                }

                .input-icon {
                    position: absolute;
                    left: 0.95rem;
                    top: 50%;
                    transform: translateY(-50%);
                    color: #94a3b8;
                }

                .form-input {
                    padding-left: 2.6rem;
                }

                .login-meta-row {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 0.75rem;
                    margin-top: 0.35rem;
                    margin-bottom: 0.25rem;
                }

                .login-remember {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-size: 0.8rem;
                    color: #64748b;
                    cursor: pointer;
                }

                .login-remember-checkbox {
                    width: 0.95rem;
                    height: 0.95rem;
                    border-radius: 0.3rem;
                    border: 1px solid #cbd5f5;
                    accent-color: #4f46e5;
                }

                .login-link-button {
                    border: none;
                    background: none;
                    padding: 0;
                    margin: 0;
                    font-size: 0.8rem;
                    font-weight: 600;
                    color: #4f46e5;
                    cursor: pointer;
                    text-decoration: none;
                }

                .login-link-button:hover {
                    text-decoration: underline;
                }

                .login-submit {
                    margin-top: 0.75rem;
                    width: 100%;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                    padding: 0.8rem 1.2rem;
                    border-radius: 999px;
                    border: none;
                    background: linear-gradient(135deg, #4f46e5, #0ea5e9);
                    color: #ffffff;
                    font-weight: 700;
                    font-size: 0.95rem;
                    cursor: pointer;
                    box-shadow: 0 18px 40px rgba(79, 70, 229, 0.35);
                    transition: transform 0.1s ease, box-shadow 0.1s ease, filter 0.1s ease;
                }

                .login-submit:hover:not(:disabled) {
                    filter: brightness(1.02);
                    box-shadow: 0 20px 55px rgba(79, 70, 229, 0.4);
                }

                .login-submit:active:not(:disabled) {
                    transform: translateY(1px) scale(0.99);
                    box-shadow: 0 12px 30px rgba(79, 70, 229, 0.32);
                }

                .login-submit:disabled {
                    opacity: 0.7;
                    cursor: default;
                    box-shadow: none;
                }

                .login-footer {
                    margin-top: 1.75rem;
                    font-size: 0.85rem;
                    color: #64748b;
                    text-align: center;
                }

                .login-link {
                    font-weight: 600;
                    color: #4f46e5;
                    text-decoration: none;
                }

                .login-link:hover {
                    text-decoration: underline;
                }

                .login-test-creds {
                    margin-top: 1.75rem;
                    padding: 0.9rem 1rem;
                    border-radius: 0.9rem;
                    background: #0f172a;
                    color: #e5e7eb;
                    font-size: 0.78rem;
                    display: flex;
                    flex-direction: column;
                    gap: 0.35rem;
                }

                .login-test-title {
                    text-transform: uppercase;
                    letter-spacing: 0.14em;
                    font-weight: 600;
                    font-size: 0.7rem;
                    color: #9ca3af;
                    margin-bottom: 0.1rem;
                }

                .login-test-row {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 0.75rem;
                }

                .login-test-role {
                    font-weight: 600;
                    color: #e5e7eb;
                }

                .login-test-creds code {
                    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
                        'Liberation Mono', 'Courier New', monospace;
                    background: rgba(15, 23, 42, 0.9);
                    border-radius: 0.4rem;
                    padding: 0.15rem 0.4rem;
                    color: #e5e7eb;
                }
            `}</style>
        </div>
    )
}
