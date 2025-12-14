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
        <>
            <html lang='en' className={`${theme} noscroll`}>
                <body className='w-screen h-screen bg-background text-foreground flex flex-col m-0 p-0 font-[Inter] antialiased align-middle wrap-break-word leading-normal tracking-normal pt-[env(safe-area-inset-top)] pr-[env(safe-area-inset-right)] pb-[env(safe-area-inset-bottom)] pl-[env(safe-area-inset-left)]'>
                    <nav className='fixed top-0 left-0 right-0 w-full border-solid border-b border-accent backdrop-blur z-50 print:hidden pt-[env(safe-area-inset-top)] pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)]'>
                        <NavBar />
                    </nav>
                    <main className='w-full flex grow pt-(--h-navbar) print:pt-0'>
                        {children}
                    </main>
                    <footer className='border-solid border-t border-accent print:hidden'>
                        <Footer />
                    </footer>
                    <Toaster 
                        position='bottom-right'
                        style={
                            {
                                '--normal-bg': '#111111',
                                '--normal-text': 'white',
                                '--normal-border': '#1c1c1c',
                            } as React.CSSProperties
                        }
                    />
                </body>
            </html>
        </>
    )
}
