import { BrowserRouter } from 'react-router-dom'
import './App.css'
import Home from './Component/Home/Home'
import {Accessprovider} from './Component/Globalvariable/Accessprovider'

function App() {

  return (
    <Accessprovider>
      <Home />
    </Accessprovider>
  )
}

export default App
