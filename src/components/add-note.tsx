import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Dispatch, SetStateAction, useState} from "react";
import axios, { AxiosError } from "axios";
import { useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { ToastAction } from "./ui/toast";
import {bookNames} from "@/lib/bible"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "./ui/command";



// Schéma Zod pour la note
const youtubeUrlRegex = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
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
  )
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


interface AddNoteModalProps {
  open:boolean
  setOpen:Dispatch<SetStateAction<boolean>>
}


export default function AddNoteModal({open,setOpen}:AddNoteModalProps) {
  const form = useForm<z.infer<typeof noteSchema>>({
    resolver: zodResolver(noteSchema),
    defaultValues: {
      topic: "",
      preacher: "",
      color: "red",
      date: "",
      references: "",
      youtubeUrl:undefined
    },
  });

const navigate = useNavigate()
  const addNoteMutation = useMutation({
    mutationFn: async (data: z.infer<typeof noteSchema>) => {
      const response = await axios.post(
        `https://localhost:3000/api/notes`,
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
  }


  const [referencesInputValue,setReferencesInputValue] = useState("")

  const handleReferencesInputChange =(value:string) => { 
    setReferencesInputValue(value)
   }

   const addBookToInput = (book: string) => {
    console.log(book);
    
    const updatedValue = referencesInputValue ? `${referencesInputValue}, ${book}` : book;
    setReferencesInputValue(updatedValue);
    form.setValue("references", updatedValue);
    console.log("must work");
    
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
      <DialogTitle aria-describedby="note">Initialize note</DialogTitle>
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
                    onSelect={(date) => field.onChange(format(new Date(date!), "yyyy-MM-dd"))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
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
                              style={{ backgroundColor: option.color }}
                            />
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
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Biblic references</FormLabel>
                  <FormControl>
                    <Command>
                    <CommandInput  placeholder="Enter biblic references (ex: Jean 3:16, Luc 1:13)"
                      {...field}
                      onValueChange={(value) => handleReferencesInputChange(value)}
                      value={referencesInputValue}
                      />
                      <CommandList className="h-22">
                        <CommandEmpty>No results found.</CommandEmpty>
                        <CommandGroup heading="Suggestions">
                          
                          
                          {
                            bookNames.map((book,index) => (
                              <CommandItem  key={index}><Button 
                              className="border-none shadow-none hover:bg-gray-100"
                              variant="outline"
                              onClick={() => addBookToInput(book)}>
                              {book}
                            </Button></CommandItem>
                            ))
                          }
                        </CommandGroup>
                      
                    </CommandList>
                    </Command>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="youtubeUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sermon youtube link</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter YouTube URL"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Bouton de soumission */}
            <Button type="submit" className="w-full" disabled={addNoteMutation.isPending}
            >
            {addNoteMutation.isPending ? "initializing..." :"initialize"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
