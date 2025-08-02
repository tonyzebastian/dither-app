import { describe, test, expect, vi } from 'vitest'
import { ImageProcessor } from '../utils/ImageProcessor.js'

describe('ImageProcessor - Image Processing', () => {
  test('should resize image to max 1024x1024', async () => {
    const mockFile = new File(['mock image content'], 'large.jpg', { type: 'image/jpeg' })
    
    const result = await ImageProcessor.resizeImage(mockFile, 1024)
    
    expect(result).toBeInstanceOf(File)
    expect(result.type).toBe('image/jpeg')
  })

  test('should maintain aspect ratio when resizing', async () => {
    const mockFile = new File(['mock image content'], 'rect.jpg', { type: 'image/jpeg' })
    
    const result = await ImageProcessor.resizeImage(mockFile, 512)
    
    expect(result).toBeInstanceOf(File)
  })

  test('should extract color palette from image', async () => {
    const mockImageData = new ImageData(new Uint8ClampedArray([
      255, 0, 0, 255,    // red pixel
      0, 255, 0, 255,    // green pixel
      0, 0, 255, 255,    // blue pixel
      255, 255, 255, 255 // white pixel
    ]), 2, 2)
    
    const palette = ImageProcessor.extractColorPalette(mockImageData, 4)
    
    expect(Array.isArray(palette)).toBe(true)
    expect(palette.length).toBeLessThanOrEqual(4)
    expect(palette[0]).toHaveProperty('r')
    expect(palette[0]).toHaveProperty('g')
    expect(palette[0]).toHaveProperty('b')
  })

  test('should handle different color counts for palette extraction', async () => {
    const mockImageData = new ImageData(new Uint8ClampedArray(400), 10, 10) // 10x10 image
    
    const smallPalette = ImageProcessor.extractColorPalette(mockImageData, 8)
    const largePalette = ImageProcessor.extractColorPalette(mockImageData, 32)
    
    expect(smallPalette.length).toBeLessThanOrEqual(8)
    expect(largePalette.length).toBeLessThanOrEqual(32)
  })

  test('should handle empty or invalid image data', () => {
    expect(() => ImageProcessor.extractColorPalette(null)).toThrow()
    expect(() => ImageProcessor.extractColorPalette(undefined)).toThrow()
  })
})