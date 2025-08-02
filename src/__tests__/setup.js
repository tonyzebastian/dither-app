import { expect, afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import * as matchers from '@testing-library/jest-dom/matchers'

expect.extend(matchers)

// Mock ImageData for tests
global.ImageData = class ImageData {
  constructor(data, width, height) {
    this.data = data
    this.width = width
    this.height = height || data.length / (width * 4)
  }
}

// Mock Image for tests
global.Image = class Image {
  constructor() {
    this.onload = null
    this.src = ''
  }
  
  set src(value) {
    this._src = value
    // Simulate async loading
    setTimeout(() => {
      this.width = 100
      this.height = 100
      if (this.onload) this.onload()
    }, 0)
  }
  
  get src() {
    return this._src
  }
}

// Mock URL.createObjectURL
global.URL = {
  createObjectURL: () => 'mock-url'
}

// Mock canvas
global.HTMLCanvasElement.prototype.getContext = () => ({
  drawImage: () => {},
})

global.HTMLCanvasElement.prototype.toBlob = function(callback, type) {
  const blob = new Blob(['mock image data'], { type: type || 'image/png' })
  callback(blob)
}

afterEach(() => {
  cleanup()
})