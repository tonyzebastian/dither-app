import { Card } from "./ui/card"
import Configurations from "./Configurations"
import ExportControls from "./ExportControls"
import { cn } from "../lib/utils"

export default function Sidebar({ 
  className, 
  onDotSizeChange,
  onAnimationTypeChange,
  onPlayPause,
  onMonochromeChange,
  onBackgroundColorChange,
  processedImage,
  dotShape,
  dotSize,
  colorCount,
  animationType,
  isPlaying,
  isMonochrome,
  backgroundColor
}) {
  return (
    <aside className={cn("", className)}>
      <div className="space-y-6">
        {/* Configurations Section */}
        <div>
          <Configurations 
            onDotSizeChange={onDotSizeChange}
            onAnimationTypeChange={onAnimationTypeChange}
            onPlayPause={onPlayPause}
            onMonochromeChange={onMonochromeChange}
            onBackgroundColorChange={onBackgroundColorChange}
            dotSize={dotSize}
            animationType={animationType}
            isPlaying={isPlaying}
            isMonochrome={isMonochrome}
            backgroundColor={backgroundColor}
            disabled={!processedImage}
          />
        </div>
        
        <div className="pt-6">
          <h2 className="mb-4 text-sm font-medium text-gray-900">Export Options</h2>
          <ExportControls disabled={!processedImage} />
        </div>
      </div>
    </aside>
  )
}