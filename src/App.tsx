import { Routes, Route, BrowserRouter as Router } from "react-router";
import Login from "./pages/login";
import Register from "./pages/register";
import NotesPage from "./pages/notes";
import LandingPage from "./pages/landing-page";
import Note from "./pages/note";
import { AuthProvider } from "./contexts/providers/authprovider";
import Protected from "./pages/protected";
import MainLayout from "./layouts/main-layout";
import AuthLayout from "./layouts/auth-layout";
import NotFound from "./components/not-found";

function App() {

  //enlever auth provider et remplacer par zustand...
  return (
      <Router>
         <AuthProvider>
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
           {/**Not found page */}
          <Route path="*" element={<NotFound/>} />
        </Routes>
        </AuthProvider>
      </Router>
  
  );
}

export default App;
