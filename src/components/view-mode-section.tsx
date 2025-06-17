import { format } from "date-fns";
import { enUS } from "date-fns/locale";
import { Button } from "./ui/button";
import { Edit, BookOpen, ChevronRight } from "lucide-react";
import { YouTubeEmbed } from "@/components/youtube-embeb";
import { useNoteStore } from "@/stores/note-store";
import { Badge } from "./ui/badge";
import { useState } from "react";
import BibleDialog from "./bible-dialog";
import { cn } from "@/lib/utils";
import Color from "@tiptap/extension-color";
import TextAlign from "@tiptap/extension-text-align";
import TextStyle from "@tiptap/extension-text-style";
import { EditorContent, mergeAttributes, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Heading from "@tiptap/extension-heading";
import Underline from "@tiptap/extension-underline";
import Highlight from "@tiptap/extension-highlight";

interface ViewModeProps {
  date?: string;
  topic?: string;
  preacher?: string;
  youtubeUrl?: string;
  content?: string;
  references?: string[];
}

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
        1: "text-2xl",
        2: "text-xl",
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
export default function ViewModeSection({
  date,
  topic,
  youtubeUrl,
  content,
  references,
  preacher,
}: ViewModeProps) {
  const { setMode } = useNoteStore();
  const [open, setOpen] = useState(false);
  const [passage, setPassage] = useState("");

  const handleReferencesClick = (passage: string) => {
    setOpen(true);
    setPassage(passage);
  };

  const editor = useEditor({
    extensions,
    content: content,
    editable: false,
    editorProps: {
      attributes: {
        class:
          "prose prose-gray dark:prose-invert max-w-none bg-gray-50 px-2 py-2 border-black w-full",
      },
    },
  });

  return (
    <div className="max-w-4xl mx-auto [&_*]:max-w-full [&_pre]:overflow-x-auto [&_code]:break-words">
      <div className="flex justify-between items-start mb-8">
        <div className="flex-grow">
          <p className="text-sm font-medium text-primary/70 dark:text-primary/80 tracking-wide">
            {date
              ? format(date, "PPPP", { locale: enUS })
              : "Date non spécifiée"}
          </p>
          <h1 className="md:text-3xl lg:text-4xl text-2xl font-bold mt-2 text-gray-900 dark:text-gray-50 leading-tight">
            {topic}
          </h1>
          <div className="flex items-center mt-3 text-sm text-gray-600 dark:text-gray-400">
            <span className="font-medium">Preacher:</span>
            <span className="ml-2 font-semibold text-gray-800 dark:text-gray-300">
              {preacher}
            </span>
          </div>
        </div>
        <Button
          variant="outline"
          size="icon"
          className="text-gray-500 hover:text-primary transition-colors duration-200"
          onClick={() => setMode("edit")}
        >
          <Edit className="h-4 w-4" />
          <span className="sr-only">Modifier</span>
        </Button>
      </div>

      {youtubeUrl && (
        <div className="rounded-xl overflow-hidden shadow-lg mb-10 transition-transform duration-300 hover:scale-[1.01]">
          <YouTubeEmbed youtubeUrl={youtubeUrl} />
        </div>
      )}

      <div className="my-10 w-full">
        {content ? (
          <EditorContent editor={editor} />
        ) : (
          <div className="py-12 text-center bg-gray-50 dark:bg-gray-800/30 rounded-lg border border-dashed border-gray-200 dark:border-gray-700">
            <p className="text-gray-500 dark:text-gray-400 italic">
              Aucune note disponible pour le moment.
            </p>
          </div>
        )}
      </div>

      {references && references.length > 0 && (
        <div className="mt-8 mb-4 p-5">
          <div className="flex items-center gap-2 mb-4 text-gray-700 dark:text-gray-300">
            <BookOpen className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Références Bibliques</h3>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {references.map((reference, index) => (
              <Badge
                key={index}
                variant="secondary"
                className={cn(
                  "px-3 py-1.5 cursor-pointer hover:bg-primary/10 transition-colors duration-200",
                  "flex items-center gap-1 text-sm underline"
                )}
                onClick={() => handleReferencesClick(reference)}
              >
                {reference}
                <ChevronRight className="h-3 w-3 ml-0.5 opacity-70" />
              </Badge>
            ))}
          </div>
        </div>
      )}
      <BibleDialog open={open} passage={passage} setOpen={setOpen} />
    </div>
  );
}
