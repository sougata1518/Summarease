import React from 'react'
import { Routes,Route } from 'react-router-dom'
import Homedashboard from './Homedashboard'
import Texteditor from '../Features/Texteditor'
import Editorlogin from '../Features/Editorlogin'
import Aimodel from '../Features/Aimodel'
import ProtectedRoute from './Protectedroute'

const Content = () => {
  return (
    <div className="bg-gray-100 rounded-lg shadow p-6">
      <Routes>
        <Route path="/" element={<Homedashboard />} />
        <Route path="/edit-text" element={<Editorlogin />} />
        <Route path="/enhance" element={<Aimodel />} />
        <Route path="/text-editor/:roomId" element={
          <ProtectedRoute><Texteditor /></ProtectedRoute>
        } />
      </Routes>
    </div>

  )
}

export default Content