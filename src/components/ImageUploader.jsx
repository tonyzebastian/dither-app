import { useState, useCallback } from 'react'
import { Card, CardContent } from "./ui/card"
import { Button } from "./ui/button"
import { Alert, AlertDescription } from "./ui/alert"
import { Upload, FileImage, AlertCircle, Loader2 } from "lucide-react"
import { useImageProcessor } from "../hooks/useImageProcessor"

export default function ImageUploader({ onImageProcessed, colorCount = 16 }) {
  const [isDragOver, setIsDragOver] = useState(false)
  const { processImage, isProcessing, error } = useImageProcessor()

  const handleFileSelect = useCallback(async (files) => {
    const file = files[0]
    if (!file) return

    try {
      const result = await processImage(file, {
        dotCount: 5000, // Increased for touching dots
        colorCount: colorCount,
        adaptiveSizing: false
      })
      
      // Notify parent component of successful processing
      if (onImageProcessed) {
        onImageProcessed(result)
      }
    } catch (error) {
      console.error("Image processing failed:", error)
    }
  }, [processImage, onImageProcessed])

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

  return (
    <div className="space-y-3">
      <Card 
        className={`transition-colors ${
          isDragOver 
            ? 'border-primary bg-primary/5' 
            : 'border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 hover:bg-muted/5'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <CardContent className="p-6">
          <div className="text-center space-y-3">
            <div className="mx-auto h-12 w-12 rounded-full bg-muted/20 flex items-center justify-center">
              <Upload className="h-6 w-6 text-muted-foreground" />
            </div>
            
            <div>
              <h3 className="text-sm font-medium">
                {isProcessing ? 'Processing image...' : 'Upload an image'}
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                {isProcessing ? 'Please wait while we process your image' : 'Drag and drop or click to browse'}
              </p>
              <p className="text-xs text-muted-foreground/75 mt-1">
                Max 5MB • JPG, PNG, WebP
              </p>
            </div>

            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => {
                console.log('Button clicked!')
                document.getElementById('file-input').click()
              }}
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
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}