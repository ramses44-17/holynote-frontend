import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Popover, PopoverTrigger,PopoverContent } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@radix-ui/react-select"
import { Button } from "@/components/ui/button"
import { CalendarIcon, Check, Pencil, Save, Trash2, X} from "lucide-react"
// import { useEffect, useState } from "react";
import { format } from "date-fns";
import { YouTubeEmbed } from "./youtube-embeb";
import axios, { AxiosError } from "axios";
import { QueryObserverResult, RefetchOptions, useMutation } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { ToastAction } from "./ui/toast";
import { useUserStore } from "@/stores/app-store";
import { useEffect, useState } from "react";
import {bookNames} from "@/lib/bible"
import { Command, CommandGroup, CommandInput, CommandItem, CommandList } from "./ui/command";
import { Badge } from "./ui/badge";
import { apiBaseUrl, extractYoutubeId, youtubeUrlRegex } from "@/lib/utils";
import BibleDialog from "./bible-dialog";



interface EditModeProps {
  date?:string;
  topic?:string;
  preacher?:string
  youtubeId?:string;
  content?:string;
  references?:string[]
  color?:string;
  noteId?:string
  refetch:(options?: RefetchOptions) => Promise<QueryObserverResult<any, Error>>

}









const noteSchema = z.object({
  topic: z.string({
    message:"topic is required"
  }).min(1, "topic is required").max(60, "topic must be no longer than 60 characters"),
  content: z.string().optional(), // Peut être une chaîne vide
  color: z.string().max(10).default("red"),
  references: z.string().regex(
    /^([a-zA-ZÀ-ÿ]+\s\d{1,3}(:\d{1,3}(-\d{1,3})?)?(,\s[a-zA-ZÀ-ÿ]+\s\d{1,3}(:\d{1,3}(-\d{1,3})?)?)*)$/,
    {
      message: "Invalid references format",
    }
  ).optional(),
  youtubeUrl: z.string().url("invalid youtube url").regex(youtubeUrlRegex, "invalid youtube url").optional(),
  preacher: z.string({
    message:"preacher name is required"
  }).min(1, "preacher is required").max(60, "The preacher's name must not exceed 60 characters."),
  date: z
  .string({
    required_error: "Date is required",
  }).date()
})

const colorOptions = [
  { value: "red", label: "Rouge", color: "#ef4444" },
  { value: "blue", label: "Bleu", color: "#3b82f6" },
  { value: "violet", label: "Violet", color: "#8b5cf6" },
  { value: "orange", label: "Orange", color: "#f97316" },
];




