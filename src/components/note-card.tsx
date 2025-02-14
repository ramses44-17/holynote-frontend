import { format } from "date-fns"
import { Trash2, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface NoteProps {
  id: number
  topic: string
  preacherName: string
  date: Date
  color: "red" | "blue" | "violet" | "amber" | "orange"
  content: string
  references: string[]
  onDelete: (id: number) => void
}

const colorClasses = {
  red: "bg-red-50 border-red-200 text-red-700",
  blue: "bg-blue-50 border-blue-200 text-blue-700",
  violet: "bg-violet-50 border-violet-200 text-violet-700",
  amber: "bg-amber-50 border-amber-200 text-amber-700",
  orange: "bg-orange-50 border-orange-200 text-orange-700",
}

export default function NoteCard({ id, topic, preacherName, date, content, color, references, onDelete }: NoteProps) {
  const handleDeleteClick = (event) => {
    event.stopPropagation(); // Empêche la propagation de l'événement
    event.preventDefault(); // Empêche le comportement par défaut (navigation)
    onDelete(id); // Appelle la fonction de suppression
  };
  return (
    <Card className={`w-full max-w-md shadow-lg border-l-4 ${colorClasses[color]}`}>
      <CardHeader className="relative pb-2">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold">{topic}</h3>
            <p className="text-sm text-muted-foreground">{preacherName}</p>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 text-muted-foreground hover:text-destructive"
                  onClick={handleDeleteClick}
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Delete note</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Delete note</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent>
          {content.length > 0 && <p className="text-sm line-clamp-6">
          {content}
          </p>}
          {content.length === 0 && <p className="text-sm">
          No content...
          </p>}
        {references.length === 0 && <p className="text-sm text-muted-foreground">No references</p>}
        {references.length > 0 && (
          <div className="mt-4 flex items-center">
            <BookOpen className="h-4 w-4 mr-2" />
            <p className="text-xs text-muted-foreground">{references.join(", ")}</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">Sermon from {format(date, "MMMM d, yyyy")}</CardFooter>
    </Card>
  )
}

