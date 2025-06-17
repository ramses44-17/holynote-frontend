// components/YouTubeInputField.tsx
import { FormControl, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { YouTubeEmbed } from "@/components/youtube-embeb";
import noteSchema from "@/schemas/note-schema";
import { ControllerRenderProps } from "react-hook-form";
import { z } from "zod";

interface YouTubeInputFieldProps {
  field: ControllerRenderProps< z.infer<typeof noteSchema>,"youtubeUrl">; 
  youtubeUrl?: string | null;
}

export function YouTubeInputField({ field, youtubeUrl }: YouTubeInputFieldProps) {
  return (
    <div className="mb-4">
      {youtubeUrl && (
        <div className="flex">
          <YouTubeEmbed youtubeUrl={youtubeUrl} />
        </div>
      )}
      <FormItem className="relative">
        <FormControl>
          <Input
            placeholder="Enter YouTube URL (e.g., https://www.youtube.com/watch?v=dQw4w9WgXcQ)"
            {...field}
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    </div>
  );
}
