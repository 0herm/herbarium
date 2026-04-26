import { NextRequest, NextResponse } from 'next/server'

export async function proxy(req: NextRequest) {
    const theme = req.cookies.get('theme')?.value || 'dark' as Theme
    const res = NextResponse.next()
    res.headers.set('x-theme', theme)
    return res
}
