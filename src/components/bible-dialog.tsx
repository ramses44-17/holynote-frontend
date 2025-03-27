import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Dispatch, SetStateAction } from "react";
import {getPassageId} from "@/lib/utils"
import { ScrollArea } from "./ui/scroll-area";

interface BibleDialogProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  passage: string;
}



const BIBLE_API_KEY = import.meta.env.VITE_BIBLE_API_KEY;

const fetchPassage = async (passageId: string | null) => {
  if (!passageId) return null;

  try {
    const response = await axios.get(
      `https://api.scripture.api.bible/v1/bibles/a93a92589195411f-01/passages/${passageId}`,
      {
        headers: {
          "api-key": BIBLE_API_KEY,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching passage:", error);
    throw error;
  }
};

// 🔥 Fonction pour formater le texte avec les numéros de versets mis en avant
const formatBibleText = (content: string) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(content, "text/html");

  return Array.from(doc.querySelectorAll("p")).map((p, index) => {
    // Trouver tous les numéros de verset
    const verseNumbers = Array.from(p.querySelectorAll(".v"));

    // Mettre en évidence chaque numéro de verset
    verseNumbers.forEach((span) => {
      span.outerHTML = `<span class="font-bold text-red-500 text-xl min-w-[30px] inline-block">${span.innerHTML}</span>`;
    });

    return (
      <p key={index} className="flex flex-wrap gap-2 items-start text-lg">
        <span dangerouslySetInnerHTML={{ __html: p.innerHTML }} />
      </p>
    );
  });
};


export default function BibleDialog({ open, setOpen, passage }: BibleDialogProps) {
  const passageId = getPassageId(passage);

  const { error, isLoading, isError, data } = useQuery({
    queryKey: ["passage", passageId],
    queryFn: () => fetchPassage(passageId),
    enabled: !!passageId,
    staleTime: 1000 * 60 * 5,
    retry:false
  });
  

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="p-6 max-w-lg">
        <DialogTitle className="text-xl font-semibold text-center">📖 Passage Biblique</DialogTitle>

        {isLoading && <div className="text-center text-gray-500">Chargement du passage...</div>}

        {isError && !isLoading && (
          <div className="text-center text-red-500">
            {axios.isAxiosError(error) ? (
              error.response?.status === 404 ? (
                <p>📌 Passage introuvable. Veuillez vérifier votre entrée.</p>
              ) : (
                <p>🚨 Erreur lors de la récupération du passage. Veuillez réessayer plus tard.</p>
              )
            ) : (
              <p>❌ Une erreur est survenue. Veuillez réessayer.</p>
            )}
          </div>
        )}

        {!isLoading && !isError && passageId && data && (
          <div className="mt-4 p-4 bg-gray-100 rounded-lg">
            <p className="text-center text-gray-700 text-sm">
              <strong>{passage}</strong>
            </p>
            <ScrollArea className="h-[300px] mt-2">
              <div className="pr-4">{formatBibleText(data?.data.content || "Contenu indisponible")}</div>
            </ScrollArea>
            <p className="text-center text-gray-700 text-sm mt-2">
              📜 Version : <strong>"Bible J.N. Darby"</strong>
            </p>
          </div>
        )}

        {!passageId && !isLoading && !isError && (
          <div className="text-center text-red-500">⚠️ Passage invalide. Veuillez vérifier votre entrée.</div>
        )}
      </DialogContent>
    </Dialog>
  );
}
