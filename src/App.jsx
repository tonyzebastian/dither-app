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
    <div className="min-h-screen bg-white mt-16">
      <Header />
      <div className="max-w-7xl mx-auto px-4 pt-4">
        <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
          <div className="flex gap-12">
            <Sidebar 
              className="w-80 flex-shrink-0" 
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
              className="flex-1" 
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
      </div>
      
      {/* Creator details - always visible, outside main card */}
      <div className="max-w-7xl mx-auto px-4 pt-4">
        <div className="flex justify-between items-center text-sm text-slate-500">
          <span>Created by <a href='https://www.tonyzeb.design' target="_blank">tonyzeb.design</a></span>
          {processedImage && (
            <span>
              {processedImage.dots?.length || 0} dots • {processedImage.dimensions?.width}×{processedImage.dimensions?.height}px • circle • Size: {dotSize}%
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
