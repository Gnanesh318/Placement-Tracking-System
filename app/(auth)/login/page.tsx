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
        <div id="main-content" className="login-shell" role="main" aria-label="Login to placement portal">
            {/* Left Branding Panel */}
            <div className="login-left">
                <div className="login-left-content">
                    <div className="login-brand">
                        <div className="login-logo-mark">
                            <GraduationCap size={28} />
                        </div>
                        <span className="login-brand-name">Lumina</span>
                    </div>
                    <div className="login-left-hero">
                        <h2>Your Career Journey<br />Starts Here.</h2>
                        <p>Track placements, explore drives, and land your dream job — all in one premium portal.</p>
                    </div>
                    <div className="login-left-stats">
                        <div className="lstat">
                            <div className="lstat-value">98%</div>
                            <div className="lstat-label">Placement Rate</div>
                        </div>
                        <div className="lstat-divider"></div>
                        <div className="lstat">
                            <div className="lstat-value">500+</div>
                            <div className="lstat-label">Companies</div>
                        </div>
                        <div className="lstat-divider"></div>
                        <div className="lstat">
                            <div className="lstat-value">12k+</div>
                            <div className="lstat-label">Students</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Form Panel */}
            <div className="login-right">
                <div className="login-panel">
                    <div className="login-heading">
                        <h1>Welcome back</h1>
                        <p>Sign in to your placement portal account.</p>
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
                                <span className="input-icon"><Mail size={18} aria-hidden="true" /></span>
                                <input
                                    type="email"
                                    className="form-input"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                    placeholder="name@college.edu"
                                    autoComplete="email"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Password</label>
                            <div className="input-wrapper">
                                <span className="input-icon"><Lock size={18} aria-hidden="true" /></span>
                                <input
                                    type="password"
                                    className="form-input"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required
                                    placeholder="••••••••"
                                    autoComplete="current-password"
                                />
                            </div>
                        </div>

                        <button type="submit" className="login-submit" disabled={loading}>
                            {loading ? (
                                <Loader2 className="animate-spin" size={20} />
                            ) : (
                                <>
                                    <span>Sign in</span>
                                    <ArrowRight size={18} />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="login-footer">
                        <p>Don&apos;t have an account?{' '}
                            <Link href="/register" className="login-link">Create one now</Link>
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
            </div>

            <style jsx>{`
                .login-shell {
                    min-height: 100vh;
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    overflow: hidden;
                }

                @media (max-width: 900px) {
                    .login-shell { grid-template-columns: 1fr; }
                    .login-left { display: none; }
                }

                /* === LEFT PANEL === */
                .login-left {
                    background: #000000;
                    position: relative;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    overflow: hidden;
                    padding: 3rem;
                }

                .login-left::before {
                    content: '';
                    position: absolute;
                    width: 500px; height: 500px;
                    border-radius: 50%;
                    background: radial-gradient(circle, rgba(99,102,241,0.4) 0, transparent 70%);
                    top: -100px; right: -100px;
                    pointer-events: none;
                }

                .login-left::after {
                    content: '';
                    position: absolute;
                    width: 350px; height: 350px;
                    border-radius: 50%;
                    background: radial-gradient(circle, rgba(16,185,129,0.2) 0, transparent 70%);
                    bottom: -80px; left: -80px;
                    pointer-events: none;
                }

                .login-left-content {
                    position: relative;
                    z-index: 10;
                    max-width: 400px;
                    width: 100%;
                }

                .login-brand {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    margin-bottom: 4rem;
                }

                .login-logo-mark {
                    width: 2.75rem;
                    height: 2.75rem;
                    border-radius: 12px;
                    background: linear-gradient(135deg, #6366f1, #8b5cf6);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #ffffff;
                    box-shadow: 0 8px 24px rgba(99, 102, 241, 0.5);
                }

                .login-brand-name {
                    font-family: var(--font-heading);
                    font-size: 1.5rem;
                    font-weight: 800;
                    color: #ffffff;
                    letter-spacing: -0.04em;
                }

                .login-left-hero h2 {
                    font-family: var(--font-heading);
                    font-size: 3.5rem;
                    font-weight: 800;
                    line-height: 1.1;
                    letter-spacing: -0.04em;
                    color: #ffffff;
                    margin-bottom: 1.25rem;
                }

                .login-left-hero p {
                    font-size: 1rem;
                    color: #a1a1aa;
                    line-height: 1.7;
                    margin-bottom: 3rem;
                }

                .login-left-stats {
                    display: flex;
                    align-items: center;
                    gap: 2rem;
                    padding: 1.5rem;
                    background: rgba(255,255,255,0.04);
                    border: 1px solid rgba(255,255,255,0.08);
                    border-radius: 16px;
                    backdrop-filter: blur(8px);
                }

                .lstat-divider {
                    width: 1px;
                    height: 40px;
                    background: rgba(255,255,255,0.1);
                }

                .lstat-value {
                    font-family: var(--font-heading);
                    font-size: 1.75rem;
                    font-weight: 800;
                    color: #ffffff;
                    letter-spacing: -0.03em;
                }

                .lstat-label {
                    font-size: 0.7rem;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.08em;
                    color: #71717a;
                    margin-top: 0.25rem;
                }

                /* === RIGHT PANEL === */
                .login-right {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 3rem;
                    background: #fafafa;
                }

                .login-panel {
                    max-width: 420px;
                    width: 100%;
                    background: #ffffff;
                    border-radius: 24px;
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.05);
                    padding: 2.5rem;
                    border: 1px solid #e4e4e7;
                }

                .login-heading {
                    margin-bottom: 2rem;
                }

                .login-heading h1 {
                    font-family: var(--font-heading);
                    font-size: 2rem;
                    font-weight: 800;
                    color: #09090b;
                    letter-spacing: -0.04em;
                    margin: 0 0 0.5rem;
                }

                .login-heading p {
                    font-size: 0.9rem;
                    color: #71717a;
                    margin: 0;
                }

                .login-alert {
                    display: flex;
                    align-items: center;
                    gap: 0.6rem;
                    padding: 0.875rem 1rem;
                    border-radius: 12px;
                    background: #fef2f2;
                    border: 1px solid #fecaca;
                    color: #991b1b;
                    font-size: 0.875rem;
                    font-weight: 500;
                    margin-bottom: 1.5rem;
                }

                .login-alert-icon {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    width: 1.4rem;
                    height: 1.4rem;
                    border-radius: 50%;
                    background: #fee2e2;
                    font-weight: 800;
                    font-size: 0.75rem;
                    flex-shrink: 0;
                }

                .login-form {
                    display: flex;
                    flex-direction: column;
                    gap: 1.25rem;
                }

                .form-group {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }

                .form-label {
                    font-size: 0.875rem;
                    font-weight: 600;
                    color: #09090b;
                }

                .input-wrapper { position: relative; }

                .input-icon {
                    position: absolute;
                    left: 0.875rem;
                    top: 50%;
                    transform: translateY(-50%);
                    color: #a1a1aa;
                    pointer-events: none;
                }

                .form-input {
                    width: 100%;
                    padding: 0.75rem 1rem 0.75rem 2.75rem;
                    border: 1px solid #e4e4e7;
                    border-radius: 12px;
                    font-size: 0.9375rem;
                    color: #09090b;
                    background: #fafafa;
                    outline: none;
                    transition: all 0.2s ease;
                    box-sizing: border-box;
                }

                .form-input:focus {
                    border-color: #000000;
                    background: #ffffff;
                    box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.07);
                }

                .login-submit {
                    margin-top: 0.5rem;
                    width: 100%;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                    padding: 0.875rem 1.25rem;
                    border-radius: 12px;
                    border: none;
                    background: #000000;
                    color: #ffffff;
                    font-weight: 700;
                    font-size: 0.9375rem;
                    cursor: pointer;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                    transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
                }

                .login-submit:hover:not(:disabled) {
                    background: #27272a;
                    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
                    transform: translateY(-1px);
                }

                .login-submit:active:not(:disabled) {
                    transform: translateY(0) scale(0.98);
                }

                .login-submit:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }

                .login-footer {
                    margin-top: 1.5rem;
                    font-size: 0.875rem;
                    color: #71717a;
                    text-align: center;
                }

                .login-link {
                    font-weight: 700;
                    color: #000000;
                    text-decoration: none;
                }

                .login-link:hover { text-decoration: underline; }

                .login-test-creds {
                    margin-top: 1.5rem;
                    padding: 1rem;
                    border-radius: 12px;
                    background: #f4f4f5;
                    border: 1px solid #e4e4e7;
                    font-size: 0.78rem;
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }

                .login-test-title {
                    text-transform: uppercase;
                    letter-spacing: 0.08em;
                    font-weight: 700;
                    font-size: 0.65rem;
                    color: #a1a1aa;
                    margin-bottom: 0.25rem;
                }

                .login-test-row {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 0.75rem;
                }

                .login-test-role {
                    font-weight: 700;
                    color: #09090b;
                }

                .login-test-creds code {
                    font-family: ui-monospace, monospace;
                    background: #ffffff;
                    border: 1px solid #e4e4e7;
                    border-radius: 6px;
                    padding: 0.15rem 0.5rem;
                    color: #09090b;
                    font-size: 0.75rem;
                }
            `}</style>
        </div>
    )
}
