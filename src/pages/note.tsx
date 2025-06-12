import {  useNavigate, useParams } from "react-router";
import { ArrowLeft } from "lucide-react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import ViewMode from "@/components/view-mode";
import EditMode from "@/components/edit-mode-form";
import Error from "@/components/error";
import NotFound from "@/components/not-found";
import Loader from "@/components/loader";
import { useNoteStore } from "@/stores/note-store";
import api from "@/lib/api";

const fetchNoteDetails = async (
  noteId?: string
) => {
  if (!noteId) return null;
  const response = await api.get(`/notes/${noteId}`);
  return response.data;
};

export default function Note() {
  const {mode,setMode} = useNoteStore()

  const noteId = useParams().noteId;
  const navigate = useNavigate();
  const {
    data: note,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["note", noteId],
    queryFn: () => fetchNoteDetails(noteId),
    refetchOnWindowFocus:false
  });

  if (isLoading) return <Loader />;

  if (isError) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        return <NotFound />;
      }
    }
    return <Error />;
  }

  const handleBack = () => {
    if (mode === "edit") {
      setMode("view");
    } else {
      navigate("/notes");
    }
  };

  if (!note) return <NotFound />;
  return (
    <div>
      <button
        className="flex items-center font-bold ml-4 mt-4 text-gray-600 hover:text-blue-500 transition-all duration-200 ease-in-out"
        onClick={handleBack}
      >
        <ArrowLeft className="h-5 w-5 mr-2" />
        Back
      </button>
      <div className="md:px-24 px-4 py-4">
        <div>
          {mode === "view" && (
            <ViewMode
              content={note?.contentHTML}
              date={note?.date}
              preacher={note?.preacher}
              references={note?.biblicalReferences}
              topic={note?.topic}
              youtubeUrl={note?.youtubeUrl}
            />
          )}
        </div>

        {mode === "edit" && (
          <EditMode
            contentHTML={note?.contentHTML}
            date={note?.date}
            preacher={note?.preacher}
            references={note?.biblicalReferences}
            topic={note?.topic}
            youtubeUrl={note?.youtubeUrl}
            noteId={noteId}
            contentJSON={note?.contentJSON}
            contentText={note?.contentText}
          />
        )}
      </div>
    </div>
  );
}
