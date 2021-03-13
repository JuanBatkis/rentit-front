import axios from "axios"

const baseURL =
  process.env.NODE_ENV === "production" ? "https://rentit-project.herokuapp.com/api/review" : "http://localhost:3001/api/review"

const _axios = axios.create({
  baseURL,
  withCredentials: true
})

export const createReview = review => _axios.post("/", review)