import { format } from "date-fns";
import axios, { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import {bookNames} from "@/lib/bible"
import { Command, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { CardContent,Card,CardTitle } from "@/components/ui/card";
import { YouTubeEmbed } from "@/components/youtube-embeb";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {  CalendarIcon, X } from "lucide-react";
import { useState,useEffect } from "react";
import { useNavigate } from "react-router";
import { apiBaseUrl, extractYoutubeId, youtubeUrlRegex } from "@/lib/utils";
import BibleDialog from "./bible-dialog";





const noteSchema = z.object({
  topic: z.string({
    message:"topic is required"
  }).min(1, "topic is required").max(60, "topic must be no longer than 60 characters"),
  content: z.string().optional(), // Peut être une chaîne vide
  color: z.string().max(10).default("red"),
  references: z.string()
  .optional(),
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




export default function AddNoteForm() {


  const [selectedReferences, setSelectedReferences] = useState<string[]>([])
  const [referencesInputValue, setReferencesInputValue] = useState("")
  const [filteredBooks, setFilteredBooks] = useState(bookNames)

  const form = useForm<z.infer<typeof noteSchema>>({
    resolver: zodResolver(noteSchema),
    defaultValues: {
      topic: "",
      preacher: "",
      color: "red",
      date: "",
      references: "",
      youtubeUrl:undefined,
      content:""
    },
  });



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

const navigate = useNavigate()
  const addNoteMutation = useMutation({
    mutationFn: async (data: z.infer<typeof noteSchema>) => {
      const response = await axios.post(
        `${apiBaseUrl}/notes`,
        data,
        {
          withCredentials: true,
        }
      );
      return response.data;
    },
    onSuccess:  (data) => {
      navigate(`/notes/${data.id}`)
      toast({
        title: "Note created successfuly",
        variant: "success",
      });
    },
    onError: (error: AxiosError,variables) => {
      toast({
        title: "Error while initializing note",
        variant: "error",
        action:<ToastAction altText="Try again"
        onClick={ () => addNoteMutation.mutate(variables!)}
        >Try again</ToastAction>
      });
      console.log("Error updating note",error);
    },
  })

  function onSubmit(values: z.infer<typeof noteSchema>) {
    addNoteMutation.mutate(values)
    // console.log(values); 
  }

  const [open,setOpen] = useState(false)
  const [passage,setPassage] = useState("")

  const handleReferencesClick = (passage: string) => {
    setOpen(true)
    setPassage(passage)
  }

  const youtubeUrl = form.watch("youtubeUrl")
  return (
    <><Card className="rounded-none border-none shadow-none w-full">
      <CardContent>
        <CardTitle className="font-bold text-center text-xl">Create new sermon note</CardTitle>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            {/* Champ : Sujet */}
            <FormField
              control={form.control}
              name="topic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Topic</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter topic" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

            {/* Champ : Nom du prédicateur */}
            <FormField
              control={form.control}
              name="preacher"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preacher</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter preacher's name" {...field} required />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

            {/* Champ : Date */}
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col w-full">
                  <FormLabel>Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={`w-[240px] justify-start text-left font-normal ${!field.value && "text-muted-foreground"}`}
                          type="button"
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
                        onSelect={(date) => field.onChange(format(new Date(date!), "yyyy-MM-dd"))}
                        initialFocus />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )} />

            {/* Champ : Couleur */}
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Couleur</FormLabel>
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
                            <div
                              className="h-4 w-4 rounded-full"
                              style={{ backgroundColor: option.color }} />
                            <span>{option.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />

            <FormField
              control={form.control}
              name="youtubeUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sermon youtube link</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter YouTube URL"
                      {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

            {youtubeUrl && <YouTubeEmbed videoId={extractYoutubeId(youtubeUrl)!} />}

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>note</FormLabel>
                  <FormControl>
                    <textarea
                      className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Enter sermon notes"
                      {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

            {/* Champ : Références */}
            <FormField
              control={form.control}
              name="references"
              render={() => (
                <FormItem>
                  <FormLabel>Références bibliques</FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-2 mt-2">
                        {selectedReferences.map((reference, index) => (
                          <Badge key={index} variant="secondary" className="px-3 py-1 cursor-pointer underline"
                            onClick={() => handleReferencesClick(reference)}
                          >
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
                                e.preventDefault();
                                addReference();
                              }
                            } } />
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
              )} />
            {/* Bouton de soumission */}
            <Button type="submit" className="w-full" disabled={addNoteMutation.isPending}
            >
              {addNoteMutation.isPending ? "initializing..." : "initialize"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card><BibleDialog open={open} passage={passage} setOpen={setOpen} /></>
  )
}
