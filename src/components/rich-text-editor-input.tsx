import { useEditor, EditorContent, Editor, mergeAttributes, JSONContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import Highlight from "@tiptap/extension-highlight";
import { Color } from "@tiptap/extension-color";
import TextStyle from "@tiptap/extension-text-style";
import EditorMenuBar from "./editor-menu-bar";
import Heading from "@tiptap/extension-heading"

// Définition des extensions TipTap
const extensions = [
  StarterKit.configure({
    orderedList: {
      HTMLAttributes: { class: "list-decimal ml-3" },
    },
    bulletList: {
      HTMLAttributes: { class: "list-disc ml-3" },
    },
  }),
  Heading.extend({
    levels: [1, 2],
    renderHTML({ node, HTMLAttributes }) {
      const level = this.options.levels.includes(node.attrs.level)
        ? node.attrs.level
        : this.options.levels[0];
      const classes: { [index: number]: string } = {
        1: 'text-2xl',
        2: 'text-xl',
      };
      return [
        `h${level}`,
        mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
          class: `${classes[level]}`,
        }),
        0,
      ];
    },
  }).configure({ levels: [1, 2] }),
  TextAlign.configure({ types: ["heading", "paragraph", "orderedList"] }),
  Underline,
  TextStyle,
  Highlight.configure({ multicolor: true }),
  Color,
];



export default function RichTextEditorInput({ content, onUpdate }: { content?: string | null | JSONContent; onUpdate: (editor: Editor) => void }) {
  const editor = useEditor({
    extensions,
    content: content,
    editorProps: {
      attributes: {
        class: "px-3 py-2 border rounded-md min-h-[300px] bg-black p-3 rounded-md border-none shadow-none text-white",
      },
    },
    onUpdate: ({ editor }) => onUpdate(editor) 
  });

 


  return (
        <>
          <EditorMenuBar editor={editor} />
          <EditorContent editor={editor} placeholder="Enter sermon note text"/>
        </>
  )
}

