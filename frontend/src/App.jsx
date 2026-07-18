import { useState } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Signup from "./pages/Signup.jsx";

function App() {

  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Signup />} />
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
