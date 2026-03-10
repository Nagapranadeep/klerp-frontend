import { createContext, useContext, useState } from 'react'
import axios from 'axios'

const AuthContext = createContext(null)

const api = axios.create({ withCredentials: true })

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  async function login(username, password, captcha) {
    const res = await api.post('/api/login', { username, password, captcha })
    setUser(res.data)
    return res.data
  }

  async function logout() {
    await api.post('/api/logout')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, api }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
export { api }