export default function EditMode({date,topic,youtubeId,content,references,preacher,color,noteId,refetch}:EditModeProps) {


  const [selectedReferences, setSelectedReferences] = useState<string[]>(references!)
    const [referencesInputValue, setReferencesInputValue] = useState("")
    const [filteredBooks, setFilteredBooks] = useState(bookNames)
  


  const {setMode} = useUserStore()

  const form = useForm<z.infer<typeof noteSchema>>({
    resolver: zodResolver(noteSchema),
    defaultValues: {
      topic:  topic||"",
      preacher:preacher||"",
      content: content||"",
      color:color||"red",
      date: date||"",
      references: references?.join(",") ||"",
      youtubeUrl:undefined
    },
  });


 

  const updateNoteMutation = useMutation({
    mutationFn: async (data: z.infer<typeof noteSchema>) => {
      const response = await axios.patch(
        `${apiBaseUrl}/notes/${noteId}`,
        data,
        {
          withCredentials: true,
        }
      );
      return response.data;
    },
    onSuccess:  () => {
      refetch()
      setMode("view")
      toast({
        title: "Note updated successfuly",
        variant: "success",
      });
    },
    onError: (error: AxiosError,variables) => {
      toast({
        title: "Error while updating note, please retry",
        variant: "error",
        action:<ToastAction altText="Try again"
        onClick={ () => updateNoteMutation.mutate(variables!)}
        >Try again</ToastAction>
      });
      console.log("Error updating note",error);
    },
  })

  const [localYoutubeId, setLocalYoutubeId] = useState<string | null | undefined>(youtubeId);

  const youtubeUrl = form.watch("youtubeUrl")
  const currentYoutubeId = youtubeUrl ? extractYoutubeId(youtubeUrl) : localYoutubeId


useEffect(() => {
    form.setValue("references", selectedReferences.join(", "))
  }, [selectedReferences, form])

  // Filtrer les livres en fonction de la saisie
  useEffect(() => {
    if (referencesInputValue) {
      const parts = referencesInputValue.split(" ")
      if (parts.length === 1) {
        setFilteredBooks(bookNames.filter((book) => book.toLowerCase().includes(parts[0].toLowerCase())))
      } else {
        setFilteredBooks(bookNames)
      }
    } else {
      setFilteredBooks(bookNames)
    }
  }, [referencesInputValue])

  // Valider et ajouter une référence
  const addReference = () => {
    if (!referencesInputValue.trim()) return

    // Extraire le livre et le reste de la référence
    const parts = referencesInputValue.trim().split(" ")
    if (parts.length < 2) {
      toast({
        title: "Format invalide",
        description: "Veuillez entrer un livre et un chapitre (ex: Jean 3).",
        variant: "error",
      })
      return
    }

    // Vérifier si le livre existe
    let bookName = ""
    let restOfReference = ""

    // Trouver le livre le plus long qui correspond
    for (let i = 1; i < parts.length; i++) {
      const potentialBook = parts.slice(0, i).join(" ")
      const potentialRest = parts.slice(i).join(" ")

      if (bookNames.includes(potentialBook)) {
        bookName = potentialBook
        restOfReference = potentialRest
      }
    }

    if (!bookName) {
      toast({
        title: "Livre invalide",
        description: "Le livre biblique n'est pas reconnu.",
        variant: "error",
      })
      return
    }

    // Valider le format du chapitre et des versets
    const chapterVerseRegex = /^(\d+)(?::(\d+)(?:-(\d+))?)?$|^(\d+)\s+(\d+)(?:-(\d+))?$/
    const match = restOfReference.match(chapterVerseRegex)

    if (!match) {
      toast({
        title: "Format invalide",
        description: "Format accepté: livre chapitre, livre chapitre:verset, ou livre chapitre verset-versetFin",
        variant: "error",
      })
      return
    }

    // Formater la référence
    const reference = `${bookName} ${restOfReference}`

    // Ajouter si elle n'existe pas déjà
    if (!selectedReferences.includes(reference)) {
      setSelectedReferences((prev) => [...prev, reference])
      setReferencesInputValue("")
    }
  }

  // Supprimer une référence
  const removeReference = (reference: string) => {
    setSelectedReferences((prev) => prev.filter((ref) => ref !== reference))
  }

  // Ajouter un livre à l'entrée
  const addBookToInput = (book: string) => {
    setReferencesInputValue(book + " ")
  }




  function onSubmit(values: z.infer<typeof noteSchema>) {
    updateNoteMutation.mutate(values)
  }
  const [showYoutubeInput, setShowYoutubeInput] = useState(false);
  console.log(showYoutubeInput);
  const [open,setOpen] = useState(false)
  const [passage,setPassage] = useState("")

  

  const handleReferencesClick = (passage: string) => {
    setOpen(true)
    setPassage(passage)
  }
  return (
    <>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col w-full">
                      <FormLabel>Sermon Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={`w-[240px] justify-start text-left font-normal ${
                                !field.value && "text-muted-foreground"
                              }`}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value ? format(new Date(field.value), "PPP") : <span>Choose a date</span>}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value ? new Date(field.value) : undefined}
                            onSelect={(date) => field.onChange(date ? format(date, "yyyy-MM-dd") : "")}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Champ : Sujet */}
                <FormField
                  control={form.control}
                  name="topic"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Topic</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter topic" {...field} 
                        className="text-4xl font-bold"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Champ : Nom du prédicateur */}
                <FormField
                  control={form.control}
                  name="preacher"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preacher</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter preacher's name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

               {/* YouTube Video Preview */}
