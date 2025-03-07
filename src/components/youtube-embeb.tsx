import type React from "react"

interface YouTubeEmbedProps {
  url: string
}

export const YouTubeEmbed: React.FC<YouTubeEmbedProps> = ({ url }) => {
  const getYouTubeId = (url: string) => {
    const match = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?(.+)/)
    return match ? match[1] : null
  }

  const videoId = getYouTubeId(url)

  if (!videoId) return null

  return (
    <div className="relative w-full pt-[50%] rounded-lg overflow-hidden shadow-lg">
      <iframe
        className="absolute top-0 left-0 w-full h-full"
        src={`https://www.youtube.com/embed/${videoId}`}
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  )
}

