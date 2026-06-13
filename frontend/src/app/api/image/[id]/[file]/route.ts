import { readFile } from 'fs/promises'
import { join } from 'path'

const RECIPES_DIR = process.env.RECIPES_DIR || '/herbarium-recipes'
const IMAGE_EXTS = ['.webp', '.jpg', '.jpeg', '.png']

function mimeFor(ext: string) {
    if (ext === '.webp') return 'image/webp'
    if (ext === '.png') return 'image/png'
    return 'image/jpeg'
}

export async function GET(_req: Request, { params }: { params: Promise<{ id: string; file: string }> }) {
    const { id, file } = await params
    const ext = IMAGE_EXTS.find(e => file.endsWith(e))
    if (!ext) return Response.json({ error: 'Unsupported image format' }, { status: 400 })

    try {
        const data = await readFile(join(RECIPES_DIR, id, file))
        return new Response(data, { headers: { 'Content-Type': mimeFor(ext) } })
    } catch {
        return Response.json({ error: 'Image not found' }, { status: 404 })
    }
}
