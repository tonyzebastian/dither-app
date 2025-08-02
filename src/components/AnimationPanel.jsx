import { Card, CardContent } from "./ui/card"
import { Button } from "./ui/button"
import { Switch } from "./ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Label } from "./ui/label"
import { Play, Pause, Square } from "lucide-react"

export default function AnimationPanel({ 
  onAnimationTypeChange,
  onPlayPause,
  onStop,
  onMonochromeChange,
  animationType = 'wave',
  isPlaying = false,
  isMonochrome = false
}) {
  return (
    <Card>
      <CardContent className="p-4 space-y-4">
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
              <TabsTrigger value="wave">Wave</TabsTrigger>
              <TabsTrigger value="ripple">Ripple</TabsTrigger>
              <TabsTrigger value="pulse">Pulse</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
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
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={() => {
              console.log('Stop clicked')
              if (onStop) {
                onStop()
              }
            }}
          >
            <Square className="mr-2 h-4 w-4" />
            Stop
          </Button>
        </div>
        
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
          />
        </div>
      </CardContent>
    </Card>
  )
}