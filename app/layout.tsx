import './globals.css'
import Script from 'next/script'

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <head>
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1, viewport-fit=cover"
                />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link
                    rel="preconnect"
                    href="https://fonts.gstatic.com"
                    crossOrigin="anonymous"
                />
                <link
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@400;500;600;700;800&display=swap"
                    rel="stylesheet"
                />
                {/* eslint-disable-next-line @next/next/no-sync-scripts */}
                <script src="https://cdn.tailwindcss.com"></script>
                <Script id="tailwind-config" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: `
                    tailwind.config = {
                        theme: {
                            extend: {
                                colors: {
                                    slate: { 50: '#f8fafc', 100: '#f1f5f9', 200: '#e2e8f0', 300: '#cbd5e1', 400: '#94a3b8', 500: '#64748b', 600: '#475569', 700: '#334155', 800: '#1e293b', 900: '#0f172a' }
                                }
                            }
                        }
                    }
                `}} />
            </head>
            <body className="app-root">
                <a href="#main-content" className="skip-to-content">
                    Skip to main content
                </a>
                {children}
            </body>
        </html>
    )
}
