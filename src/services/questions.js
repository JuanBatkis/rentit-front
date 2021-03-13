import axios from "axios"

const baseURL =
  process.env.NODE_ENV === "production" ? "https://rentit-project.herokuapp.com/api/question" : "http://localhost:3001/api/question"

const _axios = axios.create({
  baseURL,
  withCredentials: true
})

export const createQuestion = question => _axios.post("/", question)
export const getUserQuestions = (role) => _axios.get(`/user-question/${role}`)
export const answerQuestion = (questionId, answer) => _axios.patch(`/${questionId}`, answer)