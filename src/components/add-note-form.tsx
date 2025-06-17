import { format } from "date-fns";
import { AxiosError } from "axios";
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

import { CalendarIcon, Save, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import BibleDialog from "./bible-dialog";
import RichTextEditorInput from "@/components/rich-text-editor-input";
import { Editor, JSONContent } from "@tiptap/react";
import noteSchema from "@/schemas/note-schema";
import api from "@/lib/api";
import { NoteMutation } from "@/types/types";

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
    mutationFn: async (data: NoteMutation) => {
      const response = await api.post(`/notes`, data);
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
  const content = form.watch("content");

  function onSubmit(values:NoteMutation) {
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
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col w-full">
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
                        {field.value ? (
                          format(new Date(field.value), "PPP")
                        ) : (
                          <span>Choose a date</span>
                        )}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={(date) =>
                        field.onChange(date ? format(date, "yyyy-MM-dd") : "")
                      }
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
                <FormControl>
                  <Input
                    placeholder="Enter topic"
                    {...field}
                    className="md:text-3xl lg:text-4xl  text-2xl font-bold text-balance"
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
                  <Input placeholder="Enter preacher's name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* YouTube Video Preview */}
          <div className="mb-4">
            {youtubeUrl && (
              <div className="flex">
                <YouTubeEmbed youtubeUrl={youtubeUrl} />
              </div>
            )}

            <FormField
              control={form.control}
              name="youtubeUrl"
              render={({ field }) => (
                <FormItem className="relative">
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
          </div>

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
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedReferences.map((reference, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="px-3 py-1 cursor-pointer underline"
                          onClick={() => handleReferencesClick(reference)}
                        >
                          {reference}
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-4 w-4 p-0 ml-1"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeReference(reference);
                            }}
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
                          }}
                        />
                        <CommandList className="max-h-40">
                          <CommandGroup heading="Suggestions">
                            {filteredBooks.slice(0, 5).map((book, index) => (
                              <CommandItem
                                key={index}
                                onSelect={() => addBookToInput(book)}
                                className="cursor-pointer"
                              >
                                {book}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                      <Button
                        type="button"
                        onClick={addReference}
                        className="ml-2"
                      >
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
          <Button type="submit" disabled={addNoteMutation.isPending}>
            <Save className="h-4 w-4 mr-2" />
            {addNoteMutation.isPending ? "saving..." : "save"}
          </Button>
        </form>
      </Form>

      <BibleDialog open={open} passage={passage} setOpen={setOpen} />
    </>
  );
}
