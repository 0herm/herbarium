'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Upload, Download, X, RefreshCw, ImageIcon, ChevronRight } from 'lucide-react'
import { Button } from '@ui/button'
import Link from 'next/link'

const PREVIEW_W = 960
const PREVIEW_H = 540

export default function ImagePage() {
    const [imageSrc, setImageSrc] = useState<string | null>(null)
    const [imgEl, setImgEl] = useState<HTMLImageElement | null>(null)
    const [filename, setFilename] = useState('image')
    const [focalX, setFocalX] = useState(50)
    const [focalY, setFocalY] = useState(50)
    const [zoom, setZoom] = useState(1)
    const [isFileDrag, setIsFileDrag] = useState(false)
    const [isPanning, setIsPanning] = useState(false)
    const [isProcessing, setIsProcessing] = useState(false)

    const canvasRef = useRef<HTMLCanvasElement>(null)
    const heroCanvasRef = useRef<HTMLCanvasElement>(null)
    const cardCanvasRef = useRef<HTMLCanvasElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)
    const layoutRef = useRef({ scale: 1 })
    const panRef = useRef<{ startX: number, startY: number, startFocalX: number, startFocalY: number } | null>(null)

    const getCrop = useCallback((imgW: number, imgH: number) => {
        const cropW = imgW / zoom
        const cropH = imgH / zoom
        const cropX = Math.max(0, Math.min(imgW - cropW, (focalX / 100) * imgW - cropW / 2))
        const cropY = Math.max(0, Math.min(imgH - cropH, (focalY / 100) * imgH - cropH / 2))
        return { cropW, cropH, cropX, cropY }
    }, [zoom, focalX, focalY])

    const renderContain = (canvas: HTMLCanvasElement, img: HTMLImageElement, cropX: number, cropY: number, cropW: number, cropH: number) => {
        const ctx = canvas.getContext('2d')!
        const cW = canvas.width, cH = canvas.height
        const scale = Math.min(cW / cropW, cH / cropH)
        const drawW = cropW * scale
        const drawH = cropH * scale
        ctx.clearRect(0, 0, cW, cH)
        ctx.drawImage(img, cropX, cropY, cropW, cropH, (cW - drawW) / 2, (cH - drawH) / 2, drawW, drawH)
        return scale
    }

    const renderCover = (canvas: HTMLCanvasElement, img: HTMLImageElement, cropX: number, cropY: number, cropW: number, cropH: number) => {
        const ctx = canvas.getContext('2d')!
        const cW = canvas.width, cH = canvas.height
        const cropAspect = cropW / cropH
        const cardAspect = cW / cH
        let srcX = cropX, srcY = cropY, srcW = cropW, srcH = cropH
        if (cropAspect > cardAspect) {
            srcW = cropH * cardAspect
            srcX = cropX + (cropW - srcW) / 2
        } else {
            srcH = cropW / cardAspect
            srcY = cropY + (cropH - srcH) / 2
        }
        ctx.clearRect(0, 0, cW, cH)
        ctx.drawImage(img, srcX, srcY, srcW, srcH, 0, 0, cW, cH)
    }

    const renderAll = useCallback(() => {
        if (!imgEl) return
        const { naturalWidth: imgW, naturalHeight: imgH } = imgEl
        const { cropW, cropH, cropX, cropY } = getCrop(imgW, imgH)

        if (canvasRef.current) {
            const scale = renderContain(canvasRef.current, imgEl, cropX, cropY, cropW, cropH)
            layoutRef.current = { scale }
        }
        if (heroCanvasRef.current) renderContain(heroCanvasRef.current, imgEl, cropX, cropY, cropW, cropH)
        if (cardCanvasRef.current) renderCover(cardCanvasRef.current, imgEl, cropX, cropY, cropW, cropH)
    }, [imgEl, getCrop])

    useEffect(() => { renderAll() }, [renderAll])

    const handleFile = (file: File) => {
        if (!file.type.startsWith('image/')) return
        if (imageSrc) URL.revokeObjectURL(imageSrc)
        setFocalX(50)
        setFocalY(50)
        setZoom(1)
        setFilename(file.name.replace(/\.[^.]+$/, ''))
        const url = URL.createObjectURL(file)
        setImageSrc(url)
        const img = new Image()
        img.onload = () => setImgEl(img)
        img.src = url
    }

    const panStart = (clientX: number, clientY: number) => {
        panRef.current = { startX: clientX, startY: clientY, startFocalX: focalX, startFocalY: focalY }
        setIsPanning(true)
    }

    const panMove = (clientX: number, clientY: number) => {
        if (!panRef.current || !imgEl) return
        const canvas = canvasRef.current!
        const rect = canvas.getBoundingClientRect()
        const dx = (clientX - panRef.current.startX) * PREVIEW_W / rect.width
        const dy = (clientY - panRef.current.startY) * PREVIEW_H / rect.height
        const { scale } = layoutRef.current
        setFocalX(Math.max(0, Math.min(100, panRef.current.startFocalX - (dx / scale / imgEl.naturalWidth) * 100)))
        setFocalY(Math.max(0, Math.min(100, panRef.current.startFocalY - (dy / scale / imgEl.naturalHeight) * 100)))
    }

    const panEnd = () => { panRef.current = null; setIsPanning(false) }

    const reset = () => { setFocalX(50); setFocalY(50); setZoom(1) }

    const clear = () => {
        if (imageSrc) URL.revokeObjectURL(imageSrc)
        setImageSrc(null)
        setImgEl(null)
        setFilename('image')
        reset()
    }

    const download = () => {
        if (!imgEl) return
        setIsProcessing(true)
        const { naturalWidth: imgW, naturalHeight: imgH } = imgEl
        const { cropW, cropH, cropX, cropY } = getCrop(imgW, imgH)
        const maxSize = 1920
        const scale = Math.min(1, maxSize / Math.max(cropW, cropH))
        const canvas = document.createElement('canvas')
        canvas.width = Math.round(cropW * scale)
        canvas.height = Math.round(cropH * scale)
        const ctx = canvas.getContext('2d')!
        ctx.drawImage(imgEl, cropX, cropY, cropW, cropH, 0, 0, canvas.width, canvas.height)
        canvas.toBlob(blob => {
            if (!blob) { setIsProcessing(false); return }
            const a = document.createElement('a')
            a.href = URL.createObjectURL(blob)
            a.download = `${filename}.webp`
            a.click()
            URL.revokeObjectURL(a.href)
            setIsProcessing(false)
        }, 'image/webp', 0.82)
    }

    return (
        <div className='min-h-[calc(100vh-var(--h-navbar))] bg-linear-to-b from-background to-muted/10'>
            <div className='max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12'>

                <nav className='flex items-center gap-2 text-sm text-muted-foreground mb-6'>
                    <Link href='/' className='hover:text-foreground transition-colors'>Hjem</Link>
                    <ChevronRight className='h-4 w-4' />
                    <span className='text-foreground font-medium'>Image</span>
                </nav>

                <div className='flex items-center gap-3 mb-8'>
                    <div className='p-3 rounded-xl bg-primary/10'>
                        <ImageIcon className='h-6 w-6 text-primary' />
                    </div>
                    <div>
                        <h1 className='text-2xl font-bold text-foreground'>Image Converter</h1>
                        <p className='text-sm text-muted-foreground'>Convert to WebP · Max 1920px · Quality 82</p>
                    </div>
                </div>

                {!imageSrc ? (
                    <div
                        className={`border-2 border-dashed rounded-2xl p-16 text-center cursor-pointer transition-colors ${isFileDrag ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50 hover:bg-accent/30'}`}
                        onDragOver={e => { e.preventDefault(); setIsFileDrag(true) }}
                        onDragLeave={() => setIsFileDrag(false)}
                        onDrop={e => { e.preventDefault(); setIsFileDrag(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f) }}
                        onClick={() => inputRef.current?.click()}
                    >
                        <Upload className='h-10 w-10 text-muted-foreground mx-auto mb-4' />
                        <p className='text-base font-medium mb-1'>Click or drag to add photo</p>
                        <p className='text-sm text-muted-foreground'>JPG · PNG · WebP · GIF</p>
                        <input
                            ref={inputRef}
                            type='file'
                            accept='image/jpeg,image/png,image/webp,image/gif'
                            className='hidden'
                            onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
                        />
                    </div>
                ) : (
                    <div className='space-y-5'>
                        <canvas
                            ref={canvasRef}
                            width={PREVIEW_W}
                            height={PREVIEW_H}
                            className={`w-full rounded-2xl bg-muted/30 shadow-lg select-none ${isPanning ? 'cursor-grabbing' : 'cursor-grab'}`}
                            onMouseDown={e => panStart(e.clientX, e.clientY)}
                            onMouseMove={e => panMove(e.clientX, e.clientY)}
                            onMouseUp={panEnd}
                            onMouseLeave={panEnd}
                            onTouchStart={e => { const t = e.touches[0]; panStart(t.clientX, t.clientY) }}
                            onTouchMove={e => { e.preventDefault(); const t = e.touches[0]; panMove(t.clientX, t.clientY) }}
                            onTouchEnd={panEnd}
                        />

                        <div className='bg-card rounded-xl border border-border p-5 space-y-4'>
                            <p className='text-xs font-semibold text-muted-foreground uppercase tracking-wide'>Crop &amp; Focus</p>
                            <div className='flex items-center gap-4'>
                                <span className='text-sm text-muted-foreground w-10'>Zoom</span>
                                <input
                                    type='range' min='1' max='3' step='0.05' value={zoom}
                                    onChange={e => setZoom(parseFloat(e.target.value))}
                                    className='flex-1 accent-primary'
                                />
                                <span className='text-sm font-medium w-10 text-right'>{zoom.toFixed(1)}×</span>
                                <Button variant='ghost' size='sm' onClick={reset} className='gap-1.5'>
                                    <RefreshCw className='h-3.5 w-3.5' />
                                    Reset
                                </Button>
                            </div>
                            <p className='text-xs text-muted-foreground'>Drag to pan · zoom slider to crop</p>
                        </div>

                        <div className='bg-card rounded-xl border border-border p-5 space-y-5'>
                            <p className='text-xs font-semibold text-muted-foreground uppercase tracking-wide'>Preview</p>

                            <div className='space-y-2'>
                                <p className='text-xs text-muted-foreground'>Recipe page</p>
                                <canvas
                                    ref={heroCanvasRef}
                                    width={960}
                                    height={405}
                                    className='w-full rounded-xl bg-muted/30'
                                />
                            </div>

                            <div className='space-y-2'>
                                <p className='text-xs text-muted-foreground'>Card</p>
                                <div className='w-48 rounded-xl overflow-hidden border border-border/50 bg-card shadow-sm'>
                                    <canvas
                                        ref={cardCanvasRef}
                                        width={320}
                                        height={240}
                                        className='w-full block bg-muted/30'
                                    />
                                    <div className='p-3 space-y-2'>
                                        <div className='h-3.5 w-3/4 rounded-full bg-foreground/10' />
                                        <div className='flex gap-2'>
                                            <div className='h-2.5 w-12 rounded-full bg-muted-foreground/20' />
                                            <div className='h-2.5 w-10 rounded-full bg-muted-foreground/20' />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='flex gap-3'>
                            <Button onClick={download} disabled={isProcessing} className='flex-1 gap-2'>
                                <Download className='h-4 w-4' />
                                {isProcessing ? 'Processing…' : 'Download as WebP'}
                            </Button>
                            <Button variant='outline' onClick={clear} className='gap-2'>
                                <X className='h-4 w-4' />
                                Remove
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
