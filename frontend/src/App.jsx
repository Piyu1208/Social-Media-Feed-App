import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Signup from "./pages/Signup.jsx";
import VerifyEmail from "./pages/VerifyEmail.jsx";
import CompleteProfile from "./pages/CompleteProfile.jsx";
import Login from "./pages/Login.jsx";
import Home from "./pages/Home.jsx";
import Profile from "./pages/Profile.jsx";
import Post from "./pages/Post.jsx";
import { useAuth } from "./AuthContext.jsx";
import Notifications from "./pages/Notifications.jsx";
import CreatePost from "./pages/CreatePost.jsx";
import Navbar from "./components/Navbar.jsx";
import SearchUser from "./pages/SearchUser.jsx";
import VisitProfile from "./pages/VisitProfile.jsx";

function App() {

  const { user } = useAuth();


  return (
    <>
    
    <BrowserRouter>
    <Navbar />
    <Routes>
      <Route path="/" element={user ? <Home /> : <Signup />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/complete-profile" element={<CompleteProfile />} />
      <Route path="/login" element={<Login />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/post/:id" element={<Post />} />
      <Route path="/notifications" element={<Notifications />} />
      <Route path="/create-post" element={<CreatePost />} />
      <Route path="/search" element={<SearchUser />}/>
      <Route path="/visit-profile/:username" element={<VisitProfile />}  />
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
