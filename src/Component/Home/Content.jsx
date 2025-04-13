import React from 'react'
import { Routes,Route } from 'react-router-dom'
import Homedashboard from './Homedashboard'
import Texteditor from '../Features/Texteditor'
import Editorlogin from '../Features/Editorlogin'

const Content = () => {
  return (
    <div className="content">
      <Routes>
        <Route path="/" element={<Homedashboard />} />
        <Route path="/edit-text" element={<Editorlogin />} />
        <Route path="/text-editor/:roomId" element={<Texteditor />} />
      </Routes>
    </div>

  )
}

export default Content