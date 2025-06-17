// components/NoteFormWrapper.tsx
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { toast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { useNoteStore } from "@/stores/note-store";
import BibleDialog from "./bible-dialog";
import api from "@/lib/api";
import { JSONContent } from "@tiptap/react";
import { NoteMutation } from "@/types/types";
import NoteMutationForm from "./note-mutation-form";

interface NoteFormMutationWrapperProps {
  mode: "add" | "edit";
  noteId?: string;
  initialData?: {
    date?: string;
    topic?: string;
    preacher?: string;
    youtubeUrl?: string | null;
    references?: string[];
    contentHTML?: string | null;
    contentJSON?: JSONContent | null;
    contentText?: string | null;
  };
}

export default function NoteFormWrapper({ mode, noteId, initialData }: NoteFormMutationWrapperProps) {
  const [selectedReferences, setSelectedReferences] = useState<string[]>(initialData?.references || []);
  const [passage, setPassage] = useState("");
  const [open, setOpen] = useState(false);
  const [contentText, setContentText] = useState(initialData?.contentText);
  const [contentJSON, setContentJSON] = useState<JSONContent | null | undefined>(initialData?.contentJSON);
  

  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { setMode } = useNoteStore();


  const mutation = useMutation({
    mutationFn: async (data: NoteMutation) => {
      return mode === "add"
        ? (await api.post("/notes", data)).data
        : (await api.patch(`/notes/${noteId}`, data)).data;
    },
    onSuccess: (data) => {
      if (mode === "edit") {
        queryClient.setQueryData(["note", noteId], data);
        queryClient.invalidateQueries({ queryKey: ["note", noteId] });
        setMode("view");
      } else {
        navigate(`/notes/${data.id}`);
      }
      toast({ title: `Note ${mode === "add" ? "created" : "updated"} successfully`, variant: "success" });
    },
    onError: (error, variables) => {
      toast({
        title: `Error while ${mode === "add" ? "creating" : "updating"} note`,
        variant: "error",
        action: (
          <ToastAction altText="Try again" onClick={() => mutation.mutate(variables)}>
            Try again
          </ToastAction>
        ),
      });
    },
  });

  const handleEditorChange = (text: string, json: JSONContent) => {
    setContentText(text);
    setContentJSON(json);
  };



  const onSubmit = (values: NoteMutation) => {
    console.log(values);
        
    const contentStr = contentText?.trim();
    
    const payload = {
      ...values,
      content: contentStr ? contentStr : null,
      contentHTML: contentStr ? values.contentHTML : null,
      contentJSON: contentStr ? contentJSON : null,
      youtubeUrl: values.youtubeUrl?.trim() || null,
      references: values.references?.trim() || null,
    };
    mutation.mutate(payload);
  };
   const handleReferencesClick = (passage: string) => {
    setOpen(true);
    setPassage(passage);
  };
const defaultValues = {
      topic: initialData?.topic || undefined,
      preacher: initialData?.preacher || undefined,
      content: initialData?.contentHTML || undefined,
      date: initialData?.date || undefined,
      references: initialData?.references?.join(",") || undefined,
      youtubeUrl: initialData?.youtubeUrl || undefined,
    }
  return (
    <>
      <NoteMutationForm
        defaultValues={defaultValues}
        onSubmit={onSubmit}
        isSubmitting={mutation.isPending}
        contentState={{
          onContentChange: handleEditorChange,
          content: initialData?.contentHTML,
        }}
        referencesState={{
          selectedReferences,
          onReferencesChange:setSelectedReferences,
          handleReferenceClick:handleReferencesClick
        }}
      />
      <BibleDialog open={open} passage={passage} setOpen={setOpen} />
    </>
  );
}
