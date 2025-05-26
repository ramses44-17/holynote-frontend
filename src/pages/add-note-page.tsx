import AddNoteForm from "@/components/add-note-form";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import {  useNavigate } from "react-router";


export default function AddNotePage() {


const navigate = useNavigate()
  const handleBack = () => {
      navigate("/notes")
   }
  

  return (
    <div className="bg-gray-100 min-h-screen">
      <Button
        onClick={handleBack}
        variant="ghost"
      >
        <ArrowLeft className="h-5 w-5 mr-2" />
        Back
      </Button>
    <AddNoteForm/>
    </div>
  );
}
