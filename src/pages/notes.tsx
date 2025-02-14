import { useState } from "react"
import Header from "@/components/header"
import NoteCard from "@/components/note-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search } from "lucide-react"
import { Link } from "react-router"
import AddNote from "@/components/add-note"

interface Note {
  id: number
  topic: string
  preacherName: string
  date: Date
  color: "red" | "blue" | "violet" | "amber" | "orange"
  content: string
  references: string[]
}

const mockNotes: Note[] = [
  {
    id: 1,
    topic: "The Power of Faith",
    preacherName: "Pastor John Doe",
    date: new Date("2023-06-15"),
    color: "blue",
    content:
      "Faith is the substance of things hoped for, the evidence of things not seen. It is through faith that we understand that the universe was formed at God's command, so that what is seen was not made out of what was visible.",
    references: ["Hebrews 11:1", "Hebrews 11:3"],
  },
  {
    id: 2,
    topic: "Love Your Neighbor",
    preacherName: "Pastor Jane Smith",
    date: new Date("2023-06-22"),
    color: "red",
    content:
      'Jesus said, "Love your neighbor as yourself." This commandment is the second greatest, only after loving God with all your heart, soul, and mind. It encompasses how we should treat others with kindness, compassion, and respect.',
    references: ["Matthew 22:39", "Mark 12:31"],
  },
  {
    id: 3,
    topic: "The Grace of God",
    preacherName: "Pastor Michael Brown",
    date: new Date("2023-06-29"),
    color: "amber",
    content: "",
    references: ["Ephesians 2:8-9", "Romans 3:24"],
  },
  {
    id: 4,
    topic: "The Importance of Prayer",
    preacherName: "Pastor Sarah Johnson",
    date: new Date("2023-07-06"),
    color: "violet",
    content:
      "Prayer is our direct line of communication with God. It is through prayer that we express our gratitude, seek guidance, and intercede for others. A consistent prayer life strengthens our relationship with God.",
    references: [],
  },
  {
    id: 5,
    topic: "Walking in Obedience",
    preacherName: "Pastor David Wilson",
    date: new Date("2023-07-13"),
    color: "orange",
    content:
      "Obedience to God's Word is a sign of our love for Him. When we walk in obedience, we align ourselves with His will and experience His blessings in our lives.",
    references: ["John 14:15", "Deuteronomy 28:1-2"],
  },
  {
    id: 6,
    topic: "The Fruit of the Spirit",
    preacherName: "Pastor Emily Davis",
    date: new Date("2023-07-20"),
    color: "blue",
    content: "",
    references: ["Galatians 5:22-23"],
  },
  {
    id: 7,
    topic: "Trusting God in Difficult Times",
    preacherName: "Pastor Mark Taylor",
    date: new Date("2023-07-27"),
    color: "red",
    content:
      "In times of trouble, we must lean on God's promises and trust that He is working all things for our good. His plans for us are always perfect, even when we cannot see the bigger picture.",
    references: ["Romans 8:28", "Proverbs 3:5-6"],
  },
  {
    id: 8,
    topic: "The Hope of Eternal Life",
    preacherName: "Pastor Laura Adams",
    date: new Date("2023-08-03"),
    color: "amber",
    content: "",
    references: [],
  },
  {
    id: 9,
    topic: "Living a Life of Gratitude",
    preacherName: "Pastor Daniel Lee",
    date: new Date("2023-08-10"),
    color: "red",
    content:
      "Gratitude shifts our focus from what we lack to the abundance of blessings we have received. A grateful heart is a joyful heart, and it honors God in every circumstance.",
    references: ["1 Thessalonians 5:18", "Psalm 107:1"],
  },
  {
    id: 10,
    topic: "The Power of Forgiveness",
    preacherName: "Pastor Rachel Green",
    date: new Date("2023-08-17"),
    color: "red",
    content: "",
    references: ["Matthew 6:14-15", "Colossians 3:13"],
  },
]

export default function NotesPage() {
  const [notes, setNotes] = useState(mockNotes)
  const [searchTerm, setSearchTerm] = useState("")

  const handleDelete = (id: number) => {
    event?.stopPropagation()
    setNotes(notes.filter((note) => note.id !== id))
  }

  const filteredNotes = notes.filter(
    (note) =>
      note.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.preacherName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Your Notes</h1>
          <div className="flex gap-4">
            <div className="relative flex-1 sm:flex-initial">
              <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-500" />
              <Input
                type="text"
                placeholder="Search notes..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <AddNote/>
          </div>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredNotes.map((note) => (
           <Link to={`/notes/${note.id}`}> <NoteCard
           key={note.id}
           id={note.id}
           topic={note.topic}
           preacherName={note.preacherName}
           date={note.date}
           color={note.color}
           content={note.content}
           references={note.references}
           onDelete={handleDelete}
         /></Link>
          ))}
        </div>
        {filteredNotes.length === 0 && (
          <p className="mt-8 text-center text-gray-500 dark:text-gray-400">
            No notes found. Try adjusting your search or add a new note.
          </p>
        )}
      </main>
    </div>
  )
}

