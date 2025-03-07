import { Input } from "@/components/ui/input";
import { SearchIcon, X } from "lucide-react";
import { Dispatch, SetStateAction, useId } from "react";
import { Mode } from "./header";



interface HeaderProps {
  setMode:Dispatch<SetStateAction<Mode>>
}
export default function SearchBar({setMode}:HeaderProps) {
  const id = useId();
  return (
    <div className="*:not-first:mt-2 bg-white">
      <div className="relative">
        <Input id={id} className="peer ps-9 pe-9 py-8 rounded-none" placeholder="Search..." type="search"/>
        <div className="text-muted-foreground/80 pointer-events-none rounded-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
          <SearchIcon size={16} />
        </div>
        <button
          className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Submit search"
          type="submit"
        >
          <X size={16} aria-hidden="true" onClick={() =>  setMode("view") }/>
        </button>
      </div>
    </div>
  );
}
