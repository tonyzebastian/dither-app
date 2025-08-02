export class DitheredRenderer {
  static generateDotGrid(width, height, dotCount) {
    if (dotCount === 0) return []
    
    // Simple approach: Calculate grid that ensures full coverage
    const aspectRatio = width / height
    
    // Start with square-ish grid and adjust for aspect ratio
    let cols = Math.ceil(Math.sqrt(dotCount * aspectRatio))
    let rows = Math.ceil(dotCount / cols)
    
    // Make sure we have enough cells to cover the canvas completely
    // Add extra row if needed to ensure bottom coverage
    if (rows * cols < dotCount) {
      rows += 1
    }
    
    const cellWidth = width / cols
    const cellHeight = height / rows
    
    console.log(`Grid setup: ${cols} cols × ${rows} rows, cell size: ${cellWidth.toFixed(1)} × ${cellHeight.toFixed(1)}`)
    
    const dots = []
    let dotIndex = 0
    
    // Generate grid row by row to ensure complete rows
    for (let row = 0; row < rows; row++) {
      let rowStartIndex = dotIndex
      
      for (let col = 0; col < cols; col++) {
        // Position dots at cell centers
        const x = (col + 0.5) * cellWidth
        const y = (row + 0.5) * cellHeight
        
        dots.push({ x, y })
        dotIndex++
        
        // If we've reached our target dotCount but haven't finished this row,
        // complete the entire row to avoid partial rows
        if (dotIndex >= dotCount && col < cols - 1) {
          console.log(`Completing partial row ${row}: adding ${cols - col - 1} more dots`)
          // Complete the rest of this row
          for (let remainingCol = col + 1; remainingCol < cols; remainingCol++) {
            const remainingX = (remainingCol + 0.5) * cellWidth
            const remainingY = (row + 0.5) * cellHeight
            dots.push({ x: remainingX, y: remainingY })
            dotIndex++
          }
          break // Exit both loops
        }
      }
      
      // If we've exceeded dotCount and completed a full row, stop
      if (dotIndex >= dotCount) break
    }
    
    // Debug: Check if we're covering the full canvas
    const lastDot = dots[dots.length - 1]
    const coverageY = lastDot ? lastDot.y : 0
    
    // Check right edge coverage too
    const rightmostDot = dots.reduce((max, dot) => dot.x > max.x ? dot : max, dots[0])
    const coverageX = rightmostDot ? rightmostDot.x : 0
    
    console.log(`Generated ${dots.length} dots (requested ${dotCount})`)
    console.log(`Coverage: Y=${(100 * coverageY / height).toFixed(1)}%, X=${(100 * coverageX / width).toFixed(1)}%`)
    console.log(`Last dot: (${rightmostDot?.x.toFixed(1)}, ${lastDot?.y.toFixed(1)}), Canvas: ${width}×${height}`)
    
    return dots
  }

  static sampleImageColors(imageData, grid, options = {}) {
    if (!imageData) {
      throw new Error('No image data provided')
    }
    
    const { sampleRadius = 0, adaptiveSizing = false } = options
    const { data, width, height } = imageData
    const sampledColors = []
    
    for (const dot of grid) {
      let { x, y } = dot
      
      // Clamp coordinates to image bounds
      x = Math.max(0, Math.min(width - 1, Math.floor(x)))
      y = Math.max(0, Math.min(height - 1, Math.floor(y)))
      
      let r, g, b, sampleCount = 0
      let totalR = 0, totalG = 0, totalB = 0
      
      if (sampleRadius > 0) {
        // Sample area around the point
        for (let dy = -sampleRadius; dy <= sampleRadius; dy++) {
          for (let dx = -sampleRadius; dx <= sampleRadius; dx++) {
            const px = Math.max(0, Math.min(width - 1, x + dx))
            const py = Math.max(0, Math.min(height - 1, y + dy))
            const index = (py * width + px) * 4
            
            totalR += data[index]
            totalG += data[index + 1] 
            totalB += data[index + 2]
            sampleCount++
          }
        }
        
        r = Math.round(totalR / sampleCount)
        g = Math.round(totalG / sampleCount)
        b = Math.round(totalB / sampleCount)
      } else {
        // Single pixel sample
        const index = (y * width + x) * 4
        r = data[index]
        g = data[index + 1]
        b = data[index + 2]
      }
      
      const colorData = { r, g, b, x: dot.x, y: dot.y }
      
      if (adaptiveSizing) {
        // Calculate size based on brightness/contrast
        const brightness = (r + g + b) / 3
        const size = Math.max(0.1, Math.min(1.0, 1 - brightness / 255))
        colorData.size = size
      }
      
      sampledColors.push(colorData)
    }
    
    return sampledColors
  }

  static renderDots(canvas, dots, shape = 'circle', backgroundColor = 'white') {
    const ctx = canvas.getContext('2d')
    
    if (!ctx) {
      throw new Error('Canvas context not available')
    }

    // Get background color
    const backgroundColors = {
      white: '#ffffff',
      black: '#1a1a1a', 
      blue: '#1e3a8a',
      green: '#166534',
      red: '#991b1b'
    }
    
    // Clear and set background
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = backgroundColors[backgroundColor] || backgroundColors.white
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    const baseSize = Math.min(canvas.width, canvas.height) / 80 // Reduced dot size by 50%
    
    for (const dot of dots) {
      const { x, y, r, g, b, size = 0.5 } = dot
      const dotSize = baseSize * size
      
      ctx.fillStyle = `rgb(${r}, ${g}, ${b})`
      
      switch (shape) {
        case 'circle':
          ctx.beginPath()
          ctx.arc(x, y, dotSize, 0, Math.PI * 2)
          ctx.fill()
          break
          
        case 'square':
          const halfSize = dotSize
          ctx.fillRect(x - halfSize, y - halfSize, halfSize * 2, halfSize * 2)
          break
          
        case 'organic':
          this.renderOrganicDot(ctx, x, y, dotSize)
          break
          
        default:
          // Fallback to circle for unknown shapes
          ctx.beginPath()
          ctx.arc(x, y, dotSize, 0, Math.PI * 2)
          ctx.fill()
          break
      }
    }
  }
  
  static renderOrganicDot(ctx, x, y, size) {
    ctx.beginPath()
    
    // Create an irregular organic shape
    const points = 8
    const angleStep = (Math.PI * 2) / points
    
    for (let i = 0; i < points; i++) {
      const angle = i * angleStep
      const radiusVariation = 0.7 + Math.random() * 0.6 // Random variation
      const radius = size * radiusVariation
      
      const px = x + Math.cos(angle) * radius
      const py = y + Math.sin(angle) * radius
      
      if (i === 0) {
        ctx.moveTo(px, py)
      } else {
        ctx.lineTo(px, py)
      }
    }
    
    ctx.closePath()
    ctx.fill()
  }
}