import { Card } from "./ui/card"
import { Separator } from "./ui/separator"
import { ScrollArea } from "./ui/scroll-area"
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
    <aside className={cn("flex flex-col gap-4", className)}>
      <ScrollArea className="flex-1">
        <div className="space-y-4">
          {/* Configurations Section */}
          <div>
            <h2 className="mb-3 text-sm font-medium">Configurations</h2>
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
          
          <Separator />
          
          {/* Export Controls Section */}
          <div>
            <h2 className="mb-3 text-sm font-medium">Export</h2>
            <ExportControls disabled={!processedImage} />
          </div>
        </div>
      </ScrollArea>
    </aside>
  )
}