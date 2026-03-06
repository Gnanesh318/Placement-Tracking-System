import React from 'react'
import { getStatusColor } from '@/lib/utils'

interface BadgeProps {
    status: string
    children: React.ReactNode
    className?: string
}

export default function Badge({ status, children, className = '' }: BadgeProps) {
    const color = getStatusColor(status)

    return (
        <span className={`badge badge-${color} shadow-sm border border-opacity-10 ${className}`}>
            {children}
        </span>
    )
}
