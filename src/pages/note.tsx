import { useState } from "react"
import { useNavigate, useParams } from "react-router"
import {    ArrowLeft } from "lucide-react"
import axios from "axios"
import {  useQuery } from "@tanstack/react-query"
import ViewMode from "@/components/view-mode"
import EditMode from "@/components/edit-mode"




const fetchNoteDetails = async (noteId?:string) => {
  const response = await axios.get(`https://localhost:3000/api/notes/${noteId}`,{
    withCredentials:true
  }); 
  return response.data;
}

export default function Note() {


  const [mode, setMode] = useState<"view" | "edit">("view")
 
  const noteId = useParams().noteId
  const navigate = useNavigate()
  const { data: note, isLoading, isError,refetch } =  useQuery({
    queryKey: ["note",noteId], 
    queryFn: () =>  fetchNoteDetails(noteId)
  });
  

  if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error loading notes</div>;

  



  const handleBack = () => {
    if(mode === "edit"){
      setMode('view')
    }
    else{
      navigate(-1)
    }
   }


   return (
    <div className="flex flex-col min-h-screen">
      <button
        className="flex items-center font-bold ml-4 mt-4 text-gray-600 hover:text-blue-500 transition-all duration-200 ease-in-out"
        onClick={handleBack}
      >
        <ArrowLeft className="h-5 w-5 mr-2" />
        Back
      </button>
      <div className="flex flex-1 px-4 flex-col py-4 max-w-4xl mx-auto w-full">
        <div className="bg-white p-6 mb-6">
          {
          mode === "view" && (
            <ViewMode
            setMode={setMode}
            content={note?.content}
            date={note?.date}
            preacher={note?.preacher}
            references={note?.references}
            topic={note?.topic}
            youtubeId={note?.youtubeId}
             />
          )

          }
        </div>

        {mode === "edit" && (
          <EditMode
          setMode={setMode}
          content={note?.content}
          date={note?.date}
          preacher={note?.preacher}
          references={note?.references}
          topic={note?.topic}
          youtubeId={note?.youtubeId}
          color={note?.color}
          noteId={noteId}
          refetch={refetch}
          />
        )}
      </div>
    </div>
  )
}
