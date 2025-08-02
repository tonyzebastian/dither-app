import { describe, test, expect, beforeEach, vi } from 'vitest'
import { DitheredRenderer } from '../utils/DitheredRenderer.js'

describe('DitheredRenderer - Grid Generation', () => {
  test('should generate correct grid dimensions', () => {
    const width = 400
    const height = 300
    const dotCount = 100
    
    const grid = DitheredRenderer.generateDotGrid(width, height, dotCount)
    
    expect(Array.isArray(grid)).toBe(true)
    expect(grid.length).toBe(dotCount)
    
    // Each dot should have x, y coordinates within bounds
    grid.forEach(dot => {
      expect(dot).toHaveProperty('x')
      expect(dot).toHaveProperty('y')
      expect(dot.x).toBeGreaterThanOrEqual(0)
      expect(dot.x).toBeLessThanOrEqual(width)
      expect(dot.y).toBeGreaterThanOrEqual(0)
      expect(dot.y).toBeLessThanOrEqual(height)
    })
  })

  test('should distribute dots evenly across canvas', () => {
    const width = 400
    const height = 400
    const dotCount = 16 // 4x4 grid
    
    const grid = DitheredRenderer.generateDotGrid(width, height, dotCount)
    
    // For a 4x4 grid, dots should be roughly 100px apart
    const expectedSpacing = Math.sqrt((width * height) / dotCount)
    expect(expectedSpacing).toBeCloseTo(100, 0)
    
    // First dot should be roughly at spacing/2 from edges
    const firstDot = grid[0]
    expect(firstDot.x).toBeCloseTo(expectedSpacing / 2, 20)
    expect(firstDot.y).toBeCloseTo(expectedSpacing / 2, 20)
  })

  test('should handle different aspect ratios', () => {
    const width = 800
    const height = 200
    const dotCount = 32
    
    const grid = DitheredRenderer.generateDotGrid(width, height, dotCount)
    
    expect(grid.length).toBe(dotCount)
    
    // All dots should be within bounds
    grid.forEach(dot => {
      expect(dot.x).toBeLessThanOrEqual(width)
      expect(dot.y).toBeLessThanOrEqual(height)
    })
  })

  test('should handle edge cases', () => {
    // Single dot
    const singleDot = DitheredRenderer.generateDotGrid(100, 100, 1)
    expect(singleDot.length).toBe(1)
    expect(singleDot[0].x).toBeCloseTo(50, 10)
    expect(singleDot[0].y).toBeCloseTo(50, 10)
    
    // Very small canvas
    const smallGrid = DitheredRenderer.generateDotGrid(10, 10, 4)
    expect(smallGrid.length).toBe(4)
    
    // Zero dots
    const emptyGrid = DitheredRenderer.generateDotGrid(100, 100, 0)
    expect(emptyGrid.length).toBe(0)
  })
})

