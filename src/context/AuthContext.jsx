import { createContext, useContext, useState } from 'react'
import axios from 'axios'

const AuthContext = createContext(null)

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  // Attach token to every request if we have one
  api.interceptors.request.use(config => {
    const token = sessionStorage.getItem('authToken')
    if (token) config.headers['x-auth-token'] = token
    return config
  })

  async function login(username, password, captcha, csrf) {
    const res = await api.post('/api/login', { username, password, captcha, csrf })
    // Store the token the backend issued
    sessionStorage.setItem('authToken', res.data.authToken)
    setUser(res.data)
    return res.data
  }

  async function logout() {
    await api.post('/api/logout')
    sessionStorage.removeItem('authToken')
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
