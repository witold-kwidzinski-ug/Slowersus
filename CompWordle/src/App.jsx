import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, Link, useNavigate } from 'react-router-dom'
import Solo from "./Solo/Solo"
import Main from "./Main/Main"
import Login from "./Login/Login"
import Register from "./Login/Register"
import Multi from "./Multi/Multi"
import Users from "./Users/Users"
import U from "./U/U"
import Ranking from './Ranking/Ranking'
import { useUserInfo } from '../contexts/UserInfoContext'
import Header from './Header'

function AutoRedirect({children}) {
  
  const {state} = useUserInfo()
  const location = useLocation()

  if (!state.id) {
    return <Navigate to="/login" replace state={{from: location.pathname}} />
  }

  return children
}

function App() {

  const {state} = useUserInfo()


  return (
    <>
      
      <Router>
        {state.id && <Header />}
        <Routes>
          <Route path='/' element={<AutoRedirect><Solo /></AutoRedirect>} />
          <Route path='/main' element={<AutoRedirect><Main /></AutoRedirect>} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/multi/:id' element={<AutoRedirect><Multi /></AutoRedirect>} />
          <Route path='/users' element={<AutoRedirect><Users /></AutoRedirect>} />
          <Route path='/u/:id' element={<AutoRedirect><U /></AutoRedirect>} />
          <Route path='/ranking' element={<AutoRedirect><Ranking /></AutoRedirect>} />
        </Routes>
      </Router>
    </>
  )
}

export default App
