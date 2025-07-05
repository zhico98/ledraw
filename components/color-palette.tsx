"use client"

interface ColorPaletteProps {
  selectedColor: string
  onColorChange: (color: string) => void
}

export default function ColorPalette({ selectedColor, onColorChange }: ColorPaletteProps) {
  const colors = [
    "#000000",
    "#800000",
    "#008000",
    "#808000",
    "#000080",
    "#800080",
    "#008080",
    "#c0c0c0",
    "#808080",
    "#ff0000",
    "#00ff00",
    "#ffff00",
    "#0000ff",
    "#ff00ff",
    "#00ffff",
    "#ffffff",
  ]

  return (
    <div className="win98-window">
      <div className="win98-panel p-3">
        <div className="mb-4">
          <div className="flex">
            <div
              className="w-8 h-8 border-2 mr-3 cursor-pointer"
              style={{
                backgroundColor: selectedColor,
                border: "2px inset var(--win98-gray)",
              }}
            />
            <div
              className="w-8 h-8 border-2 cursor-pointer"
              style={{
                backgroundColor: "#ffffff",
                border: "2px inset var(--win98-gray)",
              }}
            />
          </div>
          <div className="text-[8px] mt-2">FG / BG</div>
        </div>

        <div className="grid grid-cols-8 gap-1">
          {colors.map((color, index) => (
            <button
              key={index}
              className="w-4 h-4 border cursor-pointer"
              style={{
                backgroundColor: color,
                border: selectedColor === color ? "2px inset var(--win98-gray)" : "1px solid #666",
              }}
              onClick={() => onColorChange(color)}
            />
          ))}
        </div>

        <button className="win98-button w-full mt-3 text-[8px]">OTHER...</button>
      </div>
    </div>
  )
}
