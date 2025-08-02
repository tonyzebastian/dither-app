import { Card, CardContent } from "./ui/card"
import { Button } from "./ui/button"
import { Progress } from "./ui/progress"
import { Badge } from "./ui/badge"
import { Download, Image, FileImage } from "lucide-react"

export default function ExportControls({ disabled = false }) {
  const exportProgress = 0 // Will be dynamic later

  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Export Options</span>
            <Badge variant={disabled ? "outline" : "secondary"} className="text-xs">
              {disabled ? "No Image" : "Ready"}
            </Badge>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" size="sm" disabled={disabled}>
              <Image className="mr-2 h-4 w-4" />
              PNG
            </Button>
            <Button variant="outline" size="sm" disabled={disabled}>
              <FileImage className="mr-2 h-4 w-4" />
              GIF
            </Button>
          </div>
        </div>
        
        {exportProgress > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Exporting...</span>
              <span>{exportProgress}%</span>
            </div>
            <Progress value={exportProgress} className="w-full" />
          </div>
        )}
        
        <div className="text-xs text-muted-foreground">
          <p>• Upload an image to enable export</p>
          <p>• PNG: Static dithered image</p>
          <p>• GIF: Animated sequence</p>
        </div>
      </CardContent>
    </Card>
  )
}