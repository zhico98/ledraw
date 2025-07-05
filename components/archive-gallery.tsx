"use client"

import { useState, useEffect } from "react"

interface PublicArtwork {
  id: number
  name: string
  artist: string
  size: string
  data: string
  pixels: string[][]
  date: string
  time: string
  likes: number
  downloads: number
  views: number
  tags: string[]
}

interface ArchiveGalleryProps {
  onLoadArtwork?: (pixels: string[][], name: string) => void
}

export default function ArchiveGallery({ onLoadArtwork }: ArchiveGalleryProps) {
  const [publicArtworks, setPublicArtworks] = useState<PublicArtwork[]>([])
  const [showUploadDialog, setShowUploadDialog] = useState(false)
  const [selectedArtwork, setSelectedArtwork] = useState<PublicArtwork | null>(null)
  const [sortBy, setSortBy] = useState("newest")
  const [filterBy, setFilterBy] = useState("all")

  useEffect(() => {
    loadPublicArtworks()

    // Listen for new uploads from other users
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "publicArtworks") {
        loadPublicArtworks()
      }
    }

    window.addEventListener("storage", handleStorageChange)

    // Refresh every 30 seconds to get new uploads
    const interval = setInterval(loadPublicArtworks, 30000)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      clearInterval(interval)
    }
  }, [])

  const loadPublicArtworks = () => {
    const saved = JSON.parse(localStorage.getItem("publicArtworks") || "[]")

    // Sort artworks
    let sortedArtworks = [...saved]
    switch (sortBy) {
      case "newest":
        sortedArtworks.sort(
          (a, b) => new Date(b.date + " " + b.time).getTime() - new Date(a.date + " " + a.time).getTime(),
        )
        break
      case "popular":
        sortedArtworks.sort((a, b) => b.likes - a.likes)
        break
      case "downloaded":
        sortedArtworks.sort((a, b) => b.downloads - a.downloads)
        break
      case "viewed":
        sortedArtworks.sort((a, b) => b.views - a.views)
        break
    }

    // Filter artworks
    if (filterBy !== "all") {
      sortedArtworks = sortedArtworks.filter(
        (artwork) =>
          artwork.size === filterBy ||
          artwork.tags?.includes(filterBy) ||
          artwork.name.toLowerCase().includes(filterBy.toLowerCase()),
      )
    }

    setPublicArtworks(sortedArtworks)
  }

  useEffect(() => {
    loadPublicArtworks()
  }, [sortBy, filterBy])

  const handleLoadArtwork = (artwork: PublicArtwork) => {
    // Increment view count
    const updatedArtworks = publicArtworks.map((art) =>
      art.id === artwork.id ? { ...art, views: art.views + 1 } : art,
    )
    setPublicArtworks(updatedArtworks)
    localStorage.setItem("publicArtworks", JSON.stringify(updatedArtworks))

    if (onLoadArtwork) {
      onLoadArtwork(artwork.pixels, artwork.name)
    }
  }

  const handleLike = (id: number) => {
    const updatedArtworks = publicArtworks.map((artwork) =>
      artwork.id === id ? { ...artwork, likes: artwork.likes + 1 } : artwork,
    )
    setPublicArtworks(updatedArtworks)
    localStorage.setItem("publicArtworks", JSON.stringify(updatedArtworks))
  }

  const handleDownload = (artwork: PublicArtwork) => {
    // Create download
    const link = document.createElement("a")
    link.download = `${artwork.name.replace(/\s+/g, "_")}_by_${artwork.artist}.png`
    link.href = artwork.data
    link.click()

    // Update download count
    const updatedArtworks = publicArtworks.map((art) =>
      art.id === artwork.id ? { ...art, downloads: art.downloads + 1 } : art,
    )
    setPublicArtworks(updatedArtworks)
    localStorage.setItem("publicArtworks", JSON.stringify(updatedArtworks))
  }

  const handleUpload = () => {
    const userArtworks = JSON.parse(localStorage.getItem("pixelArtworks") || "[]")
    if (userArtworks.length === 0) {
      alert("NO ARTWORKS TO UPLOAD! CREATE SOME PIXEL ART FIRST!")
      return
    }
    setShowUploadDialog(true)
  }

  const uploadArtwork = (userArtwork: any) => {
    const artistName = prompt("ENTER YOUR ARTIST NAME:") || "ANONYMOUS"
    const tags = prompt("ENTER TAGS (SEPARATED BY COMMAS):") || ""

    const newPublicArtwork: PublicArtwork = {
      id: Date.now() + Math.random(), // Ensure unique ID
      name: userArtwork.name,
      artist: artistName.toUpperCase(),
      size: userArtwork.size,
      data: userArtwork.data,
      pixels: userArtwork.pixels,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
      likes: 0,
      downloads: 0,
      views: 0,
      tags: tags
        .split(",")
        .map((tag) => tag.trim().toUpperCase())
        .filter((tag) => tag.length > 0),
    }

    const existingArtworks = JSON.parse(localStorage.getItem("publicArtworks") || "[]")
    const updatedPublicArtworks = [newPublicArtwork, ...existingArtworks]

    localStorage.setItem("publicArtworks", JSON.stringify(updatedPublicArtworks))
    setPublicArtworks(updatedPublicArtworks)
    setShowUploadDialog(false)

    // Trigger storage event for other tabs/users
    window.dispatchEvent(
      new StorageEvent("storage", {
        key: "publicArtworks",
        newValue: JSON.stringify(updatedPublicArtworks),
      }),
    )

    alert("🎉 ARTWORK UPLOADED TO ARCHIVE! NOW EVERYONE CAN SEE IT!")
  }

  const deleteArtwork = (id: number) => {
    if (confirm("DELETE THIS ARTWORK FROM ARCHIVE?")) {
      const updatedArtworks = publicArtworks.filter((artwork) => artwork.id !== id)
      setPublicArtworks(updatedArtworks)
      localStorage.setItem("publicArtworks", JSON.stringify(updatedArtworks))
    }
  }

  const reportArtwork = (id: number) => {
    alert("ARTWORK REPORTED! MODERATORS WILL REVIEW IT.")
  }

  return (
    <>
      <div className="win98-window h-full">
        <div className="win98-titlebar">
          <span>🏛️ PUBLIC ARCHIVE - COMMUNITY GALLERY ({publicArtworks.length} ARTWORKS)</span>
          <div className="flex gap-2">
            <button className="win98-button text-[8px]" onClick={handleUpload}>
              📤 UPLOAD
            </button>
            <button className="win98-button text-[8px]" onClick={loadPublicArtworks}>
              🔄 REFRESH
            </button>
          </div>
        </div>

        {/* Controls */}
        <div className="win98-panel border-b p-3">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <label className="text-[8px]">SORT:</label>
              <select className="win98-select text-[8px]" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="newest">NEWEST</option>
                <option value="popular">MOST LIKED</option>
                <option value="downloaded">MOST DOWNLOADED</option>
                <option value="viewed">MOST VIEWED</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-[8px]">FILTER:</label>
              <select
                className="win98-select text-[8px]"
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value)}
              >
                <option value="all">ALL SIZES</option>
                <option value="16X16">16X16</option>
                <option value="32X32">32X32</option>
                <option value="64X64">64X64</option>
                <option value="128X128">128X128</option>
                <option value="skull">SKULLS</option>
              </select>
            </div>

            <div className="text-[8px] ml-auto">🔥 LIVE COMMUNITY FEED</div>
          </div>
        </div>

        <div className="win98-panel p-6 h-[calc(100%-80px)] overflow-auto">
          {publicArtworks.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-[12px] mb-3">📭 NO ARTWORKS IN ARCHIVE YET</div>
              <div className="text-[10px] text-gray-600 mb-4">BE THE FIRST TO UPLOAD YOUR PIXEL ART!</div>
              <button className="win98-button" onClick={handleUpload}>
                📤 UPLOAD YOUR FIRST ARTWORK
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {publicArtworks.map((artwork) => (
                <div key={artwork.id} className="win98-window">
                  <div className="win98-titlebar">
                    <span className="text-[8px] truncate">{artwork.name}</span>
                    <div className="flex gap-1">
                      <button
                        className="w-4 h-4 win98-button text-[6px] leading-none"
                        onClick={() => setSelectedArtwork(artwork)}
                        title="INFO"
                      >
                        i
                      </button>
                      <button
                        className="w-4 h-4 win98-button text-[6px] leading-none"
                        onClick={() => reportArtwork(artwork.id)}
                        title="REPORT"
                      >
                        !
                      </button>
                    </div>
                  </div>

                  <div className="aspect-square bg-white win98-canvas flex items-center justify-center mb-3 p-3">
                    <img
                      src={artwork.data || "/placeholder.svg"}
                      alt={artwork.name}
                      className="max-w-full max-h-full cursor-pointer"
                      style={{ imageRendering: "pixelated" }}
                      onClick={() => handleLoadArtwork(artwork)}
                    />
                  </div>

                  <div className="win98-panel p-3">
                    <div className="text-[8px] mb-1">👤 BY: {artwork.artist}</div>
                    <div className="text-[8px] mb-1">📏 SIZE: {artwork.size}</div>
                    <div className="text-[8px] mb-1">
                      📅 {artwork.date} {artwork.time}
                    </div>

                    {artwork.tags && artwork.tags.length > 0 && (
                      <div className="text-[8px] mb-2">🏷️ {artwork.tags.slice(0, 2).join(", ")}</div>
                    )}

                    <div className="text-[8px] mb-3 flex justify-between">
                      <span>❤️ {artwork.likes}</span>
                      <span>⬇️ {artwork.downloads}</span>
                      <span>👁️ {artwork.views}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mb-2">
                      <button
                        className="win98-button text-[8px]"
                        onClick={() => handleLoadArtwork(artwork)}
                        title="Load into canvas"
                      >
                        📂 LOAD
                      </button>
                      <button
                        className="win98-button text-[8px]"
                        onClick={() => handleDownload(artwork)}
                        title="Download PNG file"
                      >
                        ⬇️ GET
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        className="win98-button text-[8px]"
                        onClick={() => handleLike(artwork.id)}
                        title="Like this artwork"
                      >
                        ❤️ LIKE
                      </button>
                      <button
                        className="win98-button text-[8px]"
                        onClick={() => setSelectedArtwork(artwork)}
                        title="View details"
                      >
                        ℹ️ INFO
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Upload Dialog */}
      {showUploadDialog && (
        <>
          <div className="win98-overlay" onClick={() => setShowUploadDialog(false)} />
          <div className="win98-dialog win98-window">
            <div className="win98-titlebar">
              <span>📤 UPLOAD TO PUBLIC ARCHIVE</span>
              <button
                className="w-5 h-5 win98-button text-[8px] leading-none"
                onClick={() => setShowUploadDialog(false)}
              >
                X
              </button>
            </div>

            <div className="win98-panel p-6">
              <div className="text-[10px] mb-4">🎨 SELECT YOUR ARTWORK TO SHARE:</div>
              <div className="max-h-60 overflow-auto mb-4">
                {JSON.parse(localStorage.getItem("pixelArtworks") || "[]").map((artwork: any) => (
                  <div key={artwork.id} className="flex items-center justify-between p-3 border-b win98-panel mb-2">
                    <div className="flex items-center gap-3">
                      <img
                        src={artwork.data || "/placeholder.svg"}
                        alt={artwork.name}
                        className="w-8 h-8"
                        style={{ imageRendering: "pixelated" }}
                      />
                      <div>
                        <div className="text-[8px] font-bold">{artwork.name}</div>
                        <div className="text-[8px]">
                          {artwork.size} - {artwork.date}
                        </div>
                      </div>
                    </div>
                    <button className="win98-button text-[8px]" onClick={() => uploadArtwork(artwork)}>
                      📤 UPLOAD
                    </button>
                  </div>
                ))}
              </div>

              <div className="text-[8px] mb-4 p-2 border win98-panel">
                💡 TIP: Your artwork will be visible to everyone in the community! Add tags like "SKULL", "COLORFUL",
                "MINI" to help others find it.
              </div>

              <div className="flex justify-end">
                <button className="win98-button" onClick={() => setShowUploadDialog(false)}>
                  CANCEL
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Info Dialog */}
      {selectedArtwork && (
        <>
          <div className="win98-overlay" onClick={() => setSelectedArtwork(null)} />
          <div className="win98-dialog win98-window">
            <div className="win98-titlebar">
              <span>ℹ️ ARTWORK DETAILS</span>
              <button className="w-5 h-5 win98-button text-[8px] leading-none" onClick={() => setSelectedArtwork(null)}>
                X
              </button>
            </div>

            <div className="win98-panel p-6">
              <div className="flex gap-4 mb-4">
                <img
                  src={selectedArtwork.data || "/placeholder.svg"}
                  alt={selectedArtwork.name}
                  className="w-24 h-24 win98-canvas"
                  style={{ imageRendering: "pixelated" }}
                />
                <div className="flex-1">
                  <div className="text-[10px] space-y-1">
                    <div>
                      <strong>NAME:</strong> {selectedArtwork.name}
                    </div>
                    <div>
                      <strong>ARTIST:</strong> {selectedArtwork.artist}
                    </div>
                    <div>
                      <strong>SIZE:</strong> {selectedArtwork.size}
                    </div>
                    <div>
                      <strong>UPLOADED:</strong> {selectedArtwork.date} {selectedArtwork.time}
                    </div>
                    <div>
                      <strong>STATS:</strong> ❤️{selectedArtwork.likes} ⬇️{selectedArtwork.downloads} 👁️
                      {selectedArtwork.views}
                    </div>
                    {selectedArtwork.tags && selectedArtwork.tags.length > 0 && (
                      <div>
                        <strong>TAGS:</strong> {selectedArtwork.tags.join(", ")}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <div className="flex gap-2">
                  <button
                    className="win98-button text-[8px]"
                    onClick={() => {
                      handleLoadArtwork(selectedArtwork)
                      setSelectedArtwork(null)
                    }}
                  >
                    📂 LOAD
                  </button>
                  <button className="win98-button text-[8px]" onClick={() => handleDownload(selectedArtwork)}>
                    ⬇️ DOWNLOAD
                  </button>
                  <button className="win98-button text-[8px]" onClick={() => handleLike(selectedArtwork.id)}>
                    ❤️ LIKE
                  </button>
                </div>
                <button className="win98-button" onClick={() => setSelectedArtwork(null)}>
                  CLOSE
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}
