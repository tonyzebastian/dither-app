import { Button } from "./ui/button"
import { Progress } from "./ui/progress"
import { Image, FileImage } from "lucide-react"

export default function ExportControls({ disabled = false }) {
  const exportProgress = 0 // Will be dynamic later

  return (
    <div className="space-y-3">
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
      
      {exportProgress > 0 && (
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-slate-500">
            <span>Exporting...</span>
            <span>{exportProgress}%</span>
          </div>
          <Progress value={exportProgress} className="w-full" />
        </div>
      )}
    </div>
  )
}