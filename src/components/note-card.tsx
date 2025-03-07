import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { BookOpen, Mic2, Calendar, MoreHorizontal, Trash2, Edit } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"

interface NoteProps {
  id: string
  topic: string
  preacher: string
  date: Date
  color: string | "red" | "blue" | "violet" | "amber" | "orange" | "none"
  content: string
  references: string[]
}

export default function noteCard({ id, topic, preacher, date, content, color, references }: NoteProps) {
  const bgStyle = color === "none" ? "bg-none" : `bg-${color}-400 border-${color}-200`

  // Function to truncate references list if too long
  const formatReferences = (refs: string[]) => {
    const joinedRefs = refs.join(", ")
    if (joinedRefs.length > 50) {
      return joinedRefs.substring(0, 50) + "..."
    }
    return joinedRefs
  }

  return (
    <Card className={`${bgStyle} shadow-lg border-l-4`}>
      <CardHeader>
        <div className="flex flex-col gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger className="self-end cursor-pointer">
              <MoreHorizontal className="h-6 w-6 mr-2" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="text-sm font-medium text-gray-600 opacity-80 flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            <p>{format(date, "EEEE d MMMM yyyy", { locale: fr })}</p>
          </div>
          <CardTitle className="font-extrabold mt-2">{topic}</CardTitle>
          <div className="self-end text-sm flex items-center">
            <Mic2 className="h-4 w-4 mr-2" />
            <p className="font-semibold">{preacher}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        {content.length === 0 ? (
          <p className="text-sm">No content...</p>
        ) : (
          <p className="line-clamp-3 overflow-ellipsis">{content}</p>
        )}
      </CardContent>
      <CardFooter>
        {references.length === 0 ? (
          <p className="text-xs">No references...</p>
        ) : (
          <div className="flex items-center">
            <BookOpen className="h-4 w-4 mr-2" />
            <p className="text-xs truncate max-w-[200px]" title={references.join(", ")}>
              {formatReferences(references)}
            </p>
          </div>
        )}
      </CardFooter>
    </Card>
  )
}

