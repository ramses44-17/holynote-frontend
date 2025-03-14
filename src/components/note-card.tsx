import { Edit, MoreVertical, Trash2, Youtube } from "lucide-react"
import { Button } from "./ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"
import useFetchVideo from "@/hooks/use-fetch-youtube-video-info"
import { useNavigate } from "react-router"


interface NoteProps {
  id: string
  topic: string
  preacher: string
  date: Date
  color: string | "red" | "blue" | "violet" | "amber" | "orange" 
  content: string
  references: string[],
  youtubeId:string | null
}

function YouTubeThumbnail({ youtubeId }: { youtubeId: string | null}) {



  const { data, isLoading, isError } = useFetchVideo(youtubeId);

  if (!youtubeId) return null;


  return (
    <div className="mt-4 pt-4 border-t border-border flex gap-2">
        {/* Thumbnail on the left */}
        <div className="relative w-24 h-14 flex-shrink-0 rounded-lg overflow-hidden shadow-md">
          {isLoading ? (
            <div className="w-full h-full bg-gray-200 animate-pulse rounded-md"></div> // Chargement avec animation
          ) : isError ? (
            <div className="w-full h-full bg-gray-500 text-white flex items-center justify-center text-xs rounded-md">
              Error loading thumbnail
            </div>
          ) : (
            <img
              src={data?.thumbnails.medium.url}
              alt="YouTube video thumbnail"
              className="object-cover w-full h-full"
            />
          )}
          {/* Play icon when not loading */}
          {!isLoading && !isError && (
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Youtube className="h-5 w-5 text-white" />
            </div>
          )}
        </div>

        {/* Title and video details on the right */}
        <div className="flex-grow min-w-0">
          {isLoading ? (
            <div className="w-32 h-4 bg-gray-200 animate-pulse rounded-md"></div> // Title loading animation
          ) : isError ? (
            <p className="text-xs text-red-500">Failed to load video details</p>
          ) : (
            <p className="text-sm font-semibold text-card-foreground line-clamp-2">{data?.title}</p>
          )}
          <p className="text-xs text-muted-foreground flex items-center mt-1">
            <Youtube className="h-3 w-3 mr-1 inline" />
            YouTube
          </p>
        </div>
    </div>
  );
}


export default function NoteCard({ id, topic, preacher, date, color, content, references ,youtubeId}:NoteProps) {



  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })

  const navigate = useNavigate()
  const handleEdit = (event:React.MouseEvent<HTMLDivElement>,noteId?:string) => {
    event.preventDefault()
    event.stopPropagation()
    navigate(`/notes/${noteId}`)
  }

  const handleDelete = (event:React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()
    console.log(`Delete note ${id}`)
    // Add your delete logic here
  }

  return (
    <div className="group relative flex flex-col h-full rounded-xl overflow-hidden border border-border bg-card shadow-sm transition-all duration-300 hover:shadow-md hover:translate-y-[-2px]">
      <div className="absolute top-0 left-0 w-full h-1.5" style={{ backgroundColor: color }} />

      {/* More Options Dropdown - Now always visible */}
      <div className="absolute top-2 right-2 z-10">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.preventDefault()}>
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={(event) => handleEdit(event,id)}>
              <Edit className="mr-2 h-4 w-4" />
              <span>Edit</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={handleDelete}>
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex flex-col h-full p-5">
        <div className="mb-2">
          <h3 className="text-lg font-semibold text-card-foreground line-clamp-1">{topic}</h3>
          <p className="text-sm text-muted-foreground">
            {preacher} • {formattedDate}
          </p>
        </div>

        {content ? (
          <p className="mt-2 text-card-foreground line-clamp-3 flex-grow overflow-hidden text-ellipsis">{content}</p>
        ) : (
          <p className="mt-2 text-muted-foreground italic flex-grow">No content available</p>
        )}

        {references && references.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {references.length <= 3 ? (
              // Show all references if there are 3 or fewer
              references.map((ref, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground"
                >
                  {ref}
                </span>
              ))
            ) : (
              // Show first 2 references and a count for the rest if there are more than 3
              <>
                {references.slice(0, 2).map((ref, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground"
                  >
                    {ref}
                  </span>
                ))}
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary text-primary-foreground">
                  +{references.length - 2} more
                </span>
              </>
            )}
          </div>
        ) : (
          <div className="mt-4">
            <span className="text-xs text-muted-foreground">No references</span>
          </div>
        )}
         <YouTubeThumbnail youtubeId={youtubeId} />
      </div>
    </div>
  )
}