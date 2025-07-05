"use client"

interface ToolPanelProps {
  selectedTool: string
  onToolChange: (tool: string) => void
  canvasSize: number
  onCanvasSizeChange: (size: number) => void
}

export default function ToolPanel({ selectedTool, onToolChange, canvasSize, onCanvasSizeChange }: ToolPanelProps) {
  const tools = [
    { id: "brush", name: "BRUSH", icon: "B" },
    { id: "eraser", name: "ERASER", icon: "E" },
  ]

  return (
    <div className="win98-window">
      <div className="win98-panel p-3">
        <div className="grid grid-cols-2 gap-2 mb-4">
          {tools.map((tool) => (
            <button
              key={tool.id}
              className={`win98-button h-8 cursor-pointer ${selectedTool === tool.id ? "active" : ""}`}
              onClick={() => onToolChange(tool.id)}
              title={tool.name}
            >
              <span className="text-[8px]">{tool.icon}</span>
            </button>
          ))}
        </div>

        <div className="mb-4">
          <label className="text-[8px] block mb-2">SIZE:</label>
          <select
            className="w-full win98-select text-[8px] cursor-pointer"
            value={canvasSize.toString()}
            onChange={(e) => onCanvasSizeChange(Number.parseInt(e.target.value))}
          >
            <option value="16">16X16</option>
            <option value="32">32X32</option>
            <option value="64">64X64</option>
            <option value="128">128X128</option>
          </select>
        </div>

        <div className="border-t pt-3">
          <div className="text-[8px] mb-2">OPTIONS:</div>
          <div className="space-y-2">
            <label className="flex items-center text-[8px] cursor-pointer">
              <input type="checkbox" className="mr-2 scale-75 cursor-pointer" />
              GRID
            </label>
            <label className="flex items-center text-[8px] cursor-pointer">
              <input type="checkbox" className="mr-2 scale-75 cursor-pointer" />
              SNAP
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}
