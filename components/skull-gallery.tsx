"use client"

import { useState, useEffect } from "react"

interface SavedArtwork {
  id: number
  name: string
  size: string
  data: string
  pixels: string[][]
  date: string
  time: string
}

interface SkullGalleryProps {
  onLoadArtwork?: (pixels: string[][], name: string) => void
}

export default function SkullGallery({ onLoadArtwork }: SkullGalleryProps) {
  const [savedArtworks, setSavedArtworks] = useState<SavedArtwork[]>([])

  useEffect(() => {
    const loadArtworks = () => {
      const saved = JSON.parse(localStorage.getItem("pixelArtworks") || "[]")
      setSavedArtworks(saved)
    }

    loadArtworks()

    // Listen for storage changes
    window.addEventListener("storage", loadArtworks)

    // Custom event for when new artwork is saved
    const handleArtworkSaved = () => loadArtworks()
    window.addEventListener("artworkSaved", handleArtworkSaved)

    return () => {
      window.removeEventListener("storage", loadArtworks)
      window.removeEventListener("artworkSaved", handleArtworkSaved)
    }
  }, [])

  const handleLoadArtwork = (artwork: SavedArtwork) => {
    if (onLoadArtwork) {
      onLoadArtwork(artwork.pixels, artwork.name)
    }
  }

  const handleDeleteArtwork = (id: number) => {
    const updatedArtworks = savedArtworks.filter((artwork) => artwork.id !== id)
    localStorage.setItem("pixelArtworks", JSON.stringify(updatedArtworks))
    setSavedArtworks(updatedArtworks)
  }

  return (
    <div className="win98-window h-full">
      <div className="win98-titlebar">
        <div className="flex items-center gap-2">
          <img
            src="/images/paintbrush-icon.png"
            alt="LEDRAW"
            className="w-4 h-4"
            style={{ imageRendering: "pixelated" }}
          />
          <span>GALLERY</span>
        </div>
        <div className="flex gap-2">
          <button className="win98-button text-[8px]">VIEW</button>
          <button className="win98-button text-[8px]">SORT</button>
        </div>
      </div>

      <div className="win98-panel p-6 h-[calc(100%-22px)] overflow-auto">
        {savedArtworks.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-[12px] mb-3">NO SAVED ARTWORKS</div>
            <div className="text-[10px] text-gray-600">CREATE AND SAVE YOUR FIRST PIXEL ART!</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedArtworks.map((artwork) => (
              <div key={artwork.id} className="win98-window">
                <div className="win98-titlebar">
                  <span className="text-[8px] truncate">{artwork.name}</span>
                  <button
                    className="w-4 h-4 win98-button text-[8px] leading-none"
                    onClick={() => handleDeleteArtwork(artwork.id)}
                  >
                    X
                  </button>
                </div>

                <div className="aspect-square bg-white win98-canvas flex items-center justify-center mb-3 p-3">
                  <img
                    src={artwork.data || "/placeholder.svg"}
                    alt={artwork.name}
                    className="max-w-full max-h-full"
                    style={{ imageRendering: "pixelated" }}
                  />
                </div>

                <div className="win98-panel p-3">
                  <div className="text-[8px] mb-1">SIZE: {artwork.size}</div>
                  <div className="text-[8px] mb-1">DATE: {artwork.date}</div>
                  <div className="text-[8px] mb-3">TIME: {artwork.time}</div>
                  <div className="flex gap-2">
                    <button className="win98-button flex-1 text-[8px]" onClick={() => handleLoadArtwork(artwork)}>
                      LOAD
                    </button>
                    <button className="win98-button flex-1 text-[8px]">COPY</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
