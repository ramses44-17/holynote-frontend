import AddNoteForm from "@/components/add-note-form";
import { ArrowLeft } from "lucide-react";
import {  useNavigate } from "react-router";


export default function AddNotePage() {


const navigate = useNavigate()
  const handleBack = () => {
      navigate("/notes")
   }
  

  return (
    <div className="bg-gray-100 min-h-screen border">
      <button
        className="flex items-center font-bold ml-4 mt-4 text-gray-600 hover:text-blue-500 transition-all duration-200 ease-in-out self-start"
        onClick={handleBack}
      >
        <ArrowLeft className="h-5 w-5 mr-2" />
        Back
      </button>
    <AddNoteForm/>
    </div>
  );
}