<div className="mb-4">
  {currentYoutubeId && (
    <div className="flex">
      <YouTubeEmbed videoId={currentYoutubeId} />
      
      {/* Boutons d'édition et de suppression */}
      <div>
        
        <Button
        type="button"
          variant="ghost"
          size="icon"
          onClick={() => {
            form.setValue("youtubeUrl", undefined);
            setShowYoutubeInput(true);
            setLocalYoutubeId(null);
          }}
        >
          <Trash2 className="h-5 w-5 text-red-500 hover:text-red-700" />
        </Button>
      </div>
    </div>
  )}

  {/* Input YouTube (affiché seulement si demandé) */}
  <div>
  {(showYoutubeInput || !youtubeId) && (
    <FormField
      control={form.control}
      name="youtubeUrl"
      render={({ field }) => (
        <FormItem className="relative">
          <FormLabel>Sermon youtube link</FormLabel>
          <FormControl>
            <Input
              placeholder="Enter YouTube URL (e.g., https://www.youtube.com/watch?v=dQw4w9WgXcQ)"
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )}
  </div>

</div>

                {/* Champ : Contenu */}
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sermon content</FormLabel>
                      <FormControl>
                        <textarea
                          className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          placeholder="Enter sermon notes"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Champ : Couleur */}
                <FormField
                  control={form.control}
                  name="color"
                  render={({ field }) => (
                    <FormItem>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Choose colors" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {colorOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              <div className="flex items-center gap-2">
                                <div className="h-4 w-4 rounded-full" style={{ backgroundColor: option.color }} />
                                <span>{option.label}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Champ : Références */}
                <FormField
            control={form.control}
            name="references"
            render={() => (
              <FormItem>
                <FormLabel>Biblical references</FormLabel>
                <FormControl>
                  <div className="space-y-2">
                  <div className="flex flex-wrap gap-2 mt-2">
                      {selectedReferences.map((reference, index) => (
                        <Badge key={index} variant="secondary" className="px-3 py-1 cursor-pointer underline" onClick={() => handleReferencesClick(reference)}>
                          {reference}
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-4 w-4 p-0 ml-1"
                            onClick={(e) => {
                              e.stopPropagation()
                              removeReference(reference)}}
                          >
                            <X className="h-3 w-3" />
                            <span className="sr-only">Supprimer</span>
                          </Button>
                        </Badge>
                      ))}
                    </div>
                    <div className="flex">
                      <Command className="rounded-lg border shadow-sm w-full">
                        <CommandInput
                          placeholder="Entrez des références (ex: Jean 3:16, Luc 1:13)"
                          value={referencesInputValue}
                          onValueChange={setReferencesInputValue}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault()
                              addReference()
                            }
                          }}
                        />
                        <CommandList className="max-h-40">
                          <CommandGroup heading="Suggestions">
                            {filteredBooks.slice(0, 5).map((book, index) => (
                              <CommandItem key={index} onSelect={() => addBookToInput(book)} className="cursor-pointer">
                                {book}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                      <Button type="button" onClick={addReference} className="ml-2">
                        Ajouter
                      </Button>
                    </div>

                    {/* Affichage des références sélectionnées */}
                    
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

                {/* Bouton de soumission */}
                <Button type="submit" disabled={updateNoteMutation.isPending}>
                  <Save className="h-4 w-4 mr-2" />
                  {updateNoteMutation.isPending ? "saving..." : "save"}
                </Button>
              </form>
            </Form>
            <BibleDialog open={open} passage={passage} setOpen={setOpen} />
          </>
  )
}
