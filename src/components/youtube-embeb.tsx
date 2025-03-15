import type React from "react"

interface YouTubeEmbedProps {
  videoId?: string
}

export const YouTubeEmbed: React.FC<YouTubeEmbedProps> = ({ videoId }) => {

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

