"use client"

import { useState, useEffect } from "react"

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

export default function TokenCreator() {
  const [userArtworks, setUserArtworks] = useState<any[]>([])
  const [newTicker, setNewTicker] = useState("")
  const [contractAddress, setContractAddress] = useState("")
  const [selectedArtwork, setSelectedArtwork] = useState<any>(null)

  useEffect(() => {
    loadUserArtworks()
  }, [])

  // Listen for new artworks being saved
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

  const createToken = () => {
    if (!newTicker.trim()) {
      alert("TICKER REQUIRED!")
      return
    }

    const existingCoins = JSON.parse(localStorage.getItem("launchedCoins") || "[]")

    if (existingCoins.some((coin: any) => coin.ticker === newTicker.toUpperCase())) {
      alert("TICKER ALREADY EXISTS!")
      return
    }

    const newCoin: LaunchedCoin = {
      id: Date.now(),
      name: newTicker.toUpperCase(),
      ticker: newTicker.toUpperCase(),
      artwork: selectedArtwork?.data || "",
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

    alert(`🎉 ${newCoin.ticker} TOKEN CREATED SUCCESSFULLY!\n\nContract: ${newCoin.contractAddress}`)
  }

  return (
    <div className="win98-window h-full">
      <div className="win98-titlebar">
        <span>TOKEN CREATOR - CREATE YOUR OWN TOKEN</span>
      </div>
      <div className="win98-panel p-4 h-[calc(100%-22px)] overflow-auto">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[8px] block mb-1">TICKER *</label>
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
              <label className="text-[8px] block mb-1">CONTRACT ADDRESS (OPTIONAL)</label>
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
              <label className="text-[8px] block mb-2">SELECT TOKEN LOGO (YOUR PIXEL ART)</label>
              <div className="grid grid-cols-6 gap-2 max-h-32 overflow-auto p-2 win98-canvas">
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
                      className="w-full h-8"
                      style={{ imageRendering: "pixelated" }}
                    />
                  </div>
                ))}
              </div>
              {selectedArtwork && (
                <div className="text-[8px] mt-1 text-blue-600">✓ Selected: {selectedArtwork.name}</div>
              )}
            </div>
          )}

          {userArtworks.length === 0 && (
            <div className="win98-panel p-3 text-center">
              <div className="text-[8px] text-gray-600 mb-2">🎨 NO PIXEL ART FOUND</div>
              <div className="text-[8px] text-gray-600">Create pixel art first to use as token logo!</div>
            </div>
          )}

          <div className="border-t pt-4">
            <div className="text-[8px] mb-3 text-center">
              💡 TIP: Create unique pixel art to make your token stand out!
            </div>
            <button className="win98-button w-full text-[10px] py-2" onClick={createToken} disabled={!newTicker.trim()}>
              🚀 CREATE TOKEN
            </button>
          </div>

          <div className="text-[8px] text-gray-600 text-center">* Required fields</div>
        </div>
      </div>
    </div>
  )
}
