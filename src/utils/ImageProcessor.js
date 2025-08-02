export class ImageProcessor {
  static validateFile(file) {
    if (!file) {
      throw new Error('No file provided')
    }
    
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('File size too large')
    }
    
    if (!file.type.startsWith('image/')) {
      throw new Error('Invalid file type')
    }
    
    return true
  }
  
  static async resizeImage(file, maxSize = 1024) {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new Image()
      
      img.onload = () => {
        let { width, height } = img
        
        if (width > maxSize || height > maxSize) {
          if (width > height) {
            height = (height * maxSize) / width
            width = maxSize
          } else {
            width = (width * maxSize) / height
            height = maxSize
          }
        }
        
        canvas.width = width
        canvas.height = height
        ctx.drawImage(img, 0, 0, width, height)
        
        canvas.toBlob((blob) => {
          const resizedFile = new File([blob], file.name, { type: file.type })
          resolve(resizedFile)
        }, file.type)
      }
      
      img.src = URL.createObjectURL(file)
    })
  }
  
  static extractColorPalette(imageData, colors = 16) {
    if (!imageData) {
      throw new Error('No image data provided')
    }
    
    const pixels = []
    const data = imageData.data
    
    for (let i = 0; i < data.length; i += 4) {
      pixels.push({
        r: data[i],
        g: data[i + 1],
        b: data[i + 2]
      })
    }
    
    return this.kMeansColors(pixels, colors)
  }
  
  static kMeansColors(pixels, k) {
    if (pixels.length === 0) return []
    
    const centroids = []
    for (let i = 0; i < k; i++) {
      const randomPixel = pixels[Math.floor(Math.random() * pixels.length)]
      centroids.push({ ...randomPixel })
    }
    
    for (let iter = 0; iter < 10; iter++) {
      const clusters = Array(k).fill().map(() => [])
      
      pixels.forEach(pixel => {
        let closestIndex = 0
        let closestDistance = Infinity
        
        centroids.forEach((centroid, index) => {
          const distance = Math.sqrt(
            Math.pow(pixel.r - centroid.r, 2) +
            Math.pow(pixel.g - centroid.g, 2) +
            Math.pow(pixel.b - centroid.b, 2)
          )
          
          if (distance < closestDistance) {
            closestDistance = distance
            closestIndex = index
          }
        })
        
        clusters[closestIndex].push(pixel)
      })
      
      centroids.forEach((centroid, index) => {
        const cluster = clusters[index]
        if (cluster.length > 0) {
          centroid.r = Math.round(cluster.reduce((sum, p) => sum + p.r, 0) / cluster.length)
          centroid.g = Math.round(cluster.reduce((sum, p) => sum + p.g, 0) / cluster.length)
          centroid.b = Math.round(cluster.reduce((sum, p) => sum + p.b, 0) / cluster.length)
        }
      })
    }
    
    return centroids.slice(0, Math.min(k, centroids.length))
  }
}