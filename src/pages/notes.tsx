import { Dispatch, SetStateAction, useState } from "react"
import Header, { Mode } from "@/components/header"
import NoteCard from "@/components/note-card"
import {  Plus, SearchIcon } from "lucide-react"
import { Link } from "react-router"
import AddNoteModal from "@/components/add-note"
import axios from "axios"
import { useQuery } from "@tanstack/react-query"



const fetchNotes = async () => {
  const response = await axios.get("https://localhost:3000/api/notes",{
    withCredentials:true
  }); 
  return response.data.notes;
}


//regler les problemes de type
//améliorer le modal pour ajouter une note
// teste la route d'ajout des notes
// tester la route de suppression des notes



//refactorsiser le context pour utiliser zustand

function NewNoteCard({ setOpen}:{
  setOpen:Dispatch<SetStateAction<boolean>>
}) {
  return (
    <div className="relative flex flex-col h-full rounded-xl overflow-hidden border border-dashed border-primary/50 bg-card/50 shadow-sm transition-all duration-300 hover:shadow-md hover:translate-y-[-2px] hover:border-primary group cursor-pointer" onClick={() => setOpen(true)}>
      <div className="flex flex-col h-full p-5 justify-center items-center">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors duration-300">
          <Plus className="h-6 w-6 text-primary" />
        </div>
        <h3 className="text-lg font-semibold text-primary">New note</h3>
        <p className="text-sm text-muted-foreground mt-1 text-center">Create a new sermon note</p>
      </div>
      <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
  )
}


export default function NotesPage() {

const [isOpen,setIsOpen]  = useState(false)

const [mode,setMode] = useState<Mode>('view')
const [searchTerm,setSearchTerm] = useState<string>("")
const [filterBy,setFilterBy] = useState<string>("all")
const { data: notes, isLoading, isError } = useQuery({
  queryKey: ["notes"], 
  queryFn:fetchNotes
});

if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading notes</div>;
 const fileredNote = notes.filter((note) => {
  if(filterBy === "all" && searchTerm){
    return note.topic.toLowerCase().includes(searchTerm.toLowerCase()) || note.preacher.toLowerCase().includes(searchTerm.toLowerCase()) || note.content.toLowerCase().includes(searchTerm.toLowerCase()) || note.references.join(" ").toLowerCase().includes(searchTerm.toLowerCase())
  }
  if(filterBy === "last-week"){
    const lastWeek = new Date()
    lastWeek.setDate(lastWeek.getDate() - 7)
    return note.date >= lastWeek
  }
  if(filterBy === "last-months"){
    const last3Months = new Date()
    last3Months.setMonth(last3Months.getMonth() - 3)
    return note.date >= last3Months
  }
 })

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header filterBy={filterBy} searchTerm={searchTerm} setFilterBy={setFilterBy} setSearchTerm={setSearchTerm} mode={mode} setMode={setMode} />
      <div className="container mx-auto px-4 py-8 flex-grow">
        {
          mode === "view" ? (
            <>
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground">Sermon Notes</h1>
            </div>
            {
              notes.length > 0 ?(
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  <NewNoteCard setOpen={setIsOpen}
                      />
                  {notes.map((note) => (
                    <Link
                      to={`/notes/${note.id}`}
                      key={note.id}
                      className="block h-full transition-opacity hover:opacity-95"
                    >
                      <NoteCard
                        id={note.id.toString()}
                        topic={note.topic}
                        preacher={note.preacher}
                        date={note.date}
                        color={note.color}
                        content={note.content}
                        references={note.references}
                        youtubeId={note.youtubeId}
                      />
                    </Link>
                  ))}
                </div>
              ):(
                <div className="flex items-center justify-center py-16">
                  <NewNoteCard setOpen={setIsOpen}/>
                  </div>
              )
            }
            </>
          ):
          (
            <div>
              {
                !searchTerm && filterBy === "all" && (
                  <div className="flex flex-col items-center justify-center">
                    <div className="flex flex-col items-center gap-4">
                    <SearchIcon/>
                    <h1 className="text-3xl font-bold text-foreground">
                      Enter a search term to find notes
                    </h1>
                    </div>
                  </div>
                )
              }
              {
                (searchTerm && fileredNote.length > 0) || (!searchTerm && fileredNote.length > 0) && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {fileredNote.map((note) => (
                      <Link
                        to={`/notes/${note.id}`}
                        key={note.id}
                        className="block h-full transition-opacity hover:opacity-95"
                      >
                        <NoteCard
                          id={note.id.toString()}
                          topic={note.topic}
                          preacher={note.preacher}
                          date={note.date}
                          color={note.color}
                          content={note.content}
                          references={note.references}
                          youtubeId={note.youtubeId}
                        />
                      </Link>
                    ))}
                  </div>
                )
              }
              {
                searchTerm && (fileredNote.length === 0 && filterBy !== "all") && (
                  <div className="flex items-center justify-center py-16">
                    <h1 className="text-3xl font-bold text-foreground">
                      No notes found
                    </h1>
                  </div>
                )
              }
            </div>
          )
        }
      </div>
      <AddNoteModal setOpen={setIsOpen} open={isOpen}/>
    </div>
  )
}

