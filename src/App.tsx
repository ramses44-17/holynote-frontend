import {Routes,Route, BrowserRouter as Router} from "react-router"
import Login from "./pages/login"
import Register from "./pages/register"
import NotesPage from "./pages/notes"
import LandingPage from "./pages/landing-page"
import Note from "./pages/note"
function App() {
  return <Router>
    <Routes>
    <Route path="/" element={<LandingPage />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="notes" element={<NotesPage />} />
    <Route path="/notes/:noteId" element={<Note />} />
  </Routes>
  </Router>
}

export default App
