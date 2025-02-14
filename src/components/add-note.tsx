import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

// Fonction de validation pour une référence biblique
const validateReference = (ref: string) => {
  // Regex pour valider le format "nomdulivre chapitre:verset"
  const referenceRegex = /^[a-zA-Z]+\s\d+:\d+$/;
  return referenceRegex.test(ref.trim());
};

// Schéma Zod pour les références
const referencesSchema = z.string().refine(
  (value) => {
    // Sépare les références par des virgules
    const references = value.split(",");
    // Vérifie que chaque référence est valide
    return references.every((ref) => validateReference(ref));
  },
  {
    message: "Les références doivent être au format 'nomdulivre chapitre:verset', séparées par des virgules.",
  }
);

// Schéma Zod pour la note
const NoteSchema = z.object({
  topic: z.string().min(1, "Le sujet est requis"),
  preacherName: z.string().min(1, "Le nom du prédicateur est requis"),
  date: z.date({ required_error: "La date est requise" }),
  color: z.enum(["red", "blue", "violet", "amber", "orange"]),
  references: referencesSchema, // Utilise le schéma personnalisé pour les références
});

// Couleurs disponibles avec leurs codes hexadécimaux
const colorOptions = [
  { value: "red", label: "Rouge", color: "#ef4444" },
  { value: "blue", label: "Bleu", color: "#3b82f6" },
  { value: "violet", label: "Violet", color: "#8b5cf6" },
  { value: "amber", label: "Ambre", color: "#f59e0b" },
  { value: "orange", label: "Orange", color: "#f97316" },
];

export default function AddNote() {
  const form = useForm<z.infer<typeof NoteSchema>>({
    resolver: zodResolver(NoteSchema),
    defaultValues: {
      topic: "",
      preacherName: "",
      color: "red",
      date: new Date(),
      references: "",
    },
  });

  function onSubmit(values: z.infer<typeof NoteSchema>) {
    console.log(values);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Note
        </Button>
      </DialogTrigger>
      <DialogContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Champ : Sujet */}
            <FormField
              control={form.control}
              name="topic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Topic</FormLabel>
                  <FormControl>
                    <Input placeholder="Entrez le sujet" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Champ : Nom du prédicateur */}
            <FormField
              control={form.control}
              name="preacherName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preacher</FormLabel>
                  <FormControl>
                    <Input placeholder="Entrez le nom du prédicateur" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Champ : Date */}
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? format(field.value, "PPP") : <span>Choisissez une date</span>}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Champ : Couleur */}
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Couleur</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Choisissez une couleur" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {colorOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex items-center gap-2">
                            <div
                              className="h-4 w-4 rounded-full"
                              style={{ backgroundColor: option.color }}
                            />
                            <span>{option.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Champ : Références */}
            <FormField
              control={form.control}
              name="references"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Références Bibliques</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Entrez les références (ex: Jean 3:16, Luc 1:13)"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Bouton de soumission */}
            <Button type="submit" className="w-full">
              Initialize note
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}