import Header from "@/components/header";
import { useState } from "react";
import { useParams } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, Save, Edit, CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export default function Note() {
  const [mode, setMode] = useState<"view" | "edit">("view");
  const [topic, setTopic] = useState("The Power of Faith");
  const [preacherName, setPreacherName] = useState("Pastor John Doe");
  const [content, setContent] = useState(
    "Faith is the substance of things hoped for, the evidence of things not seen. It is through faith that we understand that the universe was formed at God's command, so that what is seen was not made out of what was visible."
  );
  const [references, setReferences] = useState(["Hebrews 11:1", "Hebrews 11:3"]);
  const [date, setDate] = useState(new Date("2023-06-15"));

  const noteId = useParams().noteId;

  const handleSave = () => {
    // Logique pour sauvegarder les modifications
    setMode("view");
  };

  const handleDelete = () => {
    // Logique pour supprimer la note
    alert("Note deleted!");
  };

  return (
    <div className="min-h-screen bg-red-50 text-red-700 ">
      <Header />
      <div className="container mx-auto px-4 py-8" onClick={() => setMode("edit")}>
        {/* En-tête de la note */}
        <div className=" dark:bg-gray-800 p-6 ">
          <div className="flex justify-between items-start">
            <div>
            {mode === "view" ? (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Sermon from {new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                </p>
              ) : (
                <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[240px] justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              )}
              {mode === "view" ? (
                <h1 className="text-3xl font-bold mt-2 text-gray-900 dark:text-gray-100">{topic}</h1>
              ) : (
                <Input
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="text-3xl font-bold mt-2 w-full bg-transparent text-gray-900 dark:text-gray-100"
                />
              )}
              {mode === "view" ? (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Preacher: {preacherName}</p>
              ) : (
                <Input
                  value={preacherName}
                  onChange={(e) => setPreacherName(e.target.value)}
                  className="text-sm w-full bg-transparent text-gray-500 dark:text-gray-400 mt-1"
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
        </div>

        {/* Contenu de la note */}
        <div className="p-6">
          {mode === "view" ? (
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{content}</p>
          ) : (
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-40 bg-transparent text-gray-700 dark:text-gray-300"
            />
          )}
          {mode === "view" ? references.length > 0 && (
            <div className="mt-4 flex items-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">References: <span className="underline decoration-dashed cursor-pointer">{references.join(", ")}</span></p>
            </div>
          ):(
            <Input
  value={references.join(", ")}
  onChange={(e) => setReferences([e.target.value])}
  placeholder="Enter references (e.g., Hebrews 11:1-3, John 3:16-17)"
  className="mt-4 w-full bg-transparent text-gray-500 dark:text-gray-400"
/>
          )}
        </div>

        {/* Boutons d'action en mode édition */}
        {mode === "edit" && (
          <div className="mt-6 flex justify-end gap-2">
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}