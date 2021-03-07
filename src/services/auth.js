import axios from "axios"

const baseURL =
  process.env.NODE_ENV === "production" ? "/api/auth" : "http://localhost:3001/api/auth"

const _axios = axios.create({
  baseURL,
  withCredentials: true
})

export const signupFn = user => _axios.post("/signup", user)
export const loginFn = user => _axios.post("/login", user)
export const logoutFn = _ => _axios.get("/logout")
export const getCurrentUser = _ => _axios.get("/session")