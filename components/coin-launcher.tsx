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

interface LaunchpadSite {
  name: string
  description: string
  icon: string
  color: string
  fee: string
  url: string
}

export default function CoinLauncher() {
  const [launchedCoins, setLaunchedCoins] = useState<LaunchedCoin[]>([])

  const launchpadSites: LaunchpadSite[] = [
    {
      name: "PUMP.FUN",
      description: "FAIR LAUNCH PLATFORM",
      icon: "/images/pump-logo.png",
      color: "bg-green-500",
      fee: "1%",
      url: "https://pump.fun",
    },
    {
      name: "MOONIT",
      description: "DEX SCREENER LAUNCH",
      icon: "/images/moonit-logo.png",
      color: "bg-blue-500",
      fee: "1.5%",
      url: "https://moonit.cc",
    },
    {
      name: "BONK.GG",
      description: "SOLANA MEME COINS",
      icon: "/images/bonk-logo.png",
      color: "bg-orange-500",
      fee: "2%",
      url: "https://bonk.gg",
    },
    {
      name: "BOOP",
      description: "INSTANT LAUNCH",
      icon: "/images/boop-logo.png",
      color: "bg-blue-500",
      fee: "0.5%",
      url: "https://boop.fun",
    },
    {
      name: "TIME",
      description: "TIMED LAUNCHES",
      icon: "/images/time-logo.jpeg",
      color: "bg-pink-500",
      fee: "1.2%",
      url: "https://time.fun",
    },
    {
      name: "DAOS.FUN",
      description: "DAO GOVERNANCE",
      icon: "/images/daos-logo.jpeg",
      color: "bg-gray-800",
      fee: "2.5%",
      url: "https://daos.fun",
    },
    {
      name: "GOFUNDMEME",
      description: "CROWDFUND MEMES",
      icon: "/images/gfm-logo.png",
      color: "bg-black",
      fee: "3%",
      url: "https://gofundmeme.com",
    },
    {
      name: "AUTO LAUNCH",
      description: "AUTOMATED TRADING",
      icon: "/images/auto-logo.png",
      color: "bg-green-600",
      fee: "1.8%",
      url: "https://autolaunch.io",
    },
    {
      name: "BELIEVE",
      description: "FAITH BASED TOKENS",
      icon: "/images/launchcoin-logo.jpeg",
      color: "bg-green-400",
      fee: "0%",
      url: "https://believe.fun",
    },
    {
      name: "MENTAT AI",
      description: "AI POWERED LAUNCH",
      icon: "/images/ai-logo.png",
      color: "bg-purple-500",
      fee: "4%",
      url: "https://mentat.ai",
    },
  ]

  useEffect(() => {
    loadLaunchedCoins()
    const interval = setInterval(loadLaunchedCoins, 5000)
    return () => clearInterval(interval)
  }, [])

  const loadLaunchedCoins = () => {
    const coins = JSON.parse(localStorage.getItem("launchedCoins") || "[]")
    setLaunchedCoins(coins)
  }

  const handleSiteClick = (site: LaunchpadSite) => {
    // Open without showing notifications
    const newWindow = window.open(site.url, "_blank", "noopener,noreferrer")
    if (newWindow) {
      newWindow.focus()
    }
  }

  return (
    <div className="win98-window h-full">
      <div className="win98-titlebar">
        <span>LAUNCHPADS.EXE</span>
      </div>
      <div className="win98-panel p-2 h-[calc(100%-22px)] overflow-auto">
        <div className="space-y-1">
          {launchpadSites.map((site, index) => (
            <div
              key={index}
              className="win98-panel p-2 cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => handleSiteClick(site)}
            >
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded flex items-center justify-center overflow-hidden">
                  <img
                    src={site.icon || "/placeholder.svg"}
                    alt={site.name}
                    className="w-full h-full object-cover"
                    style={{ imageRendering: "pixelated" }}
                  />
                </div>
                <div className="flex-1">
                  <div className="text-[8px] font-bold">{site.name}</div>
                  <div className="text-[7px] text-gray-600">{site.description}</div>
                </div>
                <div className="text-[7px] text-green-600 font-bold">FEE: {site.fee}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
