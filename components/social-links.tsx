"use client"

export default function SocialLinks() {
  const socialLinks = [
    {
      name: "Twitter",
      url: "https://x.com/ledrawdotfun",
    },
    {
      name: "Chart",
      url: "https://letsbonk.fun/",
    },
    {
      name: "Telegram",
      url: "https://t.me/ledrawfun",
    },
  ]

  const handleLinkClick = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer")
  }

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <div className="flex gap-1">
        {socialLinks.map((link) => (
          <button
            key={link.name}
            className="win98-button text-[10px] px-3 py-1 hover:bg-gray-200"
            onClick={() => handleLinkClick(link.url)}
            title={`Visit ${link.name}`}
          >
            {link.name}
          </button>
        ))}
      </div>
    </div>
  )
}
