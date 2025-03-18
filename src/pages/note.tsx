import { Navigate, useNavigate, useParams } from "react-router"
import {    ArrowLeft } from "lucide-react"
import axios from "axios"
import {  useQuery } from "@tanstack/react-query"
import ViewMode from "@/components/view-mode"
import EditMode from "@/components/edit-mode-form"
import { useUserStore } from "@/stores/app-store"
import Error from "@/components/error"
import NotFound from "@/components/not-found"
import Loader from "@/components/loader"
import { apiBaseUrl } from "@/lib/utils"




const fetchNoteDetails = async (noteId?:string) => {
  if(!noteId) return null
  const response = await axios.get(`${apiBaseUrl}/notes/${noteId}`,{
    withCredentials:true
  }); 
  return response.data;
}

export default function Note() {


  const { mode,setMode} = useUserStore()
 
  const noteId = useParams().noteId
  const navigate = useNavigate()
  const { data: note, isLoading, isError,refetch,error } =  useQuery({
    queryKey: ["note",noteId], 
    queryFn: () =>  fetchNoteDetails(noteId),
  });
  

  if (isLoading) return <Loader/>;
  if (isError) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        return <Navigate to="/auth" />;
      }
      if (error.response?.status === 404) {
        return <NotFound/>;
      }
    }
    return <Error/>;
  }


  



  const handleBack = () => {
    if(mode === "edit"){
      setMode('view')
    }
    else{
      navigate("/notes")
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
