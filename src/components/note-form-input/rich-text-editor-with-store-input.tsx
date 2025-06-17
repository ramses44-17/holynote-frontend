// components/RichTextEditorWithStore.tsx
import { Editor, JSONContent } from "@tiptap/react";
import { useState } from "react";
import RichTextEditorInput from "@/components/rich-text-editor-input";

interface RichTextEditorWithStoreProps {
  onUpdate: (text: string,json: JSONContent,html?:string) => void;
  content?: string | null;
}

export function RichTextEditorWithStore({ onUpdate, content }: RichTextEditorWithStoreProps) {

  const handleEditorChange = (editor: Editor) => {
    const contentText = editor.getText();
    const contentHtml = editor.getHTML();
    const contentJson = editor.getJSON();
    onUpdate(contentText,contentJson,contentHtml);
  };

  return <RichTextEditorInput onUpdate={handleEditorChange} content={content} />;
}