describe('DitheredRenderer - Color Sampling', () => {
  let mockImageData

  beforeEach(() => {
    // Create a 4x4 test image with known colors
    const data = new Uint8ClampedArray([
      // Row 1: Red, Green, Blue, White
      255, 0, 0, 255,    // Red
      0, 255, 0, 255,    // Green  
      0, 0, 255, 255,    // Blue
      255, 255, 255, 255, // White
      // Row 2: Black, Gray, Yellow, Cyan
      0, 0, 0, 255,      // Black
      128, 128, 128, 255, // Gray
      255, 255, 0, 255,   // Yellow
      0, 255, 255, 255,   // Cyan
      // Row 3: Magenta, Orange, Purple, Pink
      255, 0, 255, 255,   // Magenta
      255, 165, 0, 255,   // Orange
      128, 0, 128, 255,   // Purple
      255, 192, 203, 255, // Pink
      // Row 4: Dark red, Dark green, Dark blue, Light gray
      128, 0, 0, 255,     // Dark red
      0, 128, 0, 255,     // Dark green
      0, 0, 128, 255,     // Dark blue
      192, 192, 192, 255  // Light gray
    ])
    
    mockImageData = new ImageData(data, 4, 4)
  })

  test('should sample colors from image regions', () => {
    const grid = [
      { x: 0.5, y: 0.5 }, // Top-left (should be red)
      { x: 1.5, y: 0.5 }, // Top-center (should be green)
      { x: 2.5, y: 0.5 }, // Top-right (should be blue)
      { x: 0.5, y: 1.5 }  // Second row left (should be black)
    ]

    const sampledColors = DitheredRenderer.sampleImageColors(mockImageData, grid)
    
    expect(sampledColors).toHaveLength(4)
    
    // Check first color (red)
    expect(sampledColors[0]).toEqual({
      r: 255, g: 0, b: 0, x: 0.5, y: 0.5
    })
    
    // Check second color (green)
    expect(sampledColors[1]).toEqual({
      r: 0, g: 255, b: 0, x: 1.5, y: 0.5
    })
    
    // Check third color (blue)
    expect(sampledColors[2]).toEqual({
      r: 0, g: 0, b: 255, x: 2.5, y: 0.5
    })
    
    // Check fourth color (black)
    expect(sampledColors[3]).toEqual({
      r: 0, g: 0, b: 0, x: 0.5, y: 1.5
    })
  })

  test('should handle sampling with regional averaging', () => {
    const grid = [
      { x: 1, y: 1 } // Center of 4x4 image
    ]
    
    const sampledColors = DitheredRenderer.sampleImageColors(mockImageData, grid, { 
      sampleRadius: 1 
    })
    
    expect(sampledColors).toHaveLength(1)
    expect(sampledColors[0]).toHaveProperty('r')
    expect(sampledColors[0]).toHaveProperty('g')
    expect(sampledColors[0]).toHaveProperty('b')
    expect(sampledColors[0]).toHaveProperty('x')
    expect(sampledColors[0]).toHaveProperty('y')
  })

  test('should handle edge coordinates gracefully', () => {
    const grid = [
      { x: 0, y: 0 },     // Top-left corner
      { x: 3.9, y: 3.9 }, // Bottom-right corner
      { x: -1, y: -1 },   // Out of bounds
      { x: 10, y: 10 }    // Out of bounds
    ]

    const sampledColors = DitheredRenderer.sampleImageColors(mockImageData, grid)
    
    expect(sampledColors).toHaveLength(4)
    
    // Should clamp to valid coordinates
    sampledColors.forEach(color => {
      expect(color.r).toBeGreaterThanOrEqual(0)
      expect(color.r).toBeLessThanOrEqual(255)
      expect(color.g).toBeGreaterThanOrEqual(0)
      expect(color.g).toBeLessThanOrEqual(255)
      expect(color.b).toBeGreaterThanOrEqual(0)
      expect(color.b).toBeLessThanOrEqual(255)
    })
  })

  test('should adapt dot sizes based on content', () => {
    const grid = [
      { x: 1, y: 1 },
      { x: 2, y: 2 }
    ]
    
    const sampledColors = DitheredRenderer.sampleImageColors(mockImageData, grid, {
      adaptiveSizing: true
    })
    
    expect(sampledColors).toHaveLength(2)
    
    // Should include size information when adaptive sizing is enabled
    sampledColors.forEach(color => {
      expect(color).toHaveProperty('size')
      expect(color.size).toBeGreaterThan(0)
      expect(color.size).toBeLessThanOrEqual(1)
    })
  })
})

