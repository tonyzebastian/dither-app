import { useEffect, useRef, useState, useCallback } from "react"
import { Card } from "./ui/card"
import { Button } from "./ui/button"
import { Alert, AlertDescription } from "./ui/alert"
import { Upload, FileImage, AlertCircle, Loader2, X, RefreshCw } from "lucide-react"
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
    <main className={cn("flex flex-col", className)}>
      <div className="flex-1 flex items-center justify-center">
        <Card 
          className={`w-full max-w-4xl border-2 border-dashed ${
            isDragOver 
              ? 'border-primary bg-primary/5' 
              : processedImage 
                ? 'border-muted-foreground/25 bg-muted/10'
                : 'border-muted-foreground/25 bg-muted/10 hover:border-muted-foreground/50 hover:bg-muted/5'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="w-full h-full flex items-center justify-center p-8">
            {processedImage ? (
              <div className="relative max-w-full max-h-full space-y-4">
                <canvas 
                  ref={canvasRef}
                  className="max-w-full max-h-full border rounded shadow-sm bg-white"
                  style={{ 
                    imageRendering: 'pixelated',
                    maxWidth: '100%',
                    height: 'auto'
                  }}
                />
                
                {/* Image Controls */}
                <div className="flex gap-2 justify-center">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleChooseAnother}
                    disabled={isProcessing}
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Choose Another
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleRemoveImage}
                    disabled={isProcessing}
                  >
                    <X className="mr-2 h-4 w-4" />
                    Remove Image
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-4 max-w-md">
                <div className="mx-auto h-16 w-16 rounded-full bg-muted/20 flex items-center justify-center">
                  <Upload className="h-8 w-8 text-muted-foreground" />
                </div>
                
                <div>
                  <h3 className="text-lg font-medium">
                    {isProcessing ? 'Processing image...' : 'Upload an image'}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {isProcessing ? 'Please wait while we process your image' : 'Drag and drop or click to browse'}
                  </p>
                  <p className="text-xs text-muted-foreground/75 mt-1">
                    Max 5MB • JPG, PNG, WebP
                  </p>
                </div>

                <Button 
                  variant="outline" 
                  onClick={() => document.getElementById('file-input').click()}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <FileImage className="mr-2 h-4 w-4" />
                      Choose File
                    </>
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
        </Card>
      </div>
      
      {/* Error Display */}
      {error && (
        <div className="mt-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      )}
      
      {/* Status Bar */}
      <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground bg-muted/20 rounded px-3 py-2">
        <span>
          {processedImage 
            ? (isPlaying ? `▶ Animating (${animationType})` : 'Image processed')
            : 'Ready'
          }
        </span>
        <span>
          {processedImage 
            ? `${processedImage.dots?.length || 0} dots • ${processedImage.dimensions?.width}×${processedImage.dimensions?.height}px • ${dotShape} • Size: ${dotSize}% ${isMonochrome ? '• Mono' : ''}`
            : 'No image loaded'
          }
        </span>
      </div>
    </main>
  )
}