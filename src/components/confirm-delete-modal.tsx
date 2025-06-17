import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from "@/hooks/use-toast"
import api from "@/lib/api"
import { Trash2 } from "lucide-react"
import { useState } from "react"

export default function ConfimDeleteModal({id,refetch}:{id:string,refetch:() =>void}) {


  const [isDeleting,setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    await api.delete(`/notes/${id}`).then(async() => {
      refetch()
      toast({
        description:"Note deleted successfuly",
        variant:"success"
      })
    }).catch((e) => {
      console.log(e); 
      toast({
        description:"an Error occured while deleting note",
        variant:"error"
      })
    }).finally(() => { 
      setIsDeleting(false)
     })
  }
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
      <div className="flex gap-2 w-full">
      <Trash2 className="mr-2 h-4 w-4" />
      <span>Delete</span>
      </div>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to delete this note ?</AlertDialogTitle>
          <AlertDialogDescription>
          this action is irreversible.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction className="bg-red-500" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? "Deleting...":"Delete"}
            </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
