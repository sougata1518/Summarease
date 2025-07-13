import React, { createContext, useState , useContext } from 'react'
const AccessCardContext = createContext();

export const Accessprovider = ({children}) => {
    // const [generatedLink, setGeneratedLink] = useState("");
    const [notification, setNotification] = useState(null);

  return (
    <AccessCardContext.Provider
    value={{notification, setNotification}}
    >{children}</AccessCardContext.Provider>
  )
}

// export default Accessprovider

export const useAccessCard = () => useContext(AccessCardContext);