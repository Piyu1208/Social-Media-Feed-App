import { useState } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Signup from "./pages/Signup.jsx";
import VerifyEmail from "./pages/VerifyEmail.jsx";

function App() {

  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Signup />} />
      <Route path="/verifyemail" element={<VerifyEmail />} />
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
