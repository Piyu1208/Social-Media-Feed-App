import { useState } from 'react';
import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Signup from "./pages/Signup.jsx";
import VerifyEmail from "./pages/VerifyEmail.jsx";
import CompleteProfile from "./pages/CompleteProfile.jsx";
import Login from "./pages/Login.jsx";
import Home from "./pages/Home.jsx";
import Profile from "./pages/Profile.jsx";
import Post from "./pages/Post.jsx";

function App() {

  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/complete-profile" element={<CompleteProfile />} />
      <Route path="/login" element={<Login />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/post/:id" element={<Post />} />
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
