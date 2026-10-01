import { useState } from 'react'
import { Routes,Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'

function App() {

  return (
    <Routes>
      <Route path='/:gameid' element={<Home/>} />
      {/* <Route path='/' element={<Dashboard/>} /> */}
      <Route path='/login' element={<Login/>} />
      <Route path='/create' element={<Signup/>} />
    </Routes>
  )
}

export default App
