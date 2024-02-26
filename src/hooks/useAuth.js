import { useContext } from 'react'
import { AuthContext } from 'src/context/AuthContext'

export const useAuth = () => useContext(AuthContext)

//console.log('hooks useAuth.js hooked')
