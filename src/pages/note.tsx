import Header from "@/components/header"
import { useState } from "react"
import { useNavigate, useParams } from "react-router"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Trash2, Save, Edit, CalendarIcon, ArrowLeft, Youtube } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { YouTubeEmbed } from "@/components/youtube-embeb"

export default function Note() {

  //ajouter une validation
  //améliorer le style
  const [mode, setMode] = useState<"view" | "edit">("view")
  const [topic, setTopic] = useState("The Power of Faith")
  const [preacherName, setPreacherName] = useState("Pastor John Doe")
  const [content, setContent] = useState(
    "Faith is the substance of things hoped for, the evidence of things not seen. It is through faith that we understand that the universe was formed at God's command, so that what is seen was not made out of what was visible.",
  )
  const [references, setReferences] = useState(["Hebrews 11:1", "Hebrews 11:3"])
  const [date, setDate] = useState<Date | undefined>(new Date("2023-06-15"))
  const [videoUrl, setVideoUrl] = useState("https://www.youtube.com/watch?v=dQw4w9WgXcQ")
  const [isEditingVideo, setIsEditingVideo] = useState(false)

  const noteId = useParams().noteId
  const navigate = useNavigate()

  const handleSave = () => {
    // Logic to save changes
    setMode("view")
    setIsEditingVideo(false)
  }

  const handleDelete = () => {
    // Logic to delete the note
    alert("Note deleted!")
  }

  // const handleNoteChanges = (first) => { second }

  const handleBack = () => {
    if(mode === "edit"){
      setMode('view')
    }
    else{
      navigate(-1)
    }
   }
  return (
    <div className="flex flex-col min-h-screen">
      <button
        className="flex items-center font-bold ml-4 mt-4 text-gray-600 hover:text-blue-500 transition-all duration-200 ease-in-out"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="h-5 w-5 mr-2" />
        Back
      </button>
      <div className="flex flex-1 px-4 flex-col py-4 max-w-4xl mx-auto w-full">
        <div className="bg-white  p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-grow">
              {mode === "view" ? (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Sermon from {date ? format(date, "PPP") : "Unknown date"}
                </p>
              ) : (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn("w-[240px] justify-start text-left font-normal", !date && "text-muted-foreground")}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                  </PopoverContent>
                </Popover>
              )}
              {mode === "view" ? (
                <h1 className="text-3xl font-bold mt-2 text-gray-900 dark:text-gray-100">{topic}</h1>
              ) : (
                <Input
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="text-2xl md:text-3xl font-bold mt-2 w-full bg-transparent text-gray-900 dark:text-gray-100"
                />
              )}
              {mode === "view" ? (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Preacher: {preacherName}</p>
              ) : (
                <Input
                  value={preacherName}
                  onChange={(e) => setPreacherName(e.target.value)}
                  className="text-sm bg-transparent text-gray-500 dark:text-gray-400 mt-1"
                />
              )}
            </div>
            {mode === "view" && (
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-500 hover:text-gray-900 dark:hover:text-gray-100"
                onClick={() => setMode("edit")}
              >
                <Edit className="h-4 w-4" />
              </Button>
            )}
          </div>

          <YouTubeEmbed
            url={videoUrl}
            onEdit={() => setIsEditingVideo(true)}
            isEditing={isEditingVideo || mode === "edit"}
          />

          {(isEditingVideo || mode === "edit") && (
            <div className="flex items-center mb-4">
              <Youtube className="h-5 w-5 mr-2 text-red-500" />
              <Input
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="Enter YouTube video URL"
                className="flex-grow bg-transparent text-gray-700 dark:text-gray-300"
              />
            </div>
          )}

          {mode === "view" ? (
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line mb-4 mt-4">{content}</p>
          ) : (
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full min-h-[200px] bg-transparent text-gray-700 dark:text-gray-300 mb-4"
            />
          )}

          {mode === "view" ? (
            references.length > 0 && (
              <div className="mt-4 flex items-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Biblic References:{" "}
                  <span className="underline decoration-dashed cursor-pointer">{references.join(", ")}</span>
                </p>
              </div>
            )
          ) : (
            <Input
              value={references.join(", ")}
              onChange={(e) => setReferences(e.target.value.split(", "))}
              placeholder="Enter references (e.g., Hebrews 11:1-3, John 3:16-17)"
              className="mt-4 w-full bg-transparent text-gray-500 dark:text-gray-400"
            />
          )}
        </div>

        {(mode === "edit" || isEditingVideo) && (
          <div className="flex justify-end gap-2">
            {mode === "edit" && (
              <Button onClick={handleDelete}>
                <Trash2 className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            )}
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

