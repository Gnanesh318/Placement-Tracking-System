import './globals.css'

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
