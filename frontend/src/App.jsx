import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, Link, useNavigate } from 'react-router-dom'
import Solo from "./Solo/Solo"
import Main from "./Main/Main"
import Multi from "./Multi/Multi"
import Users from "./Users/Users"
import U from "./U/U"
import Ranking from './Ranking/Ranking'
import Admin from './Admin/Admin'
import Header from './Header'
import ProtectedRoute from './ProtectedRoute'



function App() {

  // const {state} = useUserInfo()


  return (
    <>
      
      <Router>
        <Header />
        <Routes>
          <Route path='/' element={<ProtectedRoute><Solo /></ProtectedRoute>} />
          <Route path='/main' element={<ProtectedRoute><Main /></ProtectedRoute>} />
          <Route path='/multi/:id' element={<ProtectedRoute><Multi /></ProtectedRoute>} />
          <Route path='/users' element={<ProtectedRoute><Users /></ProtectedRoute>} />
          <Route path='/u/:id' element={<ProtectedRoute><U /></ProtectedRoute>} />
          <Route path='/ranking' element={<ProtectedRoute><Ranking /></ProtectedRoute>} />
          <Route path='/admin' element={<ProtectedRoute><Admin /></ProtectedRoute>} />
        </Routes>
      </Router>
    </>
  )
}

export default App
