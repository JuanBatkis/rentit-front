import axios from "axios"

const baseURL =
  process.env.NODE_ENV === "production" ? "/api/question" : "http://localhost:3001/api/question"

const _axios = axios.create({
  baseURL,
  withCredentials: true
})

export const createQuestion = question => _axios.post("", question)
export const getUserQuestions = (userId, status) => _axios.get(`/user/${userId}/${status}`)