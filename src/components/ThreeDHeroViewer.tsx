import { useState, useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Box, Loader2, AlertCircle, RefreshCw, MousePointer2, RotateCcw } from "lucide-react"
import { supabase } from "@/integrations/supabase/client"
import '@google/model-viewer'

// Extend JSX for the model-viewer web component
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': any;
    }
  }
}

interface ThreeDHeroViewerProps {
  file: {
    id: string
    filename: string
    r2_object_key?: string
    r2_bucket_name?: string
  }
}

export const ThreeDHeroViewer = ({ file }: ThreeDHeroViewerProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isFetchingUrl, setIsFetchingUrl] = useState(true)
  const [isModelLoading, setIsModelLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const modelViewerRef = useRef<any>(null)

  // Step 1: Fetch the signed URL from R2
  useEffect(() => {
    let isMounted = true

    const fetchPreviewUrl = async () => {
      if (!file.r2_object_key || !file.r2_bucket_name) {
        if (isMounted) {
          setError("File storage information missing")
          setIsFetchingUrl(false)
        }
        return
      }

      setIsFetchingUrl(true)
      setIsModelLoading(true)
      setError(null)
      setPreviewUrl(null)

      try {
        const { data, error: invokeError } = await supabase.functions.invoke('r2-download', {
          body: {
            objectKey: file.r2_object_key,
            bucketName: file.r2_bucket_name,
            fileName: file.filename
          }
        })

        if (invokeError) throw invokeError
        if (!data?.downloadUrl) throw new Error("Could not retrieve model URL")

        if (isMounted) {
          setPreviewUrl(data.downloadUrl)
        }
      } catch (err: any) {
        console.error("3D Hero Viewer Error:", err)
        if (isMounted) {
          setError(err.message || "Failed to load 3D model")
        }
      } finally {
        if (isMounted) {
          setIsFetchingUrl(false)
        }
      }
    }

    fetchPreviewUrl()
    return () => { isMounted = false }
  }, [file.id, file.r2_object_key, file.r2_bucket_name, file.filename])

  // Step 2: Listen to model-viewer's native load/error events to dismiss the spinner
  useEffect(() => {
    const mv = modelViewerRef.current
    if (!mv || !previewUrl) return

    setIsModelLoading(true)

    const handleLoad = () => setIsModelLoading(false)
    const handleError = () => {
      setIsModelLoading(false)
      setError("Failed to render 3D model. The file may be corrupted.")
    }
    const handleProgress = (event: any) => {
      // When totalProgress reaches 1, the model is fully loaded
      if (event?.detail?.totalProgress === 1) {
        setIsModelLoading(false)
      }
    }

    mv.addEventListener('load', handleLoad)
    mv.addEventListener('error', handleError)
    mv.addEventListener('progress', handleProgress)

    return () => {
      mv.removeEventListener('load', handleLoad)
      mv.removeEventListener('error', handleError)
      mv.removeEventListener('progress', handleProgress)
    }
  }, [previewUrl])

  const isLoading = isFetchingUrl || isModelLoading

  const handleRetry = () => {
    setError(null)
    setPreviewUrl(null)
    setIsFetchingUrl(true)
    setIsModelLoading(true)
    // Re-trigger the fetch by toggling — we track via file.id so we need a small trick
    // Actually, just reload the page for simplicity
    window.location.reload()
  }

  return (
    <div className="w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-slate-950 relative group">
      {/* Always-mounted model-viewer (hidden while loading so it can initialize in background) */}
      {previewUrl && (
        <model-viewer
          ref={modelViewerRef}
          src={previewUrl}
          alt={file.filename}
          camera-controls
          auto-rotate
          shadow-intensity="1"
          environment-image="neutral"
          exposure="1"
          touch-action="pan-y"
          style={{
            width: '100%',
            height: '500px',
            background: 'transparent',
            display: isLoading ? 'none' : 'block',
          }}
        >
          {/* Empty slot override to prevent default progress bar */}
          <div slot="progress-bar" />
        </model-viewer>
      )}

      {/* Loading overlay — shown while fetching URL or while model-viewer is rendering */}
      {isLoading && !error && (
        <div className="h-[500px] flex flex-col items-center justify-center gap-4 bg-slate-950">
          <div className="relative">
            <div className="h-20 w-20 rounded-full border-2 border-white/5 flex items-center justify-center">
              <Box className="h-9 w-9 text-white/20" />
            </div>
            <Loader2 className="h-6 w-6 text-primary-teal animate-spin absolute -top-1 -right-1" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-white/80">
              {isFetchingUrl ? "Fetching model…" : "Rendering 3D model…"}
            </p>
            <p className="text-xs text-white/40 mt-1">{file.filename}</p>
          </div>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="h-[500px] flex flex-col items-center justify-center gap-4">
          <AlertCircle className="h-12 w-12 text-destructive/60" />
          <div className="text-center">
            <p className="font-medium text-destructive">{error}</p>
          </div>
          <Button variant="outline" size="sm" onClick={handleRetry} className="gap-2 mt-1">
            <RefreshCw className="h-4 w-4" />
            Retry
          </Button>
        </div>
      )}

      {/* Overlay UI — shown only when model is fully loaded */}
      {!isLoading && !error && previewUrl && (
        <>
          {/* Bottom-left: filename badge */}
          <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
            <div className="bg-black/60 backdrop-blur-md border border-white/10 rounded-full px-3 py-1.5 flex items-center gap-2">
              <Box className="h-3.5 w-3.5 text-orange-400 shrink-0" />
              <span className="text-white/90 text-xs font-medium truncate max-w-[200px]">{file.filename}</span>
            </div>
          </div>

          {/* Top-right: interaction hints */}
          <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <div className="bg-black/60 backdrop-blur-md border border-white/10 rounded-xl px-3 py-2 flex flex-col gap-1.5">
              <div className="flex items-center gap-2 text-white/70 text-xs">
                <MousePointer2 className="h-3 w-3 shrink-0" />
                <span>Drag to rotate</span>
              </div>
              <div className="flex items-center gap-2 text-white/70 text-xs">
                <RotateCcw className="h-3 w-3 shrink-0" />
                <span>Scroll to zoom</span>
              </div>
            </div>
          </div>

          {/* Top-left: "Interactive 3D" badge */}
          <div className="absolute top-4 left-4">
            <div className="bg-orange-500/20 border border-orange-400/30 backdrop-blur-md rounded-full px-3 py-1 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-orange-400 animate-pulse" />
              <span className="text-orange-300 text-xs font-semibold tracking-wide">Interactive 3D</span>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
