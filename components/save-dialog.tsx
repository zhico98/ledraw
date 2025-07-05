"use client"

import { useState } from "react"

interface SaveDialogProps {
  isOpen: boolean
  onClose: () => void
  onSave: (name: string) => void
  defaultName?: string
}

export default function SaveDialog({ isOpen, onClose, onSave, defaultName = "" }: SaveDialogProps) {
  const [artworkName, setArtworkName] = useState(defaultName)

  if (!isOpen) return null

  const handleSave = () => {
    if (artworkName.trim()) {
      onSave(artworkName.trim())
      onClose()
      setArtworkName("")
    }
  }

  const handleCancel = () => {
    onClose()
    setArtworkName("")
  }

  return (
    <>
      <div className="win98-overlay" onClick={handleCancel} />
      <div className="win98-dialog win98-window">
        <div className="win98-titlebar">
          <span>SAVE AS</span>
          <button className="w-5 h-5 win98-button text-[8px] leading-none" onClick={handleCancel}>
            X
          </button>
        </div>

        <div className="win98-panel p-6 space-y-4">
          <div>
            <label className="block mb-2 text-[10px]">FILE NAME:</label>
            <input
              type="text"
              value={artworkName}
              onChange={(e) => setArtworkName(e.target.value)}
              className="win98-input w-full"
              placeholder="UNTITLED"
              maxLength={20}
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSave()
                if (e.key === "Escape") handleCancel()
              }}
            />
          </div>

          <div>
            <label className="block mb-2 text-[10px]">SAVE AS TYPE:</label>
            <select className="win98-select w-full">
              <option>PIXEL ART (*.PIX)</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <button className="win98-button" onClick={handleSave} disabled={!artworkName.trim()}>
              SAVE
            </button>
            <button className="win98-button" onClick={handleCancel}>
              CANCEL
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
