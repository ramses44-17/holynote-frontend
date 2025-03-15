import { format } from "date-fns"
import {fr} from "date-fns/locale"
import { Button } from "./ui/button"
import { Edit, BookOpen } from "lucide-react"
import { YouTubeEmbed } from "@/components/youtube-embeb"
import { useUserStore } from "@/stores/app-store"

interface ViewModeProps {
  date?: string
  topic?: string
  preacher?: string
  youtubeId?: string
  content?: string
  references?: string[]
}

export default function ViewMode({ date, topic, youtubeId, content, references, preacher }: ViewModeProps) {

  const {setMode} = useUserStore()
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-start mb-8">
        <div className="flex-grow">
          <p className="text-sm font-medium text-primary/70 dark:text-primary/80 tracking-wide uppercase">
            {date ? format(date, "PPP",{
              locale:fr
            }) : "Date non spécifiée"}
          </p>
          <h1 className="text-4xl font-bold mt-2 text-gray-900 dark:text-gray-50 leading-tight">{topic}</h1>
          <div className="flex items-center mt-3 text-sm text-gray-600 dark:text-gray-400">
            <span className="font-medium">Prédicateur:</span>
            <span className="ml-2 font-semibold text-gray-800 dark:text-gray-300">{preacher}</span>
          </div>
        </div>
        <Button
          variant="ghost"
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
            <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gray-200 dark:bg-gray-700"></div>

            <div className="pl-8">
              {content.split("\n").map((paragraph, index) => {
                if (!paragraph.trim()) {
                  return <div key={index} className="h-2"></div>
                }

                return (
                  <p key={index} className="text-gray-800 dark:text-gray-200 leading-relaxed text-lg">
                    {paragraph}
                  </p>
                )
              })}
            </div>
          </div>
        ) : (
          <div className="py-8 text-center">
            <p className="text-gray-500 dark:text-gray-400 italic">Aucune note disponible pour le moment.</p>
          </div>
        )}
      </div>

      {references && references.length > 0 && (
        <div className="mt-8 mb-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-3 text-gray-700 dark:text-gray-300">
            <BookOpen className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Références Bibliques</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {references.map((ref: string, index: number) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-foreground border border-primary/20 transition-all duration-200 hover:bg-primary/20 hover:scale-105"
              >
                {ref}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

//dans onclick on prend ref et c'est avec refe que l'on va faire des traitement et aussi il y'uras une modal dont l'etat sera contolé aussi pour afficher les notes 