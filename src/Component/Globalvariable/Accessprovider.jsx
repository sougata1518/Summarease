import React, { createContext, useState , useContext } from 'react'
const AccessCardContext = createContext();

export const Accessprovider = ({children}) => {
    const [generatedLink, setGeneratedLink] = useState("");

  return (
    <AccessCardContext.Provider
    value={{generatedLink,setGeneratedLink}}
    >{children}</AccessCardContext.Provider>
  )
}

// export default Accessprovider

export const useAccessCard = () => useContext(AccessCardContext);