import { extractYoutubeId } from "@/lib/utils"
import type React from "react"

interface YouTubeEmbedProps {
  youtubeUrl?: string
}

export const YouTubeEmbed: React.FC<YouTubeEmbedProps> = ({ youtubeUrl }) => {

  if (!youtubeUrl) return null

  const videoId = extractYoutubeId(youtubeUrl)

  if(!videoId) return null

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

