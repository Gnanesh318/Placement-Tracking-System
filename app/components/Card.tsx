import React from 'react'

interface CardProps {
    title?: string
    children: React.ReactNode
    className?: string
    style?: React.CSSProperties
    variant?: 'default' | 'glass'
}

export default function Card({
    title,
    children,
    className = '',
    style,
    variant = 'default',
}: CardProps) {
    const baseClass = variant === 'glass' ? 'card glass' : 'card'
    return (
        <div className={`${baseClass} ${className}`} style={style}>
            {title && (
                <div className="mb-5 border-b border-slate-100 pb-4">
                    <h3 className="text-lg font-bold text-slate-900">{title}</h3>
                </div>
            )}
            <div className="card-content">
                {children}
            </div>
        </div>
    )
}
