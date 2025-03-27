import { BiblicreferencesRegex, youtubeUrlRegex } from "@/lib/utils";
import { z } from "zod";



const noteSchema = z.object({
  topic: z
    .string({
      message: "topic is required",
    })
    .min(1, "topic is required")
    .max(60, "topic must be no longer than 60 characters"),
  content: z.string().optional(),
  references: z
    .string()
    .regex(BiblicreferencesRegex, {
      message: "Invalid references format",
    })
    .or(z.string().max(0, "References cannot be empty"))
    .optional(),
  youtubeUrl: z
    .string()
    .url("invalid youtube url")
    .regex(youtubeUrlRegex, "invalid youtube url")
    .optional(),
  preacher: z
    .string({
      message: "preacher name is required",
    })
    .min(1, "preacher is required")
    .max(60, "The preacher's name must not exceed 60 characters."),
  date: z
    .string({
      message: "Date is required",
    })
    .date(),
});



export default noteSchema