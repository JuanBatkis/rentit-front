import axios from "axios"

const baseURL =
  process.env.NODE_ENV === "production" ? "https://rentit-project.herokuapp.com/api/auth" : "http://localhost:3001/api/auth"

const _axios = axios.create({
  baseURL,
  withCredentials: true
})

export const signupFn = user => _axios.post("/signup", user)
export const loginFn = user => _axios.post("/login", user)
export const InfoFn = info => _axios.patch("/info/change", info)
export const LocationFn = location => _axios.patch("/location/change", location)
export const updateAvatar = avatar => _axios.patch("/avatar/change", avatar)
export const logoutFn = _ => _axios.get("/logout")
export const getCurrentUser = _ => _axios.get("/session")
export const verifyFn = id => _axios.patch("/verify", id)