import { useState } from 'react'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import MainCanvas from './components/MainCanvas'

function App() {
  const [processedImage, setProcessedImage] = useState(null)
  const [dotShape] = useState('circle') // Always circle
  const [dotSize, setDotSize] = useState(40) // Default 40%
  const [colorCount] = useState(32) // Always maximum
  const [animationType, setAnimationType] = useState('ripple') // Default ripple
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMonochrome, setIsMonochrome] = useState(false)
  const [backgroundColor, setBackgroundColor] = useState('white')

  const handleImageProcessed = (result) => {
    setProcessedImage(result)
  }

  const handleDotSizeChange = (newSize) => {
    console.log('App: Dot size changed to', newSize)
    setDotSize(newSize)
  }

  const handleAnimationTypeChange = (newType) => {
    console.log('App: Animation type changed to', newType)
    setAnimationType(newType)
  }

  const handlePlayPause = (playing) => {
    console.log('App: Play/Pause changed to', playing)
    setIsPlaying(playing)
  }


  const handleMonochromeChange = (mono) => {
    console.log('App: Monochrome changed to', mono)
    setIsMonochrome(mono)
  }

  const handleBackgroundColorChange = (color) => {
    console.log('App: Background color changed to', color)
    setBackgroundColor(color)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          <Sidebar 
            className="w-96 flex-shrink-0" 
            onDotSizeChange={handleDotSizeChange}
            onAnimationTypeChange={handleAnimationTypeChange}
            onPlayPause={handlePlayPause}
            onMonochromeChange={handleMonochromeChange}
            onBackgroundColorChange={handleBackgroundColorChange}
            processedImage={processedImage}
            dotShape={dotShape}
            dotSize={dotSize}
            colorCount={colorCount}
            animationType={animationType}
            isPlaying={isPlaying}
            isMonochrome={isMonochrome}
            backgroundColor={backgroundColor}
          />
          <MainCanvas 
            className="flex-1 min-h-[600px]" 
            processedImage={processedImage}
            onImageProcessed={handleImageProcessed}
            colorCount={colorCount}
            dotShape={dotShape}
            dotSize={dotSize}
            isMonochrome={isMonochrome}
            animationType={animationType}
            isPlaying={isPlaying}
            backgroundColor={backgroundColor}
          />
        </div>
      </div>
      <footer className="bg-white border-t py-4 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm text-gray-500">Created by tonyzeb.design</p>
        </div>
      </footer>
    </div>
  )
}

export default App
