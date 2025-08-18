import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { Route, Router, Routes } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import Navbar from './pages/Navbar'
import Home from './pages/Home'
import RestaurantPage from './pages/RestaurantPage'
import React from 'react'

function App() {
  return (
  <Routes>
    <Route path="/" element={<Home />}/>
    <Route path="/restaurant/:id" element={<RestaurantPage />} />
  </Routes>
  )
}

export default App
