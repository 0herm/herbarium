import { cookies } from 'next/headers'
import config from '../../constants'

const baseUrl = config.url.API

type ApiRequestProps = {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
    path: string
    data?: unknown
    options?: RequestInit
}

async function apiRequest({ method, path, data, options = {} }: ApiRequestProps) {
    const Cookies = await cookies()
    const token = Cookies.get('__Secure-better-auth.session_token')?.value || ''

    const headers: Record<string, string> = {
        Authorization: `Bearer ${token}`,
    }

    const defaultOptions: RequestInit = {
        method,
        headers,
    }

    if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH' || method === 'DELETE')) {
        headers['Content-Type'] = 'application/json'
        defaultOptions.body = JSON.stringify(data)
    }

    const finalOptions = { ...defaultOptions, ...options }

    try {
        const response = await fetch(`${baseUrl}${path}`, finalOptions)

        if (!response.ok) {
            console.error('API request failed:', await response.text())
            throw new Error(`API request failed with status ${response.status}`)
        }

        if (response.status === 204) {
            return {}
        }

        return await response.json()
    } catch (error: unknown) {
        console.error('API request error:', error)
        return { error: (error as Error).message || 'Unknown error' }
    }
}

export async function getWrapper({ path, options = {} }: { path: string; options?: RequestInit }) {
    return await apiRequest({ method: 'GET', path, options })
}

export async function postWrapper({ path, data }: { path: string; data: unknown }) {
    return await apiRequest({ method: 'POST', path, data })
}

export async function putWrapper({ path, data }: { path: string; data: unknown }) {
    return await apiRequest({ method: 'PUT', path, data })
}

export async function deleteWrapper({ path, data, options }: { path: string; data?: unknown; options?: RequestInit }) {
    return await apiRequest({ method: 'DELETE', path, data, options })
}

export async function patchWrapper({ path, data = {}, options = {} }: { path: string; data?: unknown; options?: RequestInit }) {
    return await apiRequest({ method: 'PATCH', path, data, options })
}