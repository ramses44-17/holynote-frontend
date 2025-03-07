import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";



// Schéma Zod pour la note
const youtubeUrlRegex = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
const noteSchema = z.object({
  topic: z.string({
    message:"topic is required"
  }).min(1, "topic is required").max(60, "topic must be no longer than 60 characters"),
  content: z.string().optional(), // Peut être une chaîne vide
  color: z.string().max(10).default("red"),
  references: z.string().regex(/^([a-zA-Z]+\s\d{1,3}(:\d{1,3}(-\d{1,3})?)?,?\s?)+$/,{
    message:"invalid references format"
  }).optional(),
  youtubeUrl: z.string().url("invalid youtube url").regex(youtubeUrlRegex, "invalid youtube url").optional(),
  preacher: z.string({
    message:"preacher name is required"
  }).min(1, "preacher is required").max(60, "The preacher's name must not exceed 60 characters."),
  date: z
  .string({
    required_error: "Date is required",
  })
  .refine(
    (val) => {
      return !isNaN(Date.parse(val))
    },
    {
      message: "Invalid date format, please provide date in YYYY-MM-DD",
    },
  )
})

const colorOptions = [
  { value: "red", label: "Rouge", color: "#ef4444" },
  { value: "blue", label: "Bleu", color: "#3b82f6" },
  { value: "violet", label: "Violet", color: "#8b5cf6" },
  { value: "amber", label: "Ambre", color: "#f59e0b" },
  { value: "orange", label: "Orange", color: "#f97316" },
];

export default function AddNote() {
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

  function onSubmit(values: z.infer<typeof noteSchema>) {
    console.log(values);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Note
        </Button>
      </DialogTrigger>
      <DialogContent>
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
                    onSelect={(date) => field.onChange(date?.toISOString())}
                    disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
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
                    <Input
                      placeholder="Enter YouTube URL"
                      {...field}
                    />
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
                      placeholder="Enter biblic references (ex: Jean 3:16, Luc 1:13)"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Bouton de soumission */}
            <Button type="submit" className="w-full">
              Initialize
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}