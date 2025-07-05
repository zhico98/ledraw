"use client"

import { useState, useEffect, useRef } from "react"

interface ChatMessage {
  id: number
  timestamp: string
  username: string
  message: string
  type: "user" | "system"
}

export default function Chat() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [username, setUsername] = useState("")
  const [showUsernameDialog, setShowUsernameDialog] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Initialize with some sample messages
    const initialMessages: ChatMessage[] = [
      {
        id: 1,
        timestamp: new Date().toLocaleTimeString(),
        username: "LEDRAW_ADMIN",
        message: "WELCOME TO LEDRAW CHAT!",
        type: "system",
      },
      {
        id: 2,
        timestamp: new Date().toLocaleTimeString(),
        username: "pixel_artist",
        message: "JUST LAUNCHED MY NEW TOKEN WITH MY PIXEL ART!",
        type: "user",
      },
      {
        id: 3,
        timestamp: new Date().toLocaleTimeString(),
        username: "crypto_degen",
        message: "LEDRAW TO THE MOON!",
        type: "user",
      },
    ]
    setMessages(initialMessages)

    // Auto-generate messages every 10 seconds (faster for testing)
    const interval = setInterval(() => {
      const randomUsers = [
        "pixel_master",
        "art_lover",
        "token_creator",
        "hodler",
        "degen",
        "artist",
        "trader",
        "memer",
        "based_anon",
        "edgelord",
        "sigma_male",
        "chad_artist",
        "anon_user",
        "crypto_bro",
        "nft_flipper",
        "diamond_hands",
        "paper_hands",
        "moon_boy",
        "bear_killer",
        "bull_runner",
      ]

      const randomMessages = [
        "AMAZING PIXEL ART!",
        "JUST CREATED MY TOKEN!",
        "LEDRAW IS THE BEST!",
        "LOVE THIS PLATFORM!",
        "TO THE MOON!",
        "DIAMOND HANDS!",
        "GREAT ART BRO!",
        "WHEN LAMBO?",
        "HODL STRONG!",
        "PIXEL ART = FUTURE!",
        "BASED AND REDPILLED",
        "NORMIES DONT UNDERSTAND",
        "WAGMI FRENS",
        "NGMI SORRY",
        "COPE AND SEETHE",
        "TOUCH GRASS",
        "RENT FREE",
        "SKILL ISSUE",
        "GET REKT",
        "STAY MAD",
        "LFG!!!",
        "BULLISH AF",
        "BEARISH RN",
        "PUMP IT UP",
        "DUMP INCOMING",
        "BUY THE DIP",
        "SELL THE TOP",
        "FOMO KICKING IN",
        "FUD EVERYWHERE",
        "DYOR ALWAYS",
      ]

      const newMsg: ChatMessage = {
        id: Date.now() + Math.random(),
        timestamp: new Date().toLocaleTimeString(),
        username: randomUsers[Math.floor(Math.random() * randomUsers.length)],
        message: randomMessages[Math.floor(Math.random() * randomMessages.length)],
        type: "user",
      }

      setMessages((prev) => [...prev, newMsg].slice(-50)) // Keep only last 50 messages
    }, 10000) // Every 10 seconds

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const sendMessage = () => {
    if (!newMessage.trim()) return

    if (!username) {
      setShowUsernameDialog(true)
      return
    }

    const message: ChatMessage = {
      id: Date.now(),
      timestamp: new Date().toLocaleTimeString(),
      username: username,
      message: newMessage,
      type: "user",
    }

    setMessages((prev) => [...prev, message])
    setNewMessage("")
  }

  const setUsernameAndSend = (name: string) => {
    setUsername(name)
    setShowUsernameDialog(false)
    if (newMessage.trim()) {
      sendMessage()
    }
  }

  return (
    <>
      <div className="win98-window h-full">
        <div className="win98-titlebar">
          <div className="flex items-center gap-2">
            <img
              src="/images/paintbrush-icon.png"
              alt="LEDRAW"
              className="w-4 h-4"
              style={{ imageRendering: "pixelated" }}
            />
            <span>LEDRAW CHAT - COMMUNITY ({messages.length} MESSAGES)</span>
          </div>
        </div>

        <div className="win98-panel p-4 h-[calc(100%-22px)]">
          {/* Chat Messages */}
          <div className="win98-canvas p-3 h-[calc(100%-60px)] overflow-y-auto mb-3 font-mono text-[10px]">
            {messages.map((msg) => (
              <div key={msg.id} className="mb-1">
                <span className="text-gray-600">[{msg.timestamp}]</span>{" "}
                <span className={`font-bold ${msg.type === "system" ? "text-blue-600" : ""}`}>{msg.username}:</span>{" "}
                <span>{msg.message}</span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="flex gap-2">
            <input
              type="text"
              className="win98-input flex-1 text-[10px]"
              placeholder="TYPE MESSAGE..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button className="win98-button text-[10px] px-3" onClick={sendMessage}>
              SEND
            </button>
          </div>
        </div>
      </div>

      {/* Username Dialog */}
      {showUsernameDialog && (
        <>
          <div className="win98-overlay" onClick={() => setShowUsernameDialog(false)} />
          <div className="win98-dialog win98-window">
            <div className="win98-titlebar">
              <span>ENTER USERNAME</span>
            </div>
            <div className="win98-panel p-4">
              <input
                type="text"
                className="win98-input w-full mb-3"
                placeholder="YOUR USERNAME"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const target = e.target as HTMLInputElement
                    setUsernameAndSend(target.value)
                  }
                }}
              />
              <div className="flex justify-center">
                <button
                  className="win98-button px-4"
                  onClick={(e) => {
                    const input = e.currentTarget.parentElement?.previousElementSibling as HTMLInputElement
                    setUsernameAndSend(input.value)
                  }}
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}
