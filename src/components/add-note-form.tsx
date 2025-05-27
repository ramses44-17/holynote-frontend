import { format } from "date-fns";
import axios, { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { bookNames } from "@/lib/bible";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { CardContent, Card} from "@/components/ui/card";
import { YouTubeEmbed } from "@/components/youtube-embeb";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { CalendarIcon, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  apiBaseUrl
} from "@/lib/utils";
import BibleDialog from "./bible-dialog";
import RichTextEditorInput from "@/components/rich-text-editor-input";
import { Editor, JSONContent } from "@tiptap/react";
import noteSchema from "@/schemas/note-schema";


export default function AddNoteForm() {
  const [selectedReferences, setSelectedReferences] = useState<string[]>([]);
  const [referencesInputValue, setReferencesInputValue] = useState("");
  const [filteredBooks, setFilteredBooks] = useState(bookNames);

  const form = useForm<z.infer<typeof noteSchema>>({
    resolver: zodResolver(noteSchema),
  });

  useEffect(() => {
    form.setValue("references", selectedReferences.join(", "));
  }, [selectedReferences, form]);

  // Filtrer les livres en fonction de la saisie
  useEffect(() => {
    if (referencesInputValue) {
      const parts = referencesInputValue.split(" ");
      if (parts.length === 1) {
        setFilteredBooks(
          bookNames.filter((book) =>
            book.toLowerCase().includes(parts[0].toLowerCase())
          )
        );
      } else {
        setFilteredBooks(bookNames);
      }
    } else {
      setFilteredBooks(bookNames);
    }
  }, [referencesInputValue]);

  // Valider et ajouter une référence
  const addReference = () => {
    if (!referencesInputValue.trim()) return;

    // Extraire le livre et le reste de la référence
    const parts = referencesInputValue.trim().split(" ");
    if (parts.length < 2) {
      toast({
        title: "Format invalide",
        description: "Veuillez entrer un livre et un chapitre (ex: Jean 3).",
        variant: "error",
      });
      return;
    }

    // Vérifier si le livre existe
    let bookName = "";
    let restOfReference = "";

    // Trouver le livre le plus long qui correspond
    for (let i = 1; i < parts.length; i++) {
      const potentialBook = parts.slice(0, i).join(" ");
      const potentialRest = parts.slice(i).join(" ");

      if (bookNames.includes(potentialBook)) {
        bookName = potentialBook;
        restOfReference = potentialRest;
      }
    }

    if (!bookName) {
      toast({
        title: "Livre invalide",
        description: "Le livre biblique n'est pas reconnu.",
        variant: "error",
      });
      return;
    }

    // Valider le format du chapitre et des versets
    const chapterVerseRegex =
      /^(\d+)(?::(\d+)(?:-(\d+))?)?$|^(\d+)\s+(\d+)(?:-(\d+))?$/;
    const match = restOfReference.match(chapterVerseRegex);

    if (!match) {
      toast({
        title: "Format invalide",
        description:
          "Format accepté: livre chapitre, livre chapitre:verset, ou livre chapitre verset-versetFin",
        variant: "error",
      });
      return;
    }

    // Formater la référence
    const reference = `${bookName} ${restOfReference}`;

    // Ajouter si elle n'existe pas déjà
    if (!selectedReferences.includes(reference)) {
      setSelectedReferences((prev) => [...prev, reference]);
      setReferencesInputValue("");
    }
  };

  // Supprimer une référence
  const removeReference = (reference: string) => {
    setSelectedReferences((prev) => prev.filter((ref) => ref !== reference));
  };

  // Ajouter un livre à l'entrée
  const addBookToInput = (book: string) => {
    setReferencesInputValue(book + " ");
  };

  const navigate = useNavigate();
  const addNoteMutation = useMutation({
    mutationFn: async (data: {
      content?: string | null;
      contentHTML?: string | null;
      contentJSON?: JSONContent | null;
      youtubeUrl?: string | null;
      references?: string | null;
      topic: string;
      preacher: string;
      date: string;
  }) => {
      const response = await axios.post(`${apiBaseUrl}/notes`, data, {
        withCredentials: true,
      });
      return response.data;
    },
    onSuccess: (data) => {
      navigate(`/notes/${data.id}`);
      toast({
        title: "Note created successfuly",
        variant: "success",
      });
    },
    onError: (error: AxiosError, variables) => {
      toast({
        title: "Error while initializing note",
        variant: "error",
        action: (
          <ToastAction
            altText="Try again"
            onClick={() => addNoteMutation.mutate(variables!)}
          >
            Try again
          </ToastAction>
        ),
      });
      console.log("Error updating note", error);
    },
  });

  

  const [open, setOpen] = useState(false);
  const [passage, setPassage] = useState("");

  const handleReferencesClick = (passage: string) => {
    setOpen(true);
    setPassage(passage);
  };

  const [contentHtml, setContentHtml] = useState<string | null>(null);
  const [contentJSON, setContentJson] = useState<JSONContent | null>(null);

  const handleEditorChange = (editor: Editor) => {
    const contentJSON = editor.getJSON();
    const contentHtml = editor.getHTML();
    setContentHtml(contentHtml);
    const contentText = editor.getText();
    setContentJson(contentJSON);
    form.setValue("content", contentText);
  };

  

  const youtubeUrl = form.watch("youtubeUrl");
  const content = form.watch("content")




  function onSubmit(values:  {
    content?: string | null;
    contentHTML?: string | null;
    contentJSON?: JSONContent | null;
    youtubeUrl?: string | null;
    references?: string | null;
    topic: string;
    preacher: string;
    date: string;
}) {
    const contentText = values.content?.trim();
    const finalContent = contentText ? contentText : null;
    const finalContentHtml = contentText ? contentHtml : null;
    const finalContentJson = contentText ? contentJSON : null;
  
    const finalValues = {
      ...values,
      content: finalContent,
      contentHTML: finalContentHtml,
      contentJSON: finalContentJson,
      youtubeUrl: values.youtubeUrl?.trim() || null,
      references: values.references?.trim() || null,
    };
  
    addNoteMutation.mutate(finalValues);
  }
  
  return ( 
    <>
      <Card className="w-full bg-gray-100 pt-4 rounded-none shadow-none border-none">
  <CardContent>
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {/* Champ : Sujet */}
        <FormField
          control={form.control}
          name="topic"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  placeholder="Enter topic"
                  {...field}
                  className="bg-gray-200 p-3 border-none shadow-none focus:outline-none 
                  font-semibold
                 md:text-xl md:font-bold"
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
              <FormControl>
                <Input
                  placeholder="Enter preacher's name"
                  {...field}
                  required
                  className="bg-gray-200 p-3 border-none shadow-none focus:outline-none"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Champ : Date */}
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col w-full">
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button className="w-full bg-gray-200 text-left p-3 border-none 
                    hover:bg-gray-200
                    shadow-none focus:outline-none  text-black">
                      <CalendarIcon className="mr-2 h-4 w-4 text-black" />
                      {field.value ? format(new Date(field.value), "PPP") : "Click to enter Sermon Date"}
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value ? new Date(field.value) : undefined}
                    onSelect={(date) => field.onChange(format(new Date(date!), "yyyy-MM-dd"))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Champ : YouTube URL */}
        <FormField
          control={form.control}
          name="youtubeUrl"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  placeholder="Enter YouTube URL"
                  {...field}
                  className="bg-gray-200 p-3 border-none shadow-none focus:outline-none"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {youtubeUrl && <YouTubeEmbed youtubeUrl={youtubeUrl} />}

        {/* Champ : Contenu */}
        <FormField
          control={form.control}
          name="content"
          render={() => (
            <FormItem>
              <FormControl>
                <RichTextEditorInput
                  onUpdate={handleEditorChange}
                  content={content}
                />
              </FormControl>
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
              <FormControl>
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2 m-0">
                    {selectedReferences.map((reference, index) => (
                      <Badge key={index} variant="secondary" className="px-3 py-1 cursor-pointer bg-primary text-white underline" onClick={()=> handleReferencesClick(reference)}>
                        {reference}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0 ml-1"
                          onClick={(e) => { e.stopPropagation(); removeReference(reference); }}
                        >
                          <X className="h-3 w-3" />
                          <span className="sr-only">Remove</span>
                        </Button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex">
                    <Command className="rounded-none border-none shadow-none w-full bg-gray-200">
                      <CommandInput
                        placeholder="Enter biblical references (e.g., John 3:16, Luke 1:13)"
                        value={referencesInputValue}
                        onValueChange={setReferencesInputValue}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addReference();
                          }
                        }}
                        className="bg-gray-200 rounded-none border-none shadow-none focus:outline-none "
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
                    <Button type="button" onClick={addReference} className="ml-2 text-white">
                      Add passage
                    </Button>
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Bouton de soumission */}
        <Button type="submit" className="w-full p-3 rounded-md" disabled={addNoteMutation.isPending}>
          {addNoteMutation.isPending ? "Creating..." : "Create"}
        </Button>
      </form>
    </Form>
  </CardContent>
</Card>


      <BibleDialog open={open} passage={passage} setOpen={setOpen} />
    </>
  );
}
