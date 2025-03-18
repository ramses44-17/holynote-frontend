import AddNoteForm from "@/components/add-note-form";
import { ArrowLeft, Pen } from "lucide-react";
import { Link, useNavigate } from "react-router";


export default function AddNotePage() {


const navigate = useNavigate()
  const handleBack = () => {
      navigate("/notes")
   }
  

  return (
    <div className="flex flex-col min-h-screen items-center p-10 gap-1">
      <button
        className="flex items-center font-bold ml-4 mt-4 text-gray-600 hover:text-blue-500 transition-all duration-200 ease-in-out self-start"
        onClick={handleBack}
      >
        <ArrowLeft className="h-5 w-5 mr-2" />
        Back
      </button>
      <Link to="/notes" className="flex items-center mb-3">
        <Pen className="-rotate-90" />
        <h1 className="text-xl font-semibold underline">
          Holy<span className="bg-red-500 text-white px-1 rounded-r-sm">Notes</span>
        </h1>
      </Link>
    <AddNoteForm/>
    </div>
  );
}