describe('DitheredRenderer - Dot Rendering', () => {
  let mockCanvas
  let mockContext

  beforeEach(() => {
    // Mock canvas and context
    mockContext = {
      fillStyle: '',
      beginPath: vi.fn(),
      arc: vi.fn(),
      fill: vi.fn(),
      fillRect: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      closePath: vi.fn(),
      save: vi.fn(),
      restore: vi.fn(),
      translate: vi.fn(),
      rotate: vi.fn()
    }
    
    mockCanvas = {
      getContext: vi.fn(() => mockContext),
      width: 400,
      height: 300
    }
  })

  test('should render circular dots correctly', () => {
    const dots = [
      { x: 50, y: 50, r: 255, g: 0, b: 0, size: 0.8 },
      { x: 100, y: 100, r: 0, g: 255, b: 0, size: 0.6 }
    ]

    DitheredRenderer.renderDots(mockCanvas, dots, 'circle')

    // Should call arc method for circles
    expect(mockContext.arc).toHaveBeenCalledTimes(2)
    expect(mockContext.fill).toHaveBeenCalledTimes(2)
    expect(mockContext.beginPath).toHaveBeenCalledTimes(2)
    
    // Should set correct fill colors
    expect(mockContext.fillStyle).toBe('rgb(0, 255, 0)') // Last color set
  })

  test('should render square dots correctly', () => {
    const dots = [
      { x: 25, y: 25, r: 255, g: 255, b: 0, size: 1.0 },
      { x: 75, y: 75, r: 255, g: 0, b: 255, size: 0.5 }
    ]

    DitheredRenderer.renderDots(mockCanvas, dots, 'square')

    // Should call fillRect for squares
    expect(mockContext.fillRect).toHaveBeenCalledTimes(2)
    
    // Check the first square call
    expect(mockContext.fillRect).toHaveBeenNthCalledWith(
      1, 
      expect.any(Number), // x position
      expect.any(Number), // y position  
      expect.any(Number), // width
      expect.any(Number)  // height
    )
  })

  test('should render organic dots correctly', () => {
    const dots = [
      { x: 60, y: 40, r: 100, g: 150, b: 200, size: 0.7 }
    ]

    DitheredRenderer.renderDots(mockCanvas, dots, 'organic')

    // Should use path operations for organic shapes
    expect(mockContext.beginPath).toHaveBeenCalled()
    expect(mockContext.moveTo).toHaveBeenCalled()
    expect(mockContext.lineTo).toHaveBeenCalled()
    expect(mockContext.closePath).toHaveBeenCalled()
    expect(mockContext.fill).toHaveBeenCalled()
  })

  test('should handle empty dots array', () => {
    const dots = []

    DitheredRenderer.renderDots(mockCanvas, dots, 'circle')

    // Should not call any drawing methods
    expect(mockContext.arc).not.toHaveBeenCalled()
    expect(mockContext.fillRect).not.toHaveBeenCalled()
    expect(mockContext.fill).not.toHaveBeenCalled()
  })

  test('should adapt dot sizes correctly', () => {
    const dots = [
      { x: 30, y: 30, r: 255, g: 0, b: 0, size: 0.2 }, // Small dot
      { x: 70, y: 70, r: 0, g: 0, b: 255, size: 1.0 }  // Large dot
    ]

    DitheredRenderer.renderDots(mockCanvas, dots, 'circle')

    // Should call arc with different radii based on size
    const firstCall = mockContext.arc.mock.calls[0]
    const secondCall = mockContext.arc.mock.calls[1]
    
    const firstRadius = firstCall[2] // radius parameter
    const secondRadius = secondCall[2]
    
    expect(firstRadius).toBeLessThan(secondRadius)
  })

  test('should handle invalid dot shape gracefully', () => {
    const dots = [
      { x: 50, y: 50, r: 255, g: 255, b: 255, size: 0.5 }
    ]

    // Should default to circle for unknown shapes
    expect(() => {
      DitheredRenderer.renderDots(mockCanvas, dots, 'invalid-shape')
    }).not.toThrow()
    
    // Should still render something (fallback to circle)
    expect(mockContext.arc).toHaveBeenCalled()
  })

  test('should handle missing canvas context', () => {
    const badCanvas = { getContext: () => null }
    const dots = [{ x: 50, y: 50, r: 255, g: 0, b: 0, size: 0.5 }]

    expect(() => {
      DitheredRenderer.renderDots(badCanvas, dots, 'circle')
    }).toThrow('Canvas context not available')
  })
})