import { useState } from "react"
import Header, { Mode } from "@/components/header"
import NoteCard from "@/components/note-card"
import { Link, Navigate } from "react-router"
import axios from "axios"
import { useQuery } from "@tanstack/react-query"
import Error from "@/components/error"
import Loader from "@/components/loader"
import NewNoteCard from "@/components/new-note-button"
import { apiBaseUrl } from "@/lib/utils"



const fetchNotes = async () => {
  const response = await axios.get(`${apiBaseUrl}/notes`,{
    withCredentials:true
  }); 
  return response.data.notes;
}







export default function NotesPage() {


const [mode,setMode] = useState<Mode>('view')
const [searchTerm,setSearchTerm] = useState<string>("")
const [filterBy,setFilterBy] = useState<string>("all")
const { data: notes, isLoading, isError,error,refetch } = useQuery({
  queryKey: ["notes"], 
  queryFn:fetchNotes
});


//faire un bon loader
if (isLoading) return <Loader/>;
if (isError) {
  if (axios.isAxiosError(error)) {
    if (error.response?.status === 401) {
      return <Navigate to="/auth" />;
    }
  }
  return <Error/>;
}

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
              notes?.length > 0 ?(
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  <NewNoteCard 
                      />
                  {notes.map((note) => (
                    <Link
                      to={`/notes/${note.id}`}
                      key={note.id}
                      className="block h-full transition-opacity hover:opacity-95"
                    >
                      <NoteCard
                      refetch={refetch}
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
                  <NewNoteCard />
                  </div>
              )
            }
            </>
          ):
          (
            <div>
              this is search mode
            </div>
          )
        }
      </div>
    </div>
  )
}

