import { Routes, Route, BrowserRouter as Router } from "react-router";
import Login from "./pages/login";
import Register from "./pages/register";
import NotesPage from "./pages/notes";
import LandingPage from "./pages/landing-page";
import Note from "./pages/note";
import { AuthProvider } from "./contexts/providers/authprovider";
import Protected from "./pages/protected";
import MainLayout from "./layouts/main-layout";

function App() {

  //enlever auth provider et remplacer par zustand...
  return (
    <AuthProvider>
      <Router>
        <Routes>
        <Route path="/" element={<MainLayout/>}>
      <Route index element={<LandingPage/>}/>
    </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
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
          <Route path="*" element={<p>Not found</p>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
