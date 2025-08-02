import { Card, CardContent } from "./ui/card"
import { Button } from "./ui/button"
import { Switch } from "./ui/switch"
import { Slider } from "./ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Label } from "./ui/label"
import { Play, Pause } from "lucide-react"

export default function Configurations({ 
  onDotSizeChange,
  onAnimationTypeChange,
  onPlayPause,
  onMonochromeChange,
  onBackgroundColorChange,
  dotSize = 40, // Default to 40%
  animationType = 'ripple', // Default to ripple
  isPlaying = false,
  isMonochrome = false,
  backgroundColor = 'white',
  disabled = false
}) {
  const handleDotSizeChange = (value) => {
    console.log('Dot size changed to:', value[0])
    if (onDotSizeChange) {
      onDotSizeChange(value[0])
    }
  }

  const backgroundOptions = [
    { value: 'white', label: 'White', color: '#ffffff' },
    { value: 'black', label: 'Black', color: '#1a1a1a' },
    { value: 'blue', label: 'Blue', color: '#1e3a8a' },
    { value: 'green', label: 'Green', color: '#166534' },
    { value: 'red', label: 'Red', color: '#991b1b' }
  ]

  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        {/* Monochrome Mode - First Setting */}
        <div className="flex items-center justify-between">
          <Label htmlFor="monochrome" className="text-sm font-medium">
            Monochrome Mode
          </Label>
          <Switch 
            id="monochrome" 
            checked={isMonochrome}
            onCheckedChange={(checked) => {
              console.log('Monochrome mode changed to:', checked)
              if (onMonochromeChange) {
                onMonochromeChange(checked)
              }
            }}
            disabled={disabled}
          />
        </div>

        {/* Background Color */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Background Color</Label>
          <div className="flex gap-2">
            {backgroundOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  console.log('Background color changed to:', option.value)
                  if (onBackgroundColorChange) {
                    onBackgroundColorChange(option.value)
                  }
                }}
                disabled={disabled}
                className={`w-8 h-8 rounded-full border-2 transition-all ${
                  backgroundColor === option.value 
                    ? 'border-primary ring-2 ring-primary/20' 
                    : 'border-muted-foreground/30 hover:border-muted-foreground/60'
                } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                style={{ backgroundColor: option.color }}
                title={option.label}
              />
            ))}
          </div>
        </div>

        {/* Dot Size */}
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
            <span>{dotSize}%</span>
            <span>100</span>
          </div>
        </div>

        {/* Animation Type */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Animation Type</Label>
          <Tabs 
            value={animationType}
            onValueChange={(value) => {
              console.log('Animation type changed to:', value)
              if (onAnimationTypeChange) {
                onAnimationTypeChange(value)
              }
            }}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="ripple">Ripple</TabsTrigger>
              <TabsTrigger value="wave">Wave</TabsTrigger>
              <TabsTrigger value="pulse">Pulse</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        {/* Play/Pause Button */}
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={() => {
              console.log('Play/Pause clicked')
              if (onPlayPause) {
                onPlayPause(!isPlaying)
              }
            }}
            disabled={disabled}
          >
            {isPlaying ? (
              <>
                <Pause className="mr-2 h-4 w-4" />
                Pause
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                Play
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}