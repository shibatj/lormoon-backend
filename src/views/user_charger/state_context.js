import axios from 'axios'
import { createContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'

// ** Config
import authConfig from 'src/configs/auth'

export const ProjectAppContext = createContext()

export const ProjectAppProvider = ({ children }) => {
  const router = useRouter()
  const [data, setData] = useState(null)

  const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)

  return <ProjectAppContext.Provider value={data}>{children}</ProjectAppContext.Provider>
}
