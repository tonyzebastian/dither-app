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
    <main className={cn("flex flex-col", className)}>
      <div className="flex-1 flex items-center justify-center">
        <div 
          className={`w-full max-w-4xl border-2 border-dashed rounded-3xl ${
            isDragOver 
              ? 'border-blue-400 bg-blue-50' 
              : processedImage 
                ? 'border-gray-300 bg-white'
                : 'border-gray-300 bg-white hover:border-gray-400'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="w-full h-full flex items-center justify-center p-12">
            {processedImage ? (
              <div className="relative max-w-full max-h-full space-y-6">
                <canvas 
                  ref={canvasRef}
                  className="max-w-full max-h-full rounded-2xl shadow-sm bg-white"
                  style={{ 
                    imageRendering: 'pixelated',
                    maxWidth: '100%',
                    height: 'auto'
                  }}
                />
              </div>
            ) : (
              <div className="text-center space-y-6 max-w-md">
                <div className="mx-auto h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center">
                  <Upload className="h-8 w-8 text-gray-400" />
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {isProcessing ? 'Processing image...' : 'Upload Image'}
                  </h3>
                  <p className="text-gray-600 mb-1">
                    {isProcessing ? 'Please wait while we process your image' : 'Drag & drop or click to browse'}
                  </p>
                  <p className="text-sm text-gray-500">
                    Max 5 MB • JPG, PNG, WebP
                  </p>
                </div>

                <Button 
                  variant="outline" 
                  className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
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

      {/* Image Controls - shown when image is loaded */}
      {processedImage && (
        <div className="flex gap-3 justify-center mt-6">
          <Button 
            variant="outline" 
            size="sm"
            className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
            onClick={handleChooseAnother}
            disabled={isProcessing}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Choose Another
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
            onClick={handleRemoveImage}
            disabled={isProcessing}
          >
            <X className="mr-2 h-4 w-4" />
            Remove Image
          </Button>
        </div>
      )}
      
      {/* Error Display */}
      {error && (
        <div className="mt-6">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      )}
      
      {/* Image Info - shown at bottom when image is loaded */}
      {processedImage && (
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            {processedImage.dots?.length || 0} dots • {processedImage.dimensions?.width}×{processedImage.dimensions?.height}px • circle • Size: {dotSize}%
          </p>
        </div>
      )}
    </main>
  )
}