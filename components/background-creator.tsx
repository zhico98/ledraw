"use client"

import { useState, useRef, useEffect, useCallback } from "react"

interface BackgroundCreatorProps {
  onBackgroundChange?: (background: string) => void
}

export default function BackgroundCreator({ onBackgroundChange }: BackgroundCreatorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [backgroundType, setBackgroundType] = useState("solid")
  const [primaryColor, setPrimaryColor] = useState("#ff0000")
  const [secondaryColor, setSecondaryColor] = useState("#000000")

  const generateBackground = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = 400
    canvas.height = 400

    ctx.clearRect(0, 0, 400, 400)

    switch (backgroundType) {
      case "solid":
        ctx.fillStyle = primaryColor
        ctx.fillRect(0, 0, 400, 400)
        break

      case "gradient":
        const gradient = ctx.createLinearGradient(0, 0, 400, 400)
        gradient.addColorStop(0, primaryColor)
        gradient.addColorStop(1, secondaryColor)
        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, 400, 400)
        break

      case "checkerboard":
        ctx.fillStyle = primaryColor
        ctx.fillRect(0, 0, 400, 400)
        ctx.fillStyle = secondaryColor
        for (let x = 0; x < 400; x += 20) {
          for (let y = 0; y < 400; y += 20) {
            if ((Math.floor(x / 20) + Math.floor(y / 20)) % 2 === 0) {
              ctx.fillRect(x, y, 20, 20)
            }
          }
        }
        break

      case "dots":
        ctx.fillStyle = primaryColor
        ctx.fillRect(0, 0, 400, 400)
        ctx.fillStyle = secondaryColor
        for (let x = 10; x < 400; x += 20) {
          for (let y = 10; y < 400; y += 20) {
            ctx.beginPath()
            ctx.arc(x, y, 5, 0, Math.PI * 2)
            ctx.fill()
          }
        }
        break

      case "stripes":
        ctx.fillStyle = primaryColor
        ctx.fillRect(0, 0, 400, 400)
        ctx.fillStyle = secondaryColor
        for (let y = 0; y < 400; y += 20) {
          if (Math.floor(y / 20) % 2 === 0) {
            ctx.fillRect(0, y, 400, 10)
          }
        }
        break
    }

    const dataURL = canvas.toDataURL()
    if (onBackgroundChange) {
      onBackgroundChange(dataURL)
    }
  }, [backgroundType, primaryColor, secondaryColor, onBackgroundChange])

  const colors = [
    "#000000",
    "#FFFFFF",
    "#FF0000",
    "#00FF00",
    "#0000FF",
    "#FFFF00",
    "#FF00FF",
    "#00FFFF",
    "#808080",
    "#800000",
    "#008000",
    "#000080",
    "#800080",
    "#008080",
    "#C0C0C0",
    "#FFA500",
  ]

  useEffect(() => {
    generateBackground()
  }, [generateBackground])

  const applyBackground = () => {
    generateBackground()
    // Trigger a custom event to notify other components
    window.dispatchEvent(new CustomEvent("backgroundChanged"))
  }

  const clearBackground = () => {
    if (onBackgroundChange) {
      onBackgroundChange("")
    }
  }

  return (
    <div className="win98-window h-full">
      <div className="win98-titlebar">
        <span>BACKGROUND CREATOR</span>
      </div>
      <div className="win98-panel p-6 h-[calc(100%-22px)] overflow-auto">
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <label className="text-[8px] block mb-2">TYPE:</label>
              <select
                className="w-full win98-select text-[8px]"
                value={backgroundType}
                onChange={(e) => setBackgroundType(e.target.value)}
              >
                <option value="solid">SOLID</option>
                <option value="gradient">GRADIENT</option>
                <option value="checkerboard">CHECKERBOARD</option>
                <option value="dots">DOTS</option>
                <option value="stripes">STRIPES</option>
              </select>
            </div>

            <div>
              <label className="text-[8px] block mb-2">PRIMARY COLOR:</label>
              <div className="grid grid-cols-8 gap-1 mb-3">
                {colors.map((color) => (
                  <button
                    key={color}
                    className="w-6 h-6 border border-gray-600 cursor-pointer"
                    style={{
                      backgroundColor: color,
                      border: primaryColor === color ? "2px inset var(--win98-gray)" : "1px solid #666",
                    }}
                    onClick={() => setPrimaryColor(color)}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="text-[8px] block mb-2">SECONDARY COLOR:</label>
              <div className="grid grid-cols-8 gap-1 mb-4">
                {colors.map((color) => (
                  <button
                    key={color}
                    className="w-6 h-6 border border-gray-600 cursor-pointer"
                    style={{
                      backgroundColor: color,
                      border: secondaryColor === color ? "2px inset var(--win98-gray)" : "1px solid #666",
                    }}
                    onClick={() => setSecondaryColor(color)}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <button className="win98-button w-full text-[8px] py-2" onClick={applyBackground}>
                APPLY BACKGROUND
              </button>
              <button className="win98-button w-full text-[8px] py-2" onClick={clearBackground}>
                CLEAR BACKGROUND
              </button>
            </div>
          </div>

          <div>
            <label className="text-[8px] block mb-2">PREVIEW:</label>
            <div className="win98-canvas">
              <canvas
                ref={canvasRef}
                className="w-full h-auto max-w-[200px] max-h-[200px]"
                style={{ imageRendering: "pixelated" }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
