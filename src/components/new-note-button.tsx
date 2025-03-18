import { Plus } from "lucide-react";
import { Link } from "react-router";

export default function NewNoteCard() {
  return (
    <Link to="/new" className="relative flex flex-col h-full rounded-xl overflow-hidden border border-dashed border-primary/50 bg-card/50 shadow-sm transition-all duration-300 hover:shadow-md hover:translate-y-[-2px] hover:border-primary group cursor-pointer">
      <div className="flex flex-col h-full p-5 justify-center items-center">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors duration-300">
          <Plus className="h-6 w-6 text-primary" />
        </div>
        <h3 className="text-lg font-semibold text-primary">New note</h3>
        <p className="text-sm text-muted-foreground mt-1 text-center">Create a new sermon note</p>
      </div>
      <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </Link>
  )
}