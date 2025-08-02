import { describe, test, expect } from 'vitest'
import { ImageProcessor } from '../utils/ImageProcessor.js'

describe('ImageProcessor - File Validation', () => {
  test('should validate file size (max 5MB)', () => {
    const largeFile = new File(['x'.repeat(6 * 1024 * 1024)], 'large.jpg', { type: 'image/jpeg' })
    const smallFile = new File(['small content'], 'small.jpg', { type: 'image/jpeg' })
    
    expect(() => ImageProcessor.validateFile(largeFile)).toThrow('File size too large')
    expect(() => ImageProcessor.validateFile(smallFile)).not.toThrow()
  })

  test('should validate file type', () => {
    const imageFile = new File(['content'], 'image.jpg', { type: 'image/jpeg' })
    const textFile = new File(['content'], 'text.txt', { type: 'text/plain' })
    
    expect(() => ImageProcessor.validateFile(imageFile)).not.toThrow()
    expect(() => ImageProcessor.validateFile(textFile)).toThrow('Invalid file type')
  })

  test('should validate file exists', () => {
    expect(() => ImageProcessor.validateFile(null)).toThrow('No file provided')
    expect(() => ImageProcessor.validateFile(undefined)).toThrow('No file provided')
  })

  test('should handle corrupted files gracefully', () => {
    const corruptedFile = new File(['invalid image data'], 'corrupt.jpg', { type: 'image/jpeg' })
    
    expect(() => ImageProcessor.validateFile(corruptedFile)).not.toThrow()
  })
})