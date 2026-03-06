export function formatDate(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date
    return d.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    })
}

export function formatDateTime(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date
    return d.toLocaleString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    })
}

export function getStatusColor(status: string): string {
    const colors: Record<string, string> = {
        APPLIED: 'blue',
        SHORTLISTED: 'orange',
        INTERVIEWED: 'purple',
        SELECTED: 'green',
        REJECTED: 'red',
    }
    return colors[status] || 'gray'
}

export function getDomainLabel(domain: string): string {
    const labels: Record<string, string> = {
        SOFTWARE_DEV: 'Software Development',
        AI_ML: 'AI / Machine Learning',
        DATA_SCIENCE: 'Data Science',
        DEVOPS: 'DevOps / Cloud',
        CYBER_SECURITY: 'Cyber Security',
        CORE_ENGINEERING: 'Core Engineering',
        NON_IT: 'Non-IT Roles',
    }
    return labels[domain] || domain
}

export function formatCurrency(amount: number): string {
    return `₹${amount.toFixed(2)} LPA`
}
