import { useEffect, useRef, useState, useCallback } from "react"
import { Button } from "./ui/button"
import { Alert, AlertDescription } from "./ui/alert"
import { Upload, AlertCircle, Loader2, X, RefreshCw } from "lucide-react"
import { cn } from "../lib/utils"
import { DitheredRenderer } from "../utils/DitheredRenderer"
import { AnimationController } from "../utils/AnimationController"
import { useImageProcessor } from "../hooks/useImageProcessor"

export default function MainCanvas({ 
  className, 
  processedImage, 
  onImageProcessed,
  colorCount = 32,
  dotShape = 'circle',
  dotSize = 40,
  isMonochrome = false,
  animationType = 'ripple',
  isPlaying = false,
  backgroundColor = 'white'
}) {
  const canvasRef = useRef(null)
  const animationControllerRef = useRef(new AnimationController())
  const [isDragOver, setIsDragOver] = useState(false)
  const { processImage, isProcessing, error } = useImageProcessor()

  const handleFileSelect = useCallback(async (files) => {
    const file = files[0]
    if (!file) return

    try {
      const result = await processImage(file, {
        dotCount: 5000,
        colorCount: colorCount,
        adaptiveSizing: false
      })
      
      if (onImageProcessed) {
        onImageProcessed(result)
      }
    } catch (error) {
      console.error("Image processing failed:", error)
    }
  }, [processImage, onImageProcessed, colorCount])

  const handleChooseAnother = () => {
    console.log('Choose another clicked')
    const fileInput = document.getElementById('file-input')
    if (fileInput) {
      fileInput.click()
    }
  }

  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setIsDragOver(false)
    const files = Array.from(e.dataTransfer.files)
    handleFileSelect(files)
  }, [handleFileSelect])

  const handleFileInputChange = useCallback((e) => {
    const files = Array.from(e.target.files)
    handleFileSelect(files)
  }, [handleFileSelect])

  const handleRemoveImage = () => {
    if (onImageProcessed) {
      onImageProcessed(null)
    }
  }

  // Effect for setting up canvas and dots when image changes
  useEffect(() => {
    if (!processedImage || !canvasRef.current) return

    const canvas = canvasRef.current
    const { dots, dimensions } = processedImage

    // Set canvas size to match processed image
    canvas.width = dimensions.width
    canvas.height = dimensions.height

    // Apply size scaling to dots
    const scaledDots = dots.map(dot => ({
      ...dot, 
      size: (dot.size || 1) * (dotSize / 70) // Scale based on dotSize slider
    }))

    // Apply monochrome if enabled
    const finalDots = isMonochrome ? scaledDots.map(dot => {
      const gray = Math.round(0.299 * dot.r + 0.587 * dot.g + 0.114 * dot.b)
      return {
        ...dot,
        r: gray,
        g: gray, 
        b: gray
      }
    }) : scaledDots

    // Stop any existing animation
    animationControllerRef.current.stop()

    if (isPlaying) {
      // Start animation with current settings
      animationControllerRef.current.start(canvas, finalDots, animationType, backgroundColor)
    } else {
      // Render static frame
      DitheredRenderer.renderDots(canvas, finalDots, dotShape, backgroundColor)
    }

    console.log('Canvas updated with:', {
      dotShape,
      dotSize,
      isMonochrome,
      animationType,
      isPlaying,
      dotCount: finalDots.length
    })
  }, [processedImage, dotShape, dotSize, isMonochrome, backgroundColor])

  // Effect for handling animation play/pause state changes
  useEffect(() => {
    if (!processedImage || !canvasRef.current) return

    const controller = animationControllerRef.current
    const canvas = canvasRef.current
    const { dots, dimensions } = processedImage

    // Prepare dots with current settings
    const scaledDots = dots.map(dot => ({
      ...dot,
      size: (dot.size || 1) * (dotSize / 70)
    }))

    const finalDots = isMonochrome ? scaledDots.map(dot => {
      const gray = Math.round(0.299 * dot.r + 0.587 * dot.g + 0.114 * dot.b)
      return {
        ...dot,
        r: gray,
        g: gray,
        b: gray
      }
    }) : scaledDots

    if (isPlaying) {
      controller.stop() // Stop any existing animation
      controller.start(canvas, finalDots, animationType, backgroundColor)
    } else {
      controller.pause()
      // Render static frame when paused
      DitheredRenderer.renderDots(canvas, finalDots, dotShape, backgroundColor)
    }
  }, [isPlaying, animationType])

  // Effect for updating animation type while playing
  useEffect(() => {
    if (isPlaying && processedImage) {
      animationControllerRef.current.setAnimationType(animationType)
    }
  }, [animationType, isPlaying, processedImage])

  // Cleanup animation on unmount
  useEffect(() => {
    return () => {
      animationControllerRef.current.stop()
    }
  }, [])

  return (
    <main className={cn("flex flex-col min-h-full", className)}>
      <div className="flex-1 flex items-center justify-center">
        <div 
          className={`${processedImage ? 'w-fit' : 'w-full'} border ${
            processedImage ? '' : 'aspect-[4/3]'
          } ${
            isDragOver 
              ? 'border-blue-400 bg-blue-50' 
              : processedImage 
                ? 'border-slate-400 bg-white rounded-lg'
                : 'border-dashed  border-slate-300 bg-slate-50/50 hover:border-slate-400 rounded-lg'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className={`${processedImage ? 'w-fit' : 'w-full h-full'} flex flex-col items-center justify-center ${processedImage ? 'p-6' : 'p-12'} relative`}>
            {processedImage ? (
              <>
                <div className="flex items-center justify-center w-full">
                  <canvas 
                    ref={canvasRef}
                    className="bg-white"
                    style={{ 
                      imageRendering: 'pixelated'
                    }}
                  />
                </div>
                
                {/* Image Controls - inside container */}
                <div className="flex gap-3 mt-6">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="bg-white border-slate-300 text-slate-700 hover:bg-slate-50"
                    onClick={handleChooseAnother}
                    disabled={isProcessing}
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Choose Another
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="bg-white border-slate-300 text-slate-700 hover:bg-slate-50"
                    onClick={handleRemoveImage}
                    disabled={isProcessing}
                  >
                    <X className="mr-2 h-4 w-4" />
                    Remove Image
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center space-y-6 max-w-md">
                <div className="mx-auto h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center">
                  <Upload className="h-6 w-6 text-slate-400" />
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">
                    {isProcessing ? 'Processing image...' : 'Upload Image'}
                  </h3>
                  <p className="text-slate-600 mb-1">
                    {isProcessing ? 'Please wait while we process your image' : 'Drag & drop or click to browse'}
                  </p>
                  <p className="text-sm text-slate-500">
                    Max 5 MB • JPG, PNG, WebP
                  </p>
                </div>

                <Button 
                  variant="outline" 
                  className="bg-white border-slate-300 text-slate-700 hover:bg-slate-50"
                  onClick={() => document.getElementById('file-input').click()}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Choose Image'
                  )}
                </Button>
                
                <input
                  id="file-input"
                  type="file"
                  accept="image/*"
                  onChange={handleFileInputChange}
                  className="hidden"
                />
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Error Display */}
      {error && (
        <div className="mt-6">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      )}
    </main>
  )
}