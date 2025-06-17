// components/ReferenceInput.tsx
import { useEffect, useState } from "react";
import { Command, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { bookNames } from "@/lib/bible";
import { toast } from "@/hooks/use-toast";
import { X } from "lucide-react";

interface BiblicalReferenceInputProps {
  selectedReferences: string[];
  onChangeReferences: (refs: string[]) => void;
  handleReferenceClick:(refs:string) =>void
}

export function BiblicalReferenceInput({ selectedReferences, onChangeReferences,handleReferenceClick }: BiblicalReferenceInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [filteredBooks, setFilteredBooks] = useState(bookNames);

  useEffect(() => {
    if (inputValue) {
      const parts = inputValue.split(" ");
      if (parts.length === 1) {
        setFilteredBooks(bookNames.filter((book) => book.toLowerCase().includes(parts[0].toLowerCase())));
      } else {
        setFilteredBooks(bookNames);
      }
    } else {
      setFilteredBooks(bookNames);
    }
  }, [inputValue]);

  const addReference = () => {
    if (!inputValue.trim()) return;
    const parts = inputValue.trim().split(" ");
    if (parts.length < 2) {
      return toast({ title: "Format invalide", description: "Veuillez entrer un livre et un chapitre (ex: Jean 3).", variant: "error" });
    }

    let bookName = "";
    let rest = "";
    for (let i = 1; i < parts.length; i++) {
      const potentialBook = parts.slice(0, i).join(" ");
      const potentialRest = parts.slice(i).join(" ");
      if (bookNames.includes(potentialBook)) {
        bookName = potentialBook;
        rest = potentialRest;
      }
    }

    if (!bookName) {
      return toast({ title: "Livre invalide", description: "Le livre biblique n'est pas reconnu.", variant: "error" });
    }

    const match = rest.match(/^\d+(?::\d+)?(?:-\d+)?$/);
    if (!match) {
      return toast({
        title: "Format invalide",
        description: "Format attendu: Jean 3:16 ou Jean 3:16-18",
        variant: "error",
      });
    }

    const newRef = `${bookName} ${rest}`;
    if (!selectedReferences.includes(newRef)) {
      onChangeReferences([...selectedReferences, newRef]);
      handleReferenceClick(newRef)
      setInputValue("");
    }
  };

  const removeReference = (ref: string) => {
    onChangeReferences(selectedReferences.filter((r) => r !== ref));
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2 mt-2">
        {selectedReferences.map((ref, idx) => (
          <Badge key={idx} variant="secondary" className="px-3 py-1 cursor-pointer underline" onClick={() => handleReferenceClick(ref)}>
            {ref}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-4 w-4 p-0 ml-1"
              onClick={(e) => {
                e.stopPropagation()
                removeReference(ref)
              }}
            >
              <X className="h-3 w-3" />
              <span className="sr-only">Supprimer</span>
            </Button>
          </Badge>
        ))}
      </div>

      <div className="flex">
        <Command className="rounded-lg border shadow-sm w-full">
          <CommandInput
            placeholder="Entrez des références (ex: Jean 3:16)"
            value={inputValue}
            onValueChange={setInputValue}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addReference();
              }
            }}
          />
          <CommandList className="max-h-40">
            <CommandGroup heading="Suggestions">
              {filteredBooks.slice(0, 5).map((book, idx) => (
                <CommandItem
                  key={idx}
                  onSelect={() => setInputValue(book + " ")}
                  className="cursor-pointer"
                >
                  {book}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
        <Button type="button" onClick={addReference} className="ml-2">
          Ajouter
        </Button>
      </div>
    </div>
  );
}
