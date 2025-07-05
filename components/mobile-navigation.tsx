export default function MobileNavigation() {
  return (
    <div className="h-full win98-window">
      <div className="win98-titlebar">
        <div className="flex items-center gap-2">
          <img
            src="/images/paintbrush-icon.png"
            alt="LEDRAW"
            className="w-4 h-4"
            style={{ imageRendering: "pixelated" }}
          />
          <span>LEDRAW</span>
        </div>
        <button className="w-4 h-4 win98-button text-[8px] leading-none">×</button>
      </div>

      <div className="win98-panel p-4 h-[calc(100%-26px)]">
        <div className="space-y-2 mb-4">
          <button className="win98-button w-full active">🎨 Canvas</button>
          <button className="win98-button w-full">🖼️ Background</button>
          <button className="win98-button w-full">📁 Gallery</button>
        </div>

        <div className="border-t pt-4">
          <button className="win98-button w-full">💾 Save Project</button>
        </div>
      </div>
    </div>
  )
}
