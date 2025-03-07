import { useState } from "react"
import Header, { Mode } from "@/components/header"
import NoteCard from "@/components/note-card"
import {  Plus } from "lucide-react"
import { Link } from "react-router"

const mockNotes = [
  {
    id: "1",
    topic: "The Power of Faith",
    preacher: "Pastor John Doe",
    date: new Date("2023-06-15"),
    color: "blue",
    content:
      "Faith is the substance of things hoped for, the evidence of things not seen. It is through faith that we understand that the universe was formed at God's command, so that what is seen was not made out of what was visible.",
    references: ["Hebrews 11:1", "Hebrews 11:3"],
  },
  {
    id: "2",
    topic: "Love Your Neighbor",
    preacher: "Pastor Jane Smith",
    date: new Date("2023-06-22"),
    color: "red",
    content:
      'Jesus said, "Love your neighbor as yourself." This commandment is the second greatest, only after loving God with all your heart, soul, and mind. It encompasses how we should treat others with kindness, compassion, and respect.',
    references: ["Matthew 22:39", "Mark 12:31"],
  },
  {
    id: "3",
    topic: "The Grace of God",
    preacher: "Pastor Michael Brown",
    date: new Date("2023-06-29"),
    color: "amber",
    content: "",
    references: ["Ephesians 2:8-9", "Romans 3:24"],
  },
  {
    id: 4,
    topic: "The Importance of Prayer",
    preacher: "Pastor Sarah Johnson",
    date: new Date("2023-07-06"),
    color: "violet",
    content:
      "Prayer is our direct line of communication with God. It is through prayer that we express our gratitude, seek guidance, and intercede for others. A consistent prayer life strengthens our relationship with God.",
    references: ["Matthew 6:14-15", "Colossians 3:13, Jean 3:16"],
  },
  {
    id: "5",
    topic: "Walking in Obedience",
    preacher: "Pastor David Wilson",
    date: new Date("2025-03-05"),
    color: "amber",
    content:
      "Obedience to God's Word is a sign of our love for Him. When we walk in obedience, we align ourselves with His will and experience His blessings in our lives.",
    references: ["John 14:15", "Deuteronomy 28:1-2"],
  },
  {
    id: "6",
    topic: "The Fruit of the Spirit",
    preacher: "Pastor Emily Davis",
    date: new Date("2023-07-20"),
    color: "none",
    content: "",
    references: ["Galatians 5:22-23"],
  },
  {
    id: "7",
    topic: "Trusting God in Difficult Times",
    preacher: "Pastor Mark Taylor",
    date: new Date("2023-07-27"),
    color: "red",
    content:
      "In times of trouble, we must lean on God's promises and trust that He is working all things for our good. His plans for us are always perfect, even when we cannot see the bigger picture.",
    references: ["Romans 8:28", "Proverbs 3:5-6"],
  },
  {
    id: "8",
    topic: "The Hope of Eternal Life",
    preacher: "Pastor Laura Adams",
    date: new Date("2023-08-03"),
    color: "none",
    content: "",
    references: ["Matthew 6:14-15", "Colossians 3:13"],
  },
  {
    id: "9",
    topic: "Living a Life of Gratitude",
    preacher: "Pastor Daniel Lee",
    date: new Date("2023-08-10"),
    color: "red",
    content:
      "Gratitude shifts our focus from what we lack to the abundance of blessings we have received. A grateful heart is a joyful heart, and it honors God in every circumstance.",
    references: ["1 Thessalonians 5:18", "Psalm 107:1"],
  },
  {
    id: "10",
    topic: "The Power of Forgiveness",
    preacher: "Pastor Rachel Green",
    date: new Date("2023-08-17"),
    color: "red",
    content: "",
    references: ["Matthew 6:14-15", "Colossians 3:13"],
  },
]



export default function NotesPage() {

const [mode,setMode] = useState<Mode>('view')

//en mode search la header devient une seachbar, la balise main affiche rien si aucun terme n'est entré il reste vide avec une indication sinon  il affiche les notes qui contiennent la search term

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Header mode={mode} setMode={setMode} />
      {
        mode === "view" ? (
          <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex justify-center items-center border rounded-lg p-10 bg-blue-400 cursor-pointer">
            <div className="border border-dashed p-4 border-blue-600 flex flex-col justify-center items-center cursor-pointer">
              <Plus />
              New note
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">My notes</h1>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {mockNotes.map((note) => (
           <Link to={`/notes/${note.id}`}      key={note.id}> <NoteCard
           id={note.id.toString()}
           topic={note.topic}
           preacher={note.preacher}
           date={note.date}
           color={note.color}
           content={note.content}
           references={note.references}
         /></Link>
          ))}
        </div>
      </main>
        ):(
          <div>

          </div>
        )
      }
    </div>
  )
}

