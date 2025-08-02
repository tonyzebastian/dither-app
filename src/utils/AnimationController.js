export class AnimationController {
  constructor() {
    this.isPlaying = false
    this.animationId = null
    this.startTime = 0
    this.canvas = null
    this.dots = []
    this.animationType = 'wave'
    this.speed = 1
  }

  start(canvas, dots, animationType = 'wave', backgroundColor = 'white') {
    this.canvas = canvas
    this.dots = dots
    this.animationType = animationType
    this.backgroundColor = backgroundColor
    this.isPlaying = true
    this.startTime = performance.now()
    
    console.log('Animation started:', { animationType, backgroundColor, dotCount: dots.length })
    this.animate()
  }

  stop() {
    this.isPlaying = false
    if (this.animationId) {
      cancelAnimationFrame(this.animationId)
      this.animationId = null
    }
    console.log('Animation stopped')
  }

  pause() {
    this.isPlaying = false
    if (this.animationId) {
      cancelAnimationFrame(this.animationId)
      this.animationId = null
    }
    console.log('Animation paused')
  }

  resume() {
    if (!this.isPlaying && this.canvas && this.dots.length > 0) {
      this.isPlaying = true
      this.animate()
      console.log('Animation resumed')
    }
  }

  animate = () => {
    if (!this.isPlaying || !this.canvas || !this.dots.length) return

    const currentTime = performance.now()
    const elapsed = (currentTime - this.startTime) / 1000 // Convert to seconds
    
    // Calculate animation transforms based on type
    const animatedDots = this.calculateAnimationFrame(this.dots, elapsed)
    
    // Render the animated frame
    this.renderAnimatedFrame(animatedDots)
    
    // Continue animation
    this.animationId = requestAnimationFrame(this.animate)
  }

  calculateAnimationFrame(dots, time) {
    switch (this.animationType) {
      case 'wave':
        return this.calculateWave(dots, time)
      case 'ripple':
        return this.calculateRipple(dots, time)
      case 'pulse':
        return this.calculatePulse(dots, time)
      default:
        return dots
    }
  }

  calculateWave(dots, time) {
    const waveSpeed = 2 * this.speed
    const waveAmplitude = 20
    const waveFrequency = 0.01

    return dots.map(dot => {
      const wave = Math.sin(dot.x * waveFrequency + time * waveSpeed) * waveAmplitude
      return {
        ...dot,
        y: dot.y + wave,
        size: dot.size * (1 + Math.sin(time * 3 + dot.x * 0.01) * 0.3)
      }
    })
  }

  calculateRipple(dots, time) {
    const centerX = this.canvas.width / 2
    const centerY = this.canvas.height / 2
    const rippleSpeed = 100 * this.speed
    const rippleAmplitude = 15

    return dots.map(dot => {
      const distance = Math.sqrt(Math.pow(dot.x - centerX, 2) + Math.pow(dot.y - centerY, 2))
      const ripple = Math.sin(distance * 0.02 - time * rippleSpeed * 0.01) * rippleAmplitude
      const sizeMultiplier = 1 + Math.sin(distance * 0.01 - time * 2) * 0.4
      
      return {
        ...dot,
        size: Math.max(dot.size * sizeMultiplier, 0.1)
      }
    })
  }

  calculatePulse(dots, time) {
    const pulseSpeed = 3 * this.speed
    const pulseAmplitude = 0.5

    return dots.map(dot => {
      const pulse = Math.sin(time * pulseSpeed) * pulseAmplitude + 1
      return {
        ...dot,
        size: dot.size * pulse
      }
    })
  }

  renderAnimatedFrame(animatedDots) {
    if (!this.canvas) return

    const ctx = this.canvas.getContext('2d')
    
    // Get background color
    const backgroundColors = {
      white: '#ffffff',
      black: '#1a1a1a', 
      blue: '#1e3a8a',
      green: '#166534',
      red: '#991b1b'
    }
    
    // Clear canvas
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    
    // Set background color
    ctx.fillStyle = backgroundColors[this.backgroundColor] || backgroundColors.white
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
    
    const baseSize = Math.min(this.canvas.width, this.canvas.height) / 80
    
    // Render each animated dot
    animatedDots.forEach(dot => {
      // Handle both color formats: {r,g,b} or {color:{r,g,b}}
      const r = dot.color ? dot.color.r : dot.r
      const g = dot.color ? dot.color.g : dot.g  
      const b = dot.color ? dot.color.b : dot.b
      const a = dot.color ? (dot.color.a || 1) : 1
      
      // Safety check for color values
      if (r === undefined || g === undefined || b === undefined) {
        console.warn('Invalid dot color:', dot)
        return
      }
      
      const { x, y, size = 0.5 } = dot
      const dotSize = baseSize * size
      
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`
      ctx.beginPath()
      ctx.arc(x, y, Math.max(dotSize, 0.5), 0, Math.PI * 2)
      ctx.fill()
    })
  }

  setSpeed(speed) {
    this.speed = Math.max(0.1, Math.min(3, speed))
  }

  setAnimationType(type) {
    this.animationType = type
    console.log('Animation type changed to:', type)
  }
}