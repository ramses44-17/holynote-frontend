import noteSchema from "@/schemas/note-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { JSONContent } from "@tiptap/react";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { z } from "zod";
import { FormField } from "./ui/form";
import { BiblicalReferenceInput } from "./note-form-input/biblical-reference-input";
import { NoteMutation } from "@/types/types";
import { RichTextEditorWithStore } from "./note-form-input/rich-text-editor-with-store-input";
import { YouTubeInputField } from "./note-form-input/youtube-input-field";
import { TextInputField } from "./note-form-input/text-input-field";
import { DatePickerField } from "./note-form-input/date-picker-field";
import { useEffect } from "react";


interface NoteMutationFormProps {
  defaultValues?: Partial<z.infer<typeof noteSchema>>;
  onSubmit: (values: NoteMutation) => void;
  isSubmitting?: boolean;
  contentState: {
    onContentChange: (text: string, json: JSONContent) => void;
    content?: string | null;
  };
  referencesState: {
    selectedReferences: string[];
    onReferencesChange: (refs: string[]) => void;
    handleReferenceClick:(refs:string) =>void
  };
}

const NoteMutationForm = ({
  defaultValues,
  onSubmit,
  isSubmitting,
  contentState,
  referencesState,
}: NoteMutationFormProps) => {
  const form = useForm<z.infer<typeof noteSchema>>({
    resolver: zodResolver(noteSchema),
    defaultValues,
  });

    useEffect(() => {
    form.setValue("references", referencesState.selectedReferences.join(", "));
  }, [referencesState.selectedReferences, form]);

  const youtubeUrl = form.watch("youtubeUrl");

  const handleEditorContentChange = (text: string, json: JSONContent,html?:string )=>{
    contentState.onContentChange(text,json)
    form.setValue('content',html)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, (errors) => {
    console.log("Validation failed:", errors); // 👈 utile pour debug
  })} className="space-y-4">
        {/* Date */}
        <FormField name="date" control={form.control} render={({ field }) => (
          <DatePickerField field={field} />
        )} />

        {/* Sujet */}
        <FormField name="topic" control={form.control} render={({ field }) => (
          <TextInputField field={field} placeholder="Enter topic" className="md:text-3xl lg:text-4xl  text-2xl" />
        )} />

        {/* Prédicateur */}
        <FormField name="preacher" control={form.control} render={({ field }) => (
          <TextInputField field={field} placeholder="Enter preacher's name"  />
        )} />

        {/* YouTube */}
        <FormField name="youtubeUrl" control={form.control} render={({ field }) => (
          <YouTubeInputField field={field} youtubeUrl={youtubeUrl} />
          
        )} />

        {/* Contenu */}
        <FormField name="content" control={form.control} render={() => (
          <RichTextEditorWithStore onUpdate={handleEditorContentChange} content={contentState.content} />
        )} />

        {/* Références */}
        <FormField name="references" control={form.control} render={() => (
          <BiblicalReferenceInput
            selectedReferences={referencesState.selectedReferences}
            onChangeReferences={referencesState.onReferencesChange}
            handleReferenceClick={referencesState.handleReferenceClick}
          />
        )} />

        <Button type="submit" disabled={isSubmitting}>
          <Save className="h-4 w-4 mr-2" />
          {isSubmitting ? "saving..." : "save"}
        </Button>
      </form>
    </Form>
  );
};

export default NoteMutationForm