import React from 'react'
import { Routes,Route } from 'react-router-dom'
import Homedashboard from './Homedashboard'

const Content = () => {
  return (
    <div className="content">
      <Routes>
        <Route path="/" element={<Homedashboard />} />
      </Routes>
    </div>

  )
}

export default Content