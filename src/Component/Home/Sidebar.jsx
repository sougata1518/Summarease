import React from 'react'
import { logoutUser } from '../Services/User'
import { doLogout } from '../Localstorage'
import { useNavigate } from 'react-router-dom'

const Sidebar = () => {

  const navigate = useNavigate();

  const logoutUserData = () => {
    logoutUser().then(respinse => {
      doLogout();
    }).catch(error => console.log(error))
  }

  const textEdit = () => {
    navigate("/edit-text") 
  }

  return (
    <aside className="sidebar">
      <ul>
        <li>🏠 Home</li>
        <li onClick={textEdit}>📊 Text Editor</li>
        <li>⚙ Settings</li>
        <li onClick={logoutUserData}>🔓 Logout</li>
      </ul>
    </aside>
  )
}

export default Sidebar