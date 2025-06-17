// components/TextInputField.tsx
import { FormControl, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import noteSchema from "@/schemas/note-schema";
import { HTMLAttributes } from "react";
import { ControllerRenderProps } from "react-hook-form";
import { z } from "zod";


interface TextInputFieldProps extends HTMLAttributes<HTMLInputElement> {
   field: ControllerRenderProps< z.infer<typeof noteSchema>>;
  placeholder?: string;
  className?: string;
}

export function TextInputField({ field, placeholder, className, ...props }: TextInputFieldProps) {
  return (
    <FormItem>
      <FormControl>
        <Input
          placeholder={placeholder}
          {...field}
          className={className}
          {...props}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  );
}
