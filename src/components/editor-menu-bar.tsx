import { Editor } from "@tiptap/react";
import { AlignCenter, AlignLeft, AlignRight, Bold, Heading1, Heading2, Heading3, Highlighter, Italic, List, ListOrdered, Palette, Redo, Strikethrough, Underline, Undo } from "lucide-react";
import { Toggle } from "./ui/toggle";
import EditorMenuPopover from "./editor-menu-popover";




export default function EditorMenuBar({editor}:{editor:Editor | null}) {






  if(!editor) return null



  const highlightColors = [
    {
      color: "#ffc078",  // Orange
      label: "Orange",
      onClick: () => editor.chain().focus().toggleHighlight({ color: '#ffc078' }).run(),
      pressed: editor.isActive("highlight", { color: "#ffc078" })
    },
    {
      color: "#74c0fc",  // Blue
      label: "Blue",
      onClick: () => editor.chain().focus().toggleHighlight({ color: '#74c0fc' }).run(),
      pressed: editor.isActive("highlight", { color: "#74c0fc" })
    },
    {
      color: "#b197fc",  // Purple
      label: "Purple",
      onClick: () => editor.chain().focus().toggleHighlight({ color: '#b197fc' }).run(),
      pressed: editor.isActive("highlight", { color: "#b197fc" })
    },
    {
      color: "red",  // Red
      label: "Red",
      onClick: () => editor.chain().focus().toggleHighlight({ color: 'red' }).run(),
      pressed: editor.isActive("highlight", { color: "red" })
    },
    {
      color: "#ff7b7b",  // Light Red
      label: "Light Red",
      onClick: () => editor.chain().focus().toggleHighlight({ color: '#ff7b7b' }).run(),
      pressed: editor.isActive("highlight", { color: "#ff7b7b" })
    },
    {
      color: "#28a745",  // Green
      label: "Green",
      onClick: () => editor.chain().focus().toggleHighlight({ color: '#28a745' }).run(),
      pressed: editor.isActive("highlight", { color: "#28a745" })
    },
    {
      color: "#17a2b8",  // Cyan
      label: "Cyan",
      onClick: () => editor.chain().focus().toggleHighlight({ color: '#17a2b8' }).run(),
      pressed: editor.isActive("highlight", { color: "#17a2b8" })
    },
    {
      color: "#f39c12",  // Yellow
      label: "Yellow",
      onClick: () => editor.chain().focus().toggleHighlight({ color: '#f39c12' }).run(),
      pressed: editor.isActive("highlight", { color: "#f39c12" })
    },
    {
      color: "#8e44ad",  // Violet
      label: "Violet",
      onClick: () => editor.chain().focus().toggleHighlight({ color: '#8e44ad' }).run(),
      pressed: editor.isActive("highlight", { color: "#8e44ad" })
    },
    {
      color: "#34495e",  // Dark Blue
      label: "Dark Blue",
      onClick: () => editor.chain().focus().toggleHighlight({ color: '#34495e' }).run(),
      pressed: editor.isActive("highlight", { color: "#34495e" })
    },
  ]

  const textColors =  [
    {
      color: "#ff0000",  // Red
      label: "Red",
      onClick: () => editor.chain().focus().setColor('#ff0000').run(),
      pressed: editor.isActive("textStyle", { color: "#ff0000" }),
    },
    {
      color: "#ff7f00",  // Orange
      label: "Orange",
      onClick: () => editor.chain().focus().setColor('#ff7f00').run(),
      pressed: editor.isActive("textStyle", { color: "#ff7f00" }),
    },
    {
      color: "#ffff00",  // Yellow
      label: "Yellow",
      onClick: () => editor.chain().focus().setColor('#ffff00').run(),
      pressed: editor.isActive("textStyle", { color: "#ffff00" }),
    },
    {
      color: "#00ff00",  // Green
      label: "Green",
      onClick: () => editor.chain().focus().setColor('#00ff00').run(),
      pressed: editor.isActive("textStyle", { color: "#00ff00" }),
    },
    {
      color: "#0000ff",  // Blue
      label: "Blue",
      onClick: () => editor.chain().focus().setColor('#0000ff').run(),
      pressed: editor.isActive("textStyle", { color: "#0000ff" }),
    },
    {
      color: "#4b0082",  // Indigo
      label: "Indigo",
      onClick: () => editor.chain().focus().setColor('#4b0082').run(),
      pressed: editor.isActive("textStyle", { color: "#4b0082" }),
    },
    {
      color: "#8a2be2",  // Violet
      label: "Violet",
      onClick: () => editor.chain().focus().setColor('#8a2be2').run(),
      pressed: editor.isActive("textStyle", { color: "#8a2be2" }),
    },
    {
      color: "#a52a2a",  // Brown
      label: "Brown",
      onClick: () => editor.chain().focus().setColor('#a52a2a').run(),
      pressed: editor.isActive("textStyle", { color: "#a52a2a" }),
    },
    {
      color: "#800000",  // Maroon
      label: "Maroon",
      onClick: () => editor.chain().focus().setColor('#800000').run(),
      pressed: editor.isActive("textStyle", { color: "#800000" }),
    },
    {
      color: "#808000",  // Olive
      label: "Olive",
      onClick: () => editor.chain().focus().setColor('#808000').run(),
      pressed: editor.isActive("textStyle", { color: "#808000" }),
    },
    {
      color: "#008080",  // Teal
      label: "Teal",
      onClick: () => editor.chain().focus().setColor('#008080').run(),
      pressed: editor.isActive("textStyle", { color: "#008080" }),
    },
    {
      color: "#f0e68c",  // Khaki
      label: "Khaki",
      onClick: () => editor.chain().focus().setColor('#f0e68c').run(),
      pressed: editor.isActive("textStyle", { color: "#f0e68c" }),
    },
    {
      color: "#d3d3d3",  // Light Grey
      label: "Light Grey",
      onClick: () => editor.chain().focus().setColor('#d3d3d3').run(),
      pressed: editor.isActive("textStyle", { color: "#d3d3d3" }),
    },
    {
      color: "#dcdcdc",  // Gainsboro
      label: "Gainsboro",
      onClick: () => editor.chain().focus().setColor('#dcdcdc').run(),
      pressed: editor.isActive("textStyle", { color: "#dcdcdc" }),
    },
    {
      color: "#2f4f4f",  // Dark Slate Gray
      label: "Dark Slate Gray",
      onClick: () => editor.chain().focus().setColor('#2f4f4f').run(),
      pressed: editor.isActive("textStyle", { color: "#2f4f4f" }),
    },
    {
      color: "#a9a9a9",  // Dark Gray
      label: "Dark Gray",
      onClick: () => editor.chain().focus().setColor('#a9a9a9').run(),
      pressed: editor.isActive("textStyle", { color: "#a9a9a9" }),
    },
    {
      color: "#000080",  // Navy
      label: "Navy",
      onClick: () => editor.chain().focus().setColor('#000080').run(),
      pressed: editor.isActive("textStyle", { color: "#000080" }),
    },
    {
      color: "#ffd700",  // Gold
      label: "Gold",
      onClick: () => editor.chain().focus().setColor('#ffd700').run(),
      pressed: editor.isActive("textStyle", { color: "#ffd700" }),
    },
    {
      color: "#ff1493",  // Deep Pink
      label: "Deep Pink",
      onClick: () => editor.chain().focus().setColor('#ff1493').run(),
      pressed: editor.isActive("textStyle", { color: "#ff1493" }),
    },
    {
      color: "#00ffff",  // Cyan
      label: "Cyan",
      onClick: () => editor.chain().focus().setColor('#00ffff').run(),
      pressed: editor.isActive("textStyle", { color: "#00ffff" }),
    },
    {
      color: "#34495e",  // Dark Blue
      label: "Dark Blue",
      onClick: () => editor.chain().focus().setColor('#34495e').run(),
      pressed: editor.isActive("textStyle", { color: "#34495e" }),
    }
  ]

  const options = [
    {
      icon: <Heading1 className="size-4"/>,
      onClick:() => editor.chain().focus().toggleHeading({level:1}).run(),
      pressed:editor.isActive("heading",{level:1}),
      popover:false,
    },
    {
      icon: <Heading2 className="size-4"/>,
      onClick:() => editor.chain().focus().toggleHeading({level:2}).run(),
      pressed:editor.isActive("heading",{level:2}),
      popover:false,
    },
    {
      icon: <Heading3 className="size-4"/>,
      onClick:() => editor.chain().focus().toggleHeading({level:3}).run(),
      pressed:editor.isActive("heading",{level:3}),
      popover:false,
    },
    {
      icon: <Bold className="size-4"/>,
      onClick:() => editor.chain().focus().toggleBold().run(),
      pressed:editor.isActive("bold"),
      popover:false,
    },
    {
      icon: <Italic className="size-4"/>,
      onClick:() => editor.chain().focus().toggleItalic().run(),
      pressed:editor.isActive("italic"),
      popover:false,
    },
    {
      icon: <Strikethrough className="size-4"/>,
      onClick:() => editor.chain().focus().toggleStrike().run(),
      pressed:editor.isActive("strike"),
      popover:false,
    },
    {
      icon: <AlignLeft className="size-4"/>,
      onClick:() => editor.chain().focus().setTextAlign("left").run(),
      pressed:editor.isActive("left",{TextAlign:"left"}),
      popover:false,
    },
    {
      icon: <AlignCenter className="size-4"/>,
      onClick:() => editor.chain().focus().setTextAlign("center").run(),
      pressed:editor.isActive("center",{TextAlign:"center"}),
      popover:false,
    },
    {
      icon: <AlignRight className="size-4"/>,
      onClick:() => editor.chain().focus().setTextAlign("right").run(),
      pressed:editor.isActive("right",{TextAlign:"right"}),
      popover:false,
    },
    {
      icon: <Underline className="size-4"/>,
      onClick:() => editor.chain().focus().setUnderline().run(),
      pressed:editor.isActive("underline"),
      popover:false,
    },
    {
      icon: <ListOrdered className="size-4"/>,
      onClick:() => editor.chain().focus().toggleOrderedList().run(),
      pressed:editor.isActive("orderedList"),
      popover:false,
    },
    {
      icon: <List className="size-4"/>,
      onClick:() => editor.chain().focus().toggleBulletList().run(),
      pressed:editor.isActive("bulletList"),
      popover:false,
    },
    {
      icon: <Highlighter className="size-4" />,
      popover: true,
      elements: highlightColors
    },{
      icon: <Palette className="size-4"/>,
      popover:true,
      elements : textColors
    },
    {
      icon: <Undo className="size-4"/>,
      onClick:() => editor.chain().focus().undo().run(),
      pressed:editor.can().undo(),
      popover:false,
    }, 
    {
      icon: <Redo className="size-4"/>,
      onClick:() => editor.chain().focus().redo().run(),
      pressed:editor.can().redo(),
      popover:false,
    },  
  ]
  
  return (
    <div className="border rounded-md p-1 flex justify-center flex-wrap bg-gray-200 z-50">
      {
        options.map((option,index) => {
          return option.popover ? <div key={index} className="inline">
            <EditorMenuPopover elements={option.elements}  icon={option.icon}/>
          </div> : <Toggle key={index} pressed={option.pressed} onClick={option.onClick}>
          {option.icon}
        </Toggle>
        })
      }
    </div>
  )
}
