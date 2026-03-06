import React from 'react'

interface AvatarProps {
    name: string
    size?: 'sm' | 'md' | 'lg' | 'xl'
    className?: string
    variant?: 'default' | 'gradient' | 'solid'
    color?: 'blue' | 'emerald' | 'amber' | 'purple' | 'indigo'
}

const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-xl',
}

const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    emerald: 'from-emerald-500 to-emerald-600',
    amber: 'from-amber-500 to-amber-600',
    purple: 'from-purple-500 to-purple-600',
    indigo: 'from-indigo-500 to-indigo-600',
}

export default function Avatar({ 
    name, 
    size = 'md', 
    className = '',
    variant = 'gradient',
    color = 'blue'
}: AvatarProps) {
    const initial = name.charAt(0).toUpperCase()
    const sizeClass = sizeClasses[size]
    
    const baseClasses = `rounded-full flex items-center justify-center font-bold text-white shadow-sm ${sizeClass}`
    
    let variantClasses = ''
    if (variant === 'gradient') {
        variantClasses = `bg-gradient-to-br ${colorClasses[color]}`
    } else if (variant === 'solid') {
        const solidColors = {
            blue: 'bg-blue-600',
            emerald: 'bg-emerald-600',
            amber: 'bg-amber-600',
            purple: 'bg-purple-600',
            indigo: 'bg-indigo-600',
        }
        variantClasses = solidColors[color]
    } else {
        variantClasses = `bg-gradient-to-br ${colorClasses[color]}`
    }
    
    return (
        <div className={`${baseClasses} ${variantClasses} ${className}`}>
            {initial}
        </div>
    )
}
