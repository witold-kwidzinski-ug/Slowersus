import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, Link } from 'react-router-dom'
import Solo from "./Solo/Solo"
import Main from "./Main/Main"
import Login from "./Login/Login"
import Register from "./Login/Register"
import Multi from "./Multi/Multi"
import { useUserInfo } from '../contexts/UserInfoContext'

function AutoRedirect({children}) {
  
  const {state} = useUserInfo()
  const location = useLocation()

  if (!state.id) {
    return <Navigate to="/login" replace state={{from: location.pathname}} />
  }

  return children
}

function App() {


  return (
    <>
      
      <Router>
        <header>
          <Link to='/'>Solo</Link>
          <Link to='/main'>Main</Link>
        </header>
        <Routes>
          <Route path='/' element={<AutoRedirect><Solo /></AutoRedirect>} />
          <Route path='/main' element={<AutoRedirect><Main /></AutoRedirect>} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/multi/:id' element={<AutoRedirect><Multi /></AutoRedirect>} />
        </Routes>
      </Router>
    </>
  )
}

export default App
