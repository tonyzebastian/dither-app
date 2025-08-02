import { useState, useCallback, useRef } from 'react'
import { ImageProcessor } from '../utils/ImageProcessor'
import { DitheredRenderer } from '../utils/DitheredRenderer'

export function useImageProcessor() {
  const [originalImage, setOriginalImage] = useState(null)
  const [processedImageData, setProcessedImageData] = useState(null)
  const [ditheredDots, setDitheredDots] = useState([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState(null)
  const canvasRef = useRef(null)

  const processImage = useCallback(async (file, options = {}) => {
    if (!file) return

    setIsProcessing(true)
    setError(null)

    try {
      // Validate and resize image
      ImageProcessor.validateFile(file)
      const resizedFile = await ImageProcessor.resizeImage(file, 1024)
      
      // Create image element and load the file
      const img = new Image()
      const imageUrl = URL.createObjectURL(resizedFile)
      
      return new Promise((resolve, reject) => {
        img.onload = async () => {
          try {
            // Create canvas to extract image data
            const canvas = document.createElement('canvas')
            const ctx = canvas.getContext('2d')
            
            canvas.width = img.width
            canvas.height = img.height
            ctx.drawImage(img, 0, 0)
            
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
            
            // Extract color palette
            const colorPalette = ImageProcessor.extractColorPalette(imageData, options.colorCount || 16)
            
            // Generate dot grid
            const dotCount = options.dotCount || 1000
            const dotGrid = DitheredRenderer.generateDotGrid(canvas.width, canvas.height, dotCount)
            
            // Sample colors from image
            const sampledDots = DitheredRenderer.sampleImageColors(imageData, dotGrid, {
              adaptiveSizing: options.adaptiveSizing || false,
              sampleRadius: options.sampleRadius || 0
            })
            
            // Store results
            setOriginalImage(img)
            setProcessedImageData(imageData)
            setDitheredDots(sampledDots)
            
            // Clean up
            URL.revokeObjectURL(imageUrl)
            
            setIsProcessing(false)
            resolve({
              image: img,
              imageData,
              dots: sampledDots,
              colorPalette,
              dimensions: { width: canvas.width, height: canvas.height }
            })
          } catch (err) {
            setError(`Failed to process image: ${err.message}`)
            setIsProcessing(false)
            reject(err)
          }
        }
        
        img.onerror = () => {
          setError('Failed to load image')
          setIsProcessing(false)
          reject(new Error('Failed to load image'))
        }
        
        img.src = imageUrl
      })
    } catch (err) {
      setError(err.message)
      setIsProcessing(false)
      throw err
    }
  }, [])

  const renderDitheredImage = useCallback((canvas, shape = 'circle') => {
    if (!canvas || !ditheredDots.length) return

    // Clear canvas
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    // Set canvas size to match processed image
    if (processedImageData) {
      canvas.width = processedImageData.width
      canvas.height = processedImageData.height
    }
    
    // Render dots
    DitheredRenderer.renderDots(canvas, ditheredDots, shape)
  }, [ditheredDots, processedImageData])

  const updateDotSettings = useCallback((newSettings) => {
    if (!processedImageData) return

    const { dotCount, shape, adaptiveSizing, sampleRadius } = newSettings
    
    if (dotCount && dotCount !== ditheredDots.length) {
      // Regenerate grid with new dot count
      const newGrid = DitheredRenderer.generateDotGrid(
        processedImageData.width, 
        processedImageData.height, 
        dotCount
      )
      
      const newDots = DitheredRenderer.sampleImageColors(processedImageData, newGrid, {
        adaptiveSizing: adaptiveSizing || false,
        sampleRadius: sampleRadius || 0
      })
      
      setDitheredDots(newDots)
    }
    
    // Re-render with new shape if canvas is available
    if (canvasRef.current) {
      renderDitheredImage(canvasRef.current, shape)
    }
  }, [processedImageData, ditheredDots.length, renderDitheredImage])

  const reset = useCallback(() => {
    setOriginalImage(null)
    setProcessedImageData(null)
    setDitheredDots([])
    setError(null)
    setIsProcessing(false)
  }, [])

  return {
    // State
    originalImage,
    processedImageData,
    ditheredDots,
    isProcessing,
    error,
    canvasRef,
    
    // Actions
    processImage,
    renderDitheredImage,
    updateDotSettings,
    reset,
    
    // Computed
    hasImage: !!originalImage,
    dotCount: ditheredDots.length
  }
}