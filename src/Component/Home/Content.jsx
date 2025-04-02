import React from 'react'
import { Routes,Route } from 'react-router-dom'
import Homedashboard from './Homedashboard'
import Texteditor from '../Features/Texteditor'

const Content = () => {
  return (
    <div className="content">
      <Routes>
        <Route path="/" element={<Homedashboard />} />
        <Route path="/edit-text" element={<Texteditor />} />
      </Routes>
    </div>

  )
}

export default Content