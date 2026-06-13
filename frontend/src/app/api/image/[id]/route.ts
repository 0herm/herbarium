import { readFile } from 'fs/promises'
import { join } from 'path'

const RECIPES_DIR = process.env.RECIPES_DIR || '/herbarium-recipes'
const IMAGE_EXTS = ['.webp', '.jpg', '.jpeg', '.png']

function mimeFor(ext: string) {
    if (ext === '.webp') return 'image/webp'
    if (ext === '.png') return 'image/png'
    return 'image/jpeg'
}

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    if (!id) return Response.json({ error: 'Missing id' }, { status: 400 })

    for (const ext of IMAGE_EXTS) {
        try {
            const data = await readFile(join(RECIPES_DIR, id, `cover${ext}`))
            return new Response(data, { headers: { 'Content-Type': mimeFor(ext) } })
        } catch {
            // try next extension
        }
    }

    return Response.json({ error: 'Image not found' }, { status: 404 })
}
