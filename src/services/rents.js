import axios from "axios"

const baseURL =
  process.env.NODE_ENV === "production" ? "https://rentit-project.herokuapp.com/api/rent" : "http://localhost:3001/api/rent"

const _axios = axios.create({
  baseURL,
  withCredentials: true
})

export const getAllUserRents = role => _axios.get(`/all/${role}`)
export const getRentById = rentId => _axios.get(`/${rentId}`)
export const getRentPreference = rentPreferenceInfo => _axios.post(`/preference`, rentPreferenceInfo)
export const createRent = rentInfo => _axios.post(`/`, rentInfo)
export const updateRent = rentInfo => _axios.patch(`/update`, rentInfo)