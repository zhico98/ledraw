"use client"

import { useState } from "react"
import PixelCanvas from "@/components/pixel-canvas"
import ToolPanel from "@/components/tool-panel"
import ColorPalette from "@/components/color-palette"
import SkullGallery from "@/components/skull-gallery"
import BackgroundCreator from "@/components/background-creator"
import CoinLauncher from "@/components/coin-launcher"
import Chat from "@/components/chat"
import MobileNavigation from "@/components/mobile-navigation"
import SocialLinks from "@/components/social-links"

export default function Home() {
  const [activeTab, setActiveTab] = useState("canvas")
  const [selectedTool, setSelectedTool] = useState("brush")
  const [canvasSize, setCanvasSize] = useState(32)
  const [selectedColor, setSelectedColor] = useState("#000000")
  const [canvasBackground, setCanvasBackground] = useState("")

  const tabs = [
    { id: "canvas", label: "CANVAS", icon: "" },
    { id: "archive", label: "ARCHIVE", icon: "" },
    { id: "background", label: "BACKGROUND", icon: "" },
    { id: "chat", label: "CHAT", icon: "" },
  ]

  const handleBackgroundChange = (background: string) => {
    setCanvasBackground(background)
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "canvas":
        return (
          <div className="flex gap-4 h-full">
            {/* Left Panel - Tools and Colors */}
            <div className="flex flex-col gap-4 w-64">
              <ToolPanel
                selectedTool={selectedTool}
                onToolChange={setSelectedTool}
                canvasSize={canvasSize}
                onCanvasSizeChange={setCanvasSize}
              />
              <ColorPalette selectedColor={selectedColor} onColorChange={setSelectedColor} />
            </div>

            {/* Center - Canvas with integrated Token Creator */}
            <div className="flex-1">
              <PixelCanvas
                size={canvasSize}
                selectedTool={selectedTool}
                selectedColor={selectedColor}
                background={canvasBackground}
              />
            </div>

            {/* Right Panel - Your Tokens and Launchpads */}
            <div className="w-80 flex flex-col gap-4">
              <div className="flex-1">
                <div className="win98-window h-full">
                  <div className="win98-titlebar">
                    <span>YOUR TOKENS</span>
                  </div>
                  <div className="win98-panel p-2 h-[calc(100%-22px)] overflow-auto">
                    <div className="win98-panel p-3 text-center">
                      <div className="text-[8px] text-gray-600 mb-1">NO TOKENS YET</div>
                      <div className="text-[7px] text-gray-600">Create your first token!</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex-1">
                <CoinLauncher />
              </div>
            </div>
          </div>
        )
      case "archive":
        return <SkullGallery />
      case "background":
        return <BackgroundCreator onBackgroundChange={handleBackgroundChange} />
      case "chat":
        return <Chat />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-300 p-2 lg:p-4">
      {/* Header */}
      <div className="win98-window mb-4">
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
          <div className="flex gap-1">
            <button className="w-4 h-4 win98-button text-[8px] leading-none">_</button>
            <button className="w-4 h-4 win98-button text-[8px] leading-none">□</button>
            <button className="w-4 h-4 win98-button text-[8px] leading-none">×</button>
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex win98-panel p-2">
          <div className="flex gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`win98-button px-3 py-1 text-[10px] ${activeTab === tab.id ? "bg-gray-400" : ""}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="lg:hidden">
          <MobileNavigation tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
      </div>

      {/* Main Content */}
      <div className="h-[calc(100vh-120px)]">{renderTabContent()}</div>

      {/* Social Links - Fixed Bottom Left */}
      <SocialLinks />
    </div>
  )
}
