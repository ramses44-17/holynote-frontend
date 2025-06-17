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
    .optional().refine((val) => !val || BiblicreferencesRegex.test(val), {
    message: "Invalid references format",
  }),
  youtubeUrl: z
    .string()
    .optional()
    .refine((val) => !val || youtubeUrlRegex.test(val), {
    message: "Invalid Youtube url format",
  }),
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