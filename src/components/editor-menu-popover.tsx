import { JSX } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { Toggle } from './ui/toggle'


interface EditorMenuPopoverProps{
  icon:JSX.Element
  elements?:{
    color:string,
    label:string,
    onClick:()=>boolean,
  pressed?:boolean
  }[],
}
export default function EditorMenuPopover({elements,icon}:EditorMenuPopoverProps) {
  return (
    <Popover>
      <PopoverTrigger className='p-2'>{icon}</PopoverTrigger>
      <PopoverContent className='space-x-4 w-80'>
        {
          elements?.map((element) => (
            <Toggle
  key={element.label}
  className={`w-6 h-6 rounded-full p-2 border-2 transition-all duration-200 ease-in-out 
    ${element.pressed ? "border-black scale-110" : "border-transparent hover:border-gray-300"}`}
  style={{
    background: element.color
  }}
  onClick={element.onClick}
  pressed={element.pressed}
>
 
</Toggle>

          ))
        }
      </PopoverContent>
    </Popover>
  )
}
