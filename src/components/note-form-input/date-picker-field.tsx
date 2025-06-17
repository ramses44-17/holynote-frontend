import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { FormControl, FormItem, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { ControllerRenderProps } from "react-hook-form";
import noteSchema from "@/schemas/note-schema";
import { z } from "zod";

interface DatePickerFieldProps {
  field: ControllerRenderProps< z.infer<typeof noteSchema>,"date">; // react-hook-form field
}

export function DatePickerField({ field }: DatePickerFieldProps) {
  return (
    <FormItem className="flex flex-col w-full">
      <Popover>
        <PopoverTrigger asChild>
          <FormControl>
            <Button
              variant="outline"
              className={`w-[240px] justify-start text-left font-normal ${!field.value && "text-muted-foreground"}`}
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
  );
}
