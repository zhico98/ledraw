"use client"

import type React from "react"

import { useState, useRef, useEffect, useCallback } from "react"
import SaveDialog from "./save-dialog"

interface PixelCanvasProps {
  size: number
  selectedColor: string
  selectedTool: string
  background?: string
  onArtworkSaved?: (name: string) => void
  loadedPixels?: string[][]
  loadedName?: string
}

interface LaunchedCoin {
  id: number
  name: string
  ticker: string
  artwork: string
  creator: string
  launchDate: string
  price: string
  change24h: number
  contractAddress: string
}

export default function PixelCanvas({
  size,
  selectedColor,
  selectedTool,
  background,
  onArtworkSaved,
  loadedPixels,
  loadedName,
}: PixelCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [currentArtworkName, setCurrentArtworkName] = useState("")
  const [pixels, setPixels] = useState<string[][]>(() =>
    Array(size)
      .fill(null)
      .map(() => Array(size).fill("transparent")),
  )

  // Token Creator State
  const [userArtworks, setUserArtworks] = useState<any[]>([])
  const [newTicker, setNewTicker] = useState("")
  const [contractAddress, setContractAddress] = useState("")
  const [selectedArtwork, setSelectedArtwork] = useState<any>(null)

  // Reset pixels when size changes
  useEffect(() => {
    setPixels(
      Array(size)
        .fill(null)
        .map(() => Array(size).fill("transparent")),
    )
  }, [size])

  // Load external pixels
  useEffect(() => {
    if (loadedPixels && loadedPixels.length > 0) {
      setPixels(loadedPixels.map((row) => [...row]))
      setCurrentArtworkName(loadedName || "")
    }
  }, [loadedPixels, loadedName])

  // Load user artworks for token creation
  useEffect(() => {
    loadUserArtworks()
  }, [])

  useEffect(() => {
    const handleArtworkSaved = () => {
      loadUserArtworks()
    }

    window.addEventListener("artworkSaved", handleArtworkSaved)
    return () => window.removeEventListener("artworkSaved", handleArtworkSaved)
  }, [])

  const loadUserArtworks = () => {
    const artworks = JSON.parse(localStorage.getItem("pixelArtworks") || "[]")
    setUserArtworks(artworks)
  }

  // Generate current canvas as artwork data WITH background
  const getCurrentCanvasData = () => {
    const canvas = document.createElement("canvas")
    canvas.width = size * 10
    canvas.height = size * 10
    const ctx = canvas.getContext("2d")

    if (!ctx) return ""

    // Apply background first
    if (background) {
      const img = new Image()
      img.crossOrigin = "anonymous"
      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        drawPixelsOnCanvas()
      }
      img.src = background

      // For synchronous execution, we need to handle this differently
      // Let's create a promise-based version
      return new Promise<string>((resolve) => {
        img.onload = () => {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
          drawPixelsOnCanvas()
          resolve(canvas.toDataURL())
        }
      })
    } else {
      // White background
      ctx.fillStyle = "#ffffff"
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      drawPixelsOnCanvas()
      return canvas.toDataURL()
    }

    function drawPixelsOnCanvas() {
      // Draw pixels on top of background
      for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
          const color = pixels[y][x]
          if (color && color !== "transparent") {
            ctx.fillStyle = color
            ctx.fillRect(x * 10, y * 10, 10, 10)
          }
        }
      }
    }
  }

  // Generate artwork with background for saving/token creation
  const generateArtworkWithBackground = async (): Promise<string> => {
    const canvas = document.createElement("canvas")
    canvas.width = size * 10
    canvas.height = size * 10
    const ctx = canvas.getContext("2d")

    if (!ctx) return ""

    return new Promise((resolve) => {
      if (background) {
        const img = new Image()
        img.crossOrigin = "anonymous"
        img.onload = () => {
          // Draw background
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

          // Draw pixels on top
          for (let y = 0; y < size; y++) {
            for (let x = 0; y < size; x++) {
              const color = pixels[y][x]
              if (color && color !== "transparent") {
                ctx.fillStyle = color
                ctx.fillRect(x * 10, y * 10, 10, 10)
              }
            }
          }

          resolve(canvas.toDataURL())
        }
        img.src = background
      } else {
        // White background
        ctx.fillStyle = "#ffffff"
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        // Draw pixels
        for (let y = 0; y < size; y++) {
          for (let x = 0; x < size; x++) {
            const color = pixels[y][x]
            if (color && color !== "transparent") {
              ctx.fillStyle = color
              ctx.fillRect(x * 10, y * 10, 10, 10)
            }
          }
        }

        resolve(canvas.toDataURL())
      }
    })
  }

  // Draw canvas
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const pixelSize = 300 / size
    ctx.clearRect(0, 0, 300, 300)

    // Background
    if (background) {
      const img = new Image()
      img.onload = () => {
        ctx.drawImage(img, 0, 0, 300, 300)
        drawPixelsAndGrid()
      }
      img.src = background
    } else {
      ctx.fillStyle = "#ffffff"
      ctx.fillRect(0, 0, 300, 300)
      drawPixelsAndGrid()
    }

    function drawPixelsAndGrid() {
      // Draw pixels
      for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
          const color = pixels[y]?.[x]
          if (color && color !== "transparent") {
            ctx.fillStyle = color
            ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize)
          }
        }
      }

      // Draw grid
      ctx.strokeStyle = "#cccccc"
      ctx.lineWidth = 0.5
      for (let i = 0; i <= size; i++) {
        ctx.beginPath()
        ctx.moveTo(i * pixelSize, 0)
        ctx.lineTo(i * pixelSize, 300)
        ctx.stroke()

        ctx.beginPath()
        ctx.moveTo(0, i * pixelSize)
        ctx.lineTo(300, i * pixelSize)
        ctx.stroke()
      }
    }
  }, [pixels, size, background])

  useEffect(() => {
    drawCanvas()
  }, [drawCanvas])

  const getPixelPosition = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return null

    const rect = canvas.getBoundingClientRect()
    const x = Math.floor(((e.clientX - rect.left) / rect.width) * size)
    const y = Math.floor(((e.clientY - rect.top) / rect.height) * size)

    if (x >= 0 && x < size && y >= 0 && y < size) {
      return { x, y }
    }
    return null
  }

  const drawPixel = (x: number, y: number) => {
    setPixels((prev) => {
      const newPixels = prev.map((row) => [...row])
      if (selectedTool === "brush") {
        newPixels[y][x] = selectedColor
      } else if (selectedTool === "eraser") {
        newPixels[y][x] = "transparent"
      }
      return newPixels
    })
  }

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    e.preventDefault()
    const pos = getPixelPosition(e)
    if (pos) {
      setIsDrawing(true)
      drawPixel(pos.x, pos.y)
    }
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    e.preventDefault()
    if (isDrawing) {
      const pos = getPixelPosition(e)
      if (pos) {
        drawPixel(pos.x, pos.y)
      }
    }
  }

  const handleMouseUp = () => {
    setIsDrawing(false)
  }

  const clearCanvas = () => {
    setPixels(
      Array(size)
        .fill(null)
        .map(() => Array(size).fill("transparent")),
    )
    setCurrentArtworkName("")
  }

  const handleSave = async (name: string) => {
    const dataURL = await generateArtworkWithBackground()
    const savedArtworks = JSON.parse(localStorage.getItem("pixelArtworks") || "[]")

    const newArtwork = {
      id: Date.now(),
      name: name,
      size: `${size}X${size}`,
      data: dataURL,
      pixels: pixels,
      background: background || "",
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
    }

    savedArtworks.push(newArtwork)
    localStorage.setItem("pixelArtworks", JSON.stringify(savedArtworks))

    setCurrentArtworkName(name)

    const link = document.createElement("a")
    link.download = `${name.replace(/\s+/g, "_")}.png`
    link.href = dataURL
    link.click()

    if (onArtworkSaved) {
      onArtworkSaved(name)
    }

    // Trigger custom event for artwork saved
    window.dispatchEvent(new CustomEvent("artworkSaved"))
  }

  const createToken = async () => {
    if (!newTicker.trim()) {
      return // Silent fail, no alert
    }

    const existingCoins = JSON.parse(localStorage.getItem("launchedCoins") || "[]")

    if (existingCoins.some((coin: any) => coin.ticker === newTicker.toUpperCase())) {
      return // Silent fail, no alert
    }

    // Use selected artwork or current canvas WITH background
    let artworkData = ""
    if (selectedArtwork) {
      artworkData = selectedArtwork.data
    } else {
      // Use current canvas as artwork WITH background
      artworkData = await generateArtworkWithBackground()
    }

    const newCoin: LaunchedCoin = {
      id: Date.now(),
      name: newTicker.toUpperCase(),
      ticker: newTicker.toUpperCase(),
      artwork: artworkData,
      creator: "YOU",
      launchDate: new Date().toLocaleDateString(),
      price: "0.000100",
      change24h: 0,
      contractAddress:
        contractAddress || `0x${Math.random().toString(16).substr(2, 8)}...${Math.random().toString(16).substr(2, 4)}`,
    }

    const updatedCoins = [newCoin, ...existingCoins]
    localStorage.setItem("launchedCoins", JSON.stringify(updatedCoins))

    // Reset form
    setNewTicker("")
    setContractAddress("")
    setSelectedArtwork(null)

    // Trigger event to update Your Tokens component
    window.dispatchEvent(new CustomEvent("tokenCreated"))
  }

  return (
    <>
      <div className="win98-window">
        <div className="win98-titlebar">
          <div className="flex items-center gap-2">
            <img
              src="/images/paintbrush-icon.png"
              alt="LEDRAW"
              className="w-4 h-4"
              style={{ imageRendering: "pixelated" }}
            />
            <span>
              LEDRAW Canvas - {currentArtworkName || "UNTITLED"} - {size}X{size}
            </span>
          </div>
          <div className="flex gap-2">
            <button className="win98-button text-[8px] px-2 py-1" onClick={clearCanvas}>
              CLEAR
            </button>
            <button className="win98-button text-[8px] px-2 py-1" onClick={() => setShowSaveDialog(true)}>
              SAVE
            </button>
          </div>
        </div>

        <div className="win98-panel p-4 flex gap-4">
          {/* Canvas */}
          <div className="win98-canvas">
            <canvas
              ref={canvasRef}
              width={300}
              height={300}
              className="cursor-crosshair block"
              style={{ imageRendering: "pixelated" }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            />
          </div>

          {/* Token Creator - Integrated */}
          <div className="flex-1 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[8px] block mb-1">TICKER</label>
                <input
                  type="text"
                  className="win98-input w-full text-[10px]"
                  placeholder="MAT"
                  value={newTicker}
                  onChange={(e) => setNewTicker(e.target.value.toUpperCase().substring(0, 6))}
                  maxLength={6}
                />
              </div>
              <div>
                <label className="text-[8px] block mb-1">CONTRACT ADDRESS</label>
                <input
                  type="text"
                  className="win98-input w-full text-[10px]"
                  placeholder="AUTO GENERATED"
                  value={contractAddress}
                  onChange={(e) => setContractAddress(e.target.value)}
                />
              </div>
            </div>

            {/* Artwork Selection */}
            {userArtworks.length > 0 && (
              <div>
                <label className="text-[8px] block mb-2">SELECT TOKEN LOGO</label>
                <div className="grid grid-cols-4 gap-2 max-h-24 overflow-auto p-2 win98-canvas">
                  {userArtworks.map((artwork) => (
                    <div
                      key={artwork.id}
                      className={`cursor-pointer p-1 border ${
                        selectedArtwork?.id === artwork.id
                          ? "border-2 border-blue-500 bg-blue-100"
                          : "border border-gray-400 hover:bg-gray-100"
                      }`}
                      onClick={() => setSelectedArtwork(artwork)}
                      title={artwork.name}
                    >
                      <img
                        src={artwork.data || "/placeholder.svg"}
                        alt={artwork.name}
                        className="w-full h-6"
                        style={{ imageRendering: "pixelated" }}
                      />
                    </div>
                  ))}
                </div>
                {selectedArtwork && (
                  <div className="text-[8px] mt-1 text-blue-600">Selected: {selectedArtwork.name}</div>
                )}
              </div>
            )}

            <div className="text-[8px] text-gray-600 mb-2">
              💡 TIP: Select saved artwork or current canvas will be used as token logo
            </div>

            <button className="win98-button w-full text-[10px] py-2" onClick={createToken} disabled={!newTicker.trim()}>
              CREATE TOKEN
            </button>
          </div>
        </div>
      </div>

      <SaveDialog
        isOpen={showSaveDialog}
        onClose={() => setShowSaveDialog(false)}
        onSave={handleSave}
        defaultName={currentArtworkName || `PIXU_${size}X${size}`}
      />
    </>
  )
}
