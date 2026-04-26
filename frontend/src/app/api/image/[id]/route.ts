import config from '@config'

export async function GET( req: Request, { params }: { params: Promise<{ id: string }> } ) {
    const { id } = await params
    if (!id) {
        return Response.json({ error: 'Missing id' }, { status: 400 })
    }
    try {
        const res = await fetch(`${config.url.API}/image/${id}`)
        
        if (!res.ok) {
            if (res.status === 404) return Response.json({ error: 'Image not found' }, { status: 404 })
            return Response.json({ error: 'Internal server error' }, { status: 500 })
        }

        return new Response(res.body, {
            status: 200,
            headers: {
                'Content-Type': 'image/webp',
            },
        })
    } catch {
        return Response.json({ error: 'Internal server error' }, { status: 500 })
    }
}
