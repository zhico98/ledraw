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

export default function YourTokens() {
  const [launchedCoins, setLaunchedCoins] = useState<LaunchedCoin[]>([])

  useEffect(() => {
    loadLaunchedCoins()

    // Listen for storage changes
    const handleStorageChange = () => {
      loadLaunchedCoins()
    }

    // Listen for token creation events
    const handleTokenCreated = () => {
      loadLaunchedCoins()
    }

    window.addEventListener("storage", handleStorageChange)
    window.addEventListener("tokenCreated", handleTokenCreated)

    // Refresh every 2 seconds to catch new tokens
    const interval = setInterval(loadLaunchedCoins, 2000)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("tokenCreated", handleTokenCreated)
      clearInterval(interval)
    }
  }, [])

  const loadLaunchedCoins = () => {
    const coins = JSON.parse(localStorage.getItem("launchedCoins") || "[]")
    setLaunchedCoins(coins.slice(0, 3))
  }

  return (
    <div className="win98-window h-full">
      <div className="win98-titlebar">
        <span>YOUR TOKENS</span>
      </div>
      <div className="win98-panel p-2 h-[calc(100%-22px)] overflow-auto">
        {launchedCoins.length > 0 ? (
          <div className="space-y-1">
            {launchedCoins.map((coin) => (
              <div key={coin.id} className="win98-panel p-2">
                <div className="flex items-center gap-2">
                  {coin.artwork ? (
                    <div className="w-8 h-8 border win98-canvas flex items-center justify-center overflow-hidden">
                      <img
                        src={coin.artwork || "/placeholder.svg"}
                        alt={coin.name}
                        className="w-full h-full object-cover"
                        style={{ imageRendering: "pixelated" }}
                        onError={(e) => {
                          // Fallback if image fails to load
                          const target = e.target as HTMLImageElement
                          target.style.display = "none"
                          const parent = target.parentElement
                          if (parent) {
                            parent.innerHTML = `<div class="w-full h-full bg-gray-200 flex items-center justify-center text-[6px]">${coin.ticker}</div>`
                          }
                        }}
                      />
                    </div>
                  ) : (
                    <div className="w-8 h-8 border bg-gray-200 flex items-center justify-center text-[6px] win98-canvas">
                      {coin.ticker}
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="text-[8px] font-bold">{coin.ticker}</div>
                    <div className="text-[7px] text-gray-600">{coin.name}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[7px] text-green-600">${coin.price}</div>
                    <div className="text-[6px] text-gray-500">{coin.launchDate}</div>
                  </div>
                </div>
              </div>
            ))}
            {JSON.parse(localStorage.getItem("launchedCoins") || "[]").length > 3 && (
              <div className="text-[7px] text-center text-gray-600 py-1">
                +{JSON.parse(localStorage.getItem("launchedCoins") || "[]").length - 3} MORE TOKENS
              </div>
            )}
          </div>
        ) : (
          <div className="win98-panel p-3 text-center">
            <div className="text-[8px] text-gray-600 mb-1">NO TOKENS YET</div>
            <div className="text-[7px] text-gray-600">Create your first token!</div>
          </div>
        )}
      </div>
    </div>
  )
}
