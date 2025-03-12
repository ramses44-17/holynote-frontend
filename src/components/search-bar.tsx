import { Search, X } from "lucide-react"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { Mode } from "./header"
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs"



interface SearchBarProps {
  setMode:Dispatch<SetStateAction<Mode>>
  searchTerm:string
  setSearchTerm:Dispatch<SetStateAction<string>>
  filterBy:string
  setFilterBy:Dispatch<SetStateAction<string>>
}

export default function SearchBar({ setMode, searchTerm, setSearchTerm, filterBy, setFilterBy }:SearchBarProps) {
  const [activeTab, setActiveTab] = useState(filterBy)

  // Update the filter when tab changes
  useEffect(() => {
    setFilterBy(activeTab)
  }, [activeTab, setFilterBy])

  return (
    <header className="border-b bg-white text-black">
      <div className="p-4 flex items-center gap-3">
        <Button
          variant="outline"
          className="shadow-none border-none cursor-pointer"
          size="icon"
          onClick={() => setMode("view")}
        >
          <X className="h-6 w-6" />
        </Button>
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search notes..."
            className="pl-10"
            autoFocus
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue={filterBy} value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="px-4 border-t">
          <TabsList className="w-full justify-start h-12 bg-transparent p-0 gap-4">
            <TabsTrigger
              value="all"
              className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 rounded-none h-full px-2"
            >
              All Notes
            </TabsTrigger>
            <TabsTrigger
              value="last-week"
              className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 rounded-none h-full px-2"
            >
              Last week
            </TabsTrigger>
            <TabsTrigger
              value="last-months"
              className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 rounded-none h-full px-2"
            >
              Last  months
            </TabsTrigger>
          </TabsList>
        </div>
      </Tabs>
    </header>
  )
}