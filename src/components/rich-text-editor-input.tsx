import { useEditor, EditorContent, Editor, mergeAttributes, JSONContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import Highlight from "@tiptap/extension-highlight";
import { Color } from "@tiptap/extension-color";
import TextStyle from "@tiptap/extension-text-style";
import EditorMenuBar from "./editor-menu-bar";
import Heading from "@tiptap/extension-heading"
import Placeholder from "@tiptap/extension-placeholder"

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
  Placeholder.configure({
        // Use a placeholder:
        placeholder: 'Write something …',
        showOnlyWhenEditable:true
        // Use different placeholders depending on the node type:
        // placeholder: ({ node }) => {
        //   if (node.type.name === 'heading') {
        //     return 'What’s the title?'
        //   }

        //   return 'Can you add some further context?'
        // },
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
        class: "py-2 rounded-none min-h-[300px] text-blue-500 p-3 border-none shadow-none text-white min-w-full bg-gray-200 ",
      },
    },
    onUpdate: ({ editor }) => onUpdate(editor) 
  });

 


  return (
        <div >
          <EditorMenuBar editor={editor} />
          <EditorContent editor={editor} />
        </div>
  )
}

