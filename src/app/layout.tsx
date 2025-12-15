import type { Metadata, Viewport } from 'next'
import './globals.css'

import NavBar from '@/components/nav/nav'
import Footer from '@/components/footer/footer'
import { Toaster } from '@/components/ui/sonner'
import { cookies } from 'next/headers'
import { siteName, siteDescription, siteKeywords } from '@text'

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    viewportFit: 'cover',
    userScalable: false
}

export const metadata: Metadata = {
    title: siteName,
    description: siteDescription,
    keywords: siteKeywords,
    appleWebApp: {
        capable: true,
        statusBarStyle: 'black-translucent'
    }
}

export default async function RootLayout({ children }: Readonly<{children: React.ReactNode}>) {
    const Cookies = await cookies()
    const theme = Cookies.get('theme')?.value || 'dark'

    return (
        <html lang='en' className={`${theme} noscroll`} suppressHydrationWarning>
            <body className='min-h-screen w-full bg-background text-foreground flex flex-col m-0 p-0 font-[Inter] antialiased leading-relaxed tracking-normal overflow-x-hidden pt-[env(safe-area-inset-top)] pr-[env(safe-area-inset-right)] pb-[env(safe-area-inset-bottom)] pl-[env(safe-area-inset-left)]'>
                <nav className='fixed top-0 left-0 right-0 w-full bg-background/80 border-b border-border/50 backdrop-blur-xl z-50 print:hidden pt-[env(safe-area-inset-top)] pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)] shadow-sm'>
                    <NavBar />
                </nav>
                <main className='flex-1 w-full pt-(--h-navbar) print:pt-0'>
                    {children}
                </main>
                <footer className='w-full border-t border-border/50 bg-card/50 backdrop-blur-sm print:hidden'>
                    <Footer />
                </footer>
                <Toaster 
                    position='bottom-right'
                    toastOptions={{
                        className: 'bg-card border-border text-card-foreground shadow-lg',
                    }}
                />
            </body>
        </html>
    )
}
