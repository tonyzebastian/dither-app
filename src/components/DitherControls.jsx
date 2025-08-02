import { Card, CardContent } from "./ui/card"
import { Slider } from "./ui/slider"
import { Label } from "./ui/label"

export default function DitherControls({ 
  onDotSizeChange, 
  dotSize = 70,
  disabled = false 
}) {
  const handleDotSizeChange = (value) => {
    console.log('Dot size changed to:', value[0])
    if (onDotSizeChange) {
      onDotSizeChange(value[0])
    }
  }

  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium">Dot Size</Label>
          <Slider 
            value={[dotSize]}
            onValueChange={handleDotSizeChange}
            max={100} 
            min={10} 
            step={1}
            className="w-full"
            disabled={disabled}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>10</span>
            <span>{dotSize}</span>
            <span>100</span>
          </div>
        </div>
        
      </CardContent>
    </Card>
  )
}