import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Solo from "./Solo/Solo"
import Main from "./Main/Main"

function App() {

  return (
    <Router>
      <Routes>
        <Route path='/' element={<Solo />} />
        <Route path='/main' element={<Main />} />
      </Routes>
    </Router>
  )
}

export default App
