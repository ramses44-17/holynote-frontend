import { Routes, Route, BrowserRouter as Router } from "react-router";
import Login from "./pages/login";
import Register from "./pages/register";
import NotesPage from "./pages/notes";
import LandingPage from "./pages/landing-page";
import Note from "./pages/note";
import Protected from "./pages/protected";
import MainLayout from "./layouts/main-layout";
import AuthLayout from "./layouts/auth-layout";
import NotFound from "./components/not-found";
import AddNotePage from "./pages/add-note-page";
import Settings from "./pages/settings";

function App() {
  return (
      <Router>
        <Routes>
          {/**main layout */}
        <Route path="/" element={<MainLayout/>}>
      <Route index element={<LandingPage/>}/>
    </Route>

 {/**auth layout */}
    <Route path="/auth" element={<AuthLayout/>}>
    <Route index  element={<Login />} />
    <Route path="/auth/register" element={<Register />} />
    </Route>

     {/**protected */}
          <Route
            path="notes"
            element={
              <Protected>
                <NotesPage />
              </Protected>
            }
          />
          <Route
            path="/notes/:noteId"
            element={
              <Protected>
                <Note />
              </Protected>
            }
          />
          <Route
            path="/new"
            element={
              <Protected>
                <AddNotePage />
              </Protected>
            }
          />
          <Route
            path="/settings"
            element={
              <Protected>
                <Settings />
              </Protected>
            }
          />
           {/**Not found page */}
          <Route path="*" element={<NotFound/>} />
        </Routes>
      </Router>
  
  );
}

export default App;

