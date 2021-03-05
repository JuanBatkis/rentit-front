import { createContext, useEffect, useContext } from "react"
import useLocalStorage from "./useLocalStorage"
import { getCurrentUser, loginFn, logoutFn } from "../services/auth"
import { notification } from "antd"

const AuthContext = createContext()

export const AuthProvider = props => {
  // Un estado con el usuario en sesion (idealmente reflejado en LS(local storage))
  const [user, setUser] = useLocalStorage(null, "user")

  // Metodos para interactuar con el usuario (login, logout, revisar si hay sesion en el server)

  async function login(user) {
    try {
      const { data } = await loginFn(user)
      setUser(data)
      notification['success']({
        message: `Hello ${data.firstName}!`,
        description: 'Thank you for logging in 🙌',
        duration: 5,
        style: {
          borderRadius: '20px'
        }
      })
    } catch (error) {
      notification['error']({
        message: 'Something went wrong',
        description: error.response.data.message,
        duration: 5,
        style: {
          borderRadius: '20px'
        }
      })
    }
  }

  async function logout(push) {
    push('/')
    await logoutFn()
    setUser(null)
  }

  useEffect(() => {
    // preguntamos al backend si hay un user en sesion, de ser asi hacemos login de ese user
    async function getSession() {
      const { data } = await getCurrentUser()
      if (data) {
        setUser(data)
      }
    }

    getSession()
  }, [setUser])

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {props.children}
    </AuthContext.Provider>
  )
}

export const useAuthInfo = () => useContext(AuthContext)