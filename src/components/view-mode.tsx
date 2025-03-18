import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Button } from "./ui/button"
import { Edit, BookOpen, Quote, ChevronRight } from "lucide-react"
import { YouTubeEmbed } from "@/components/youtube-embeb"
import { useUserStore } from "@/stores/app-store"
import { Badge } from "./ui/badge"
import { useState } from "react"
import BibleDialog from "./bible-dialog"
import { cn } from "@/lib/utils"

interface ViewModeProps {
  date?: string
  topic?: string
  preacher?: string
  youtubeId?: string
  content?: string
  references?: string[]
}

export default function ViewMode({ date, topic, youtubeId, content, references, preacher }: ViewModeProps) {
  const { setMode } = useUserStore()
  const [open, setOpen] = useState(false)
  const [passage, setPassage] = useState("")

  const handleReferencesClick = (passage: string) => {
    setOpen(true)
    setPassage(passage)
  }

  // Function to detect if a paragraph is a quote (starts with "> ")
  const isQuote = (paragraph: string) => paragraph.trim().startsWith("> ")

  // Function to detect if a paragraph is a heading (starts with "# " or "## ")
  const isHeading = (paragraph: string) => {
    const trimmed = paragraph.trim()
    return trimmed.startsWith("# ") || trimmed.startsWith("## ")
  }

  // Function to format the paragraph based on its content
  const formatParagraph = (paragraph: string, index: number) => {
    if (!paragraph.trim()) {
      return <div key={index} className="h-4" />
    }

    if (isQuote(paragraph)) {
      return (
        <blockquote
          key={index}
          className="my-6 border-l-4 border-primary pl-6 italic text-gray-700 dark:text-gray-300 break-words overflow-wrap-anywhere"
        >
          <div className="relative">
            <Quote className="absolute -left-10 top-0 h-6 w-6 text-primary/40" />
            {paragraph.replace(/^>\s/, "")}
          </div>
        </blockquote>
      )
    }

    if (isHeading(paragraph)) {
      const level = paragraph.startsWith("## ") ? "h3" : "h2"
      const content = paragraph.replace(/^##+\s/, "")

      return level === "h2" ? (
        <h2 key={index} className="text-2xl font-bold mt-8 mb-4 text-gray-800 dark:text-gray-100">
          {content}
        </h2>
      ) : (
        <h3 key={index} className="text-xl font-semibold mt-6 mb-3 text-gray-700 dark:text-gray-200">
          {content}
        </h3>
      )
    }

    // Check if paragraph contains a biblical reference pattern (e.g., Jean 3:16)
    const biblicalRefPattern = /([1-3]?\s?[A-Za-zÀ-ÿ]+\s\d+:\d+(-\d+)?)/g
    const parts = []
    let lastIndex = 0
    let match

    // Clone the paragraph text to work with
    const text = paragraph

    // Find all biblical references in the paragraph
    while ((match = biblicalRefPattern.exec(text)) !== null) {
      // Add text before the reference
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index))
      }

      // Add the reference as a clickable element
      const reference = match[0]
      parts.push(
        <span
          key={`${index}-${match.index}`}
          className="text-primary font-medium cursor-pointer hover:underline"
          onClick={() => handleReferencesClick(reference)}
        >
          {reference}
        </span>,
      )

      lastIndex = match.index + match[0].length
    }

    // Add any remaining text
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex))
    }

    return (
      <p
        key={index}
        className="text-gray-800 dark:text-gray-200 leading-relaxed text-lg my-4 first:mt-0 break-words overflow-wrap-anywhere hyphens-auto"
      >
        {parts.length > 0 ? parts : text}
      </p>
    )
  }

  return (
    <div className="max-w-4xl mx-auto [&_*]:max-w-full [&_pre]:overflow-x-auto [&_code]:break-words">
      <div className="flex justify-between items-start mb-8">
        <div className="flex-grow">
          <p className="text-sm font-medium text-primary/70 dark:text-primary/80 tracking-wide">
            {date ? format(date, "PPPP", { locale: fr }) : "Date non spécifiée"}
          </p>
          <h1 className="text-4xl font-bold mt-2 text-gray-900 dark:text-gray-50 leading-tight">{topic}</h1>
          <div className="flex items-center mt-3 text-sm text-gray-600 dark:text-gray-400">
            <span className="font-medium">Prédicateur:</span>
            <span className="ml-2 font-semibold text-gray-800 dark:text-gray-300">{preacher}</span>
          </div>
        </div>
        <Button
          variant="outline"
          size="icon"
          className="text-gray-500 hover:text-primary transition-colors duration-200"
          onClick={() => setMode("edit")}
        >
          <Edit className="h-4 w-4" />
          <span className="sr-only">Modifier</span>
        </Button>
      </div>

      {youtubeId && (
        <div className="rounded-xl overflow-hidden shadow-lg mb-10 transition-transform duration-300 hover:scale-[1.01]">
          <YouTubeEmbed videoId={youtubeId} />
        </div>
      )}

      <div className="my-10">
        {content ? (
          <div className="relative">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary/60 via-primary/30 to-primary/10 rounded-full"></div>

            <div className="pl-8 prose prose-lg dark:prose-invert prose-headings:text-gray-900 dark:prose-headings:text-gray-100 prose-p:text-gray-800 dark:prose-p:text-gray-200 max-w-none overflow-hidden break-words">
              {content.split("\n").map((paragraph, index) => formatParagraph(paragraph, index))}
            </div>
          </div>
        ) : (
          <div className="py-12 text-center bg-gray-50 dark:bg-gray-800/30 rounded-lg border border-dashed border-gray-200 dark:border-gray-700">
            <p className="text-gray-500 dark:text-gray-400 italic">Aucune note disponible pour le moment.</p>
          </div>
        )}
      </div>

      {references && references.length > 0 && (
        <div className="mt-8 mb-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg p-5 border border-gray-100 dark:border-gray-700 shadow-sm">
          <div className="flex items-center gap-2 mb-4 text-gray-700 dark:text-gray-300">
            <BookOpen className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Références Bibliques</h3>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {references.map((reference, index) => (
              <Badge
                key={index}
                variant="secondary"
                className={cn(
                  "px-3 py-1.5 cursor-pointer hover:bg-primary/10 transition-colors duration-200",
                  "flex items-center gap-1 text-sm underline",
                )}
                onClick={() => handleReferencesClick(reference)}
              >
                {reference}
                <ChevronRight className="h-3 w-3 ml-0.5 opacity-70" />
              </Badge>
            ))}
          </div>
        </div>
      )}
      <BibleDialog open={open} passage={passage} setOpen={setOpen} />
    </div>
  )
}

