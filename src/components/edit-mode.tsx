import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Popover, PopoverTrigger,PopoverContent } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@radix-ui/react-select"
import { Button } from "@/components/ui/button"
import { CalendarIcon, Save} from "lucide-react"
import { Dispatch, SetStateAction, useEffect } from "react";
import { format } from "date-fns";
import { YouTubeEmbed } from "./youtube-embeb";
import axios, { AxiosError } from "axios";
import { QueryObserverResult, RefetchOptions, useMutation } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { ToastAction } from "./ui/toast";



interface EditModeProps {
  date?:string;
  topic?:string;
  preacher?:string
  setMode:Dispatch<SetStateAction<"view" | "edit">>;
  youtubeId?:string;
  content?:string;
  references?:string[]
  color?:string;
  noteId?:string
  refetch:(options?: RefetchOptions) => Promise<QueryObserverResult<any, Error>>

}



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


const extractYoutubeId = (url?: string | null): string | null => {
  if (!url) return null
  const match = url.match(youtubeUrlRegex)
  return match ? match[1] : null
}

export default function EditMode({date,topic,setMode,youtubeId,content,references,preacher,color,noteId,refetch}:EditModeProps) {


  const form = useForm<z.infer<typeof noteSchema>>({
    resolver: zodResolver(noteSchema),
    defaultValues: {
      topic:  "",
      preacher:"",
      content: "",
      color:"red",
      date: "",
      references: "",
      youtubeUrl:undefined
    },
  });

  const updateNoteMutation = useMutation({
    mutationFn: async (data: z.infer<typeof noteSchema>) => {
      const response = await axios.patch(
        `https://localhost:3000/api/notes/${noteId}`,
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

  const youtubeUrl = form.watch("youtubeUrl")
  const currentYoutubeId = youtubeUrl ? extractYoutubeId(youtubeUrl) : youtubeId


  useEffect(() => {
      form.reset({
        topic: topic || "",
        preacher: preacher || "",
        content: content || "",
        color: color || "red",
        date: date || "",
        references: references?.join(", ") || "",
      });
  }, [topic,preacher,content,color,date,references,form]);

  function onSubmit(values: z.infer<typeof noteSchema>) {
    updateNoteMutation.mutate(values)
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
                    <div className="mt-2 mb-4">
                      <YouTubeEmbed videoId={currentYoutubeId} />
                    </div>
                  )}

                  <FormField
                    control={form.control}
                    name="youtubeUrl"
                    render={({ field }) => (
                      <FormItem>
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
                  render={({ field }) => (
                    <FormItem>
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
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Biblical references</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter biblical references (ex: John 3:16, Luke 1:13)" {...field} />
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
          </>
  )
}
