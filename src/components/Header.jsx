import { Button } from "./ui/button"
import { Download, FileImage } from "lucide-react"

export default function Header() {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center px-4">
        <div className="mr-4 flex">
          <FileImage className="mr-2 h-6 w-6" />
          <h1 className="text-lg font-semibold">Dithered Photo Animation</h1>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            {/* Empty space for future search or controls */}
          </div>
          <nav className="flex items-center space-x-2">
            {/* Export buttons moved to sidebar */}
          </nav>
        </div>
      </div>
    </header>
  )
}