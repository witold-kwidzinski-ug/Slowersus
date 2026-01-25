import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Solo from "./Solo/Solo"
import Main from "./Main/Main"
import Login from "./Login/Login"
import Register from "./Login/Register"
import { useUserInfo } from '../contexts/UserInfoContext'

function AutoRedirect({children}) {
  
  const {state} = useUserInfo()

  if (!state) {
    return <Navigate to="/login" replace />
  }

  return children
}

function App() {


  return (
    <Router>
      <Routes>
        <Route path='/' element={<AutoRedirect><Solo /></AutoRedirect>} />
        <Route path='/main' element={<AutoRedirect><Main /></AutoRedirect>} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
      </Routes>
    </Router>
  )
}

export default App
