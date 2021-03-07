import axios from "axios"

const baseURL =
  process.env.NODE_ENV === "production" ? "/api/product" : "http://localhost:3001/api/product"

const _axios = axios.create({
  baseURL,
  withCredentials: true
})

export const getAllProducts = limit => _axios.get(`/all/${limit}`)
export const getProductsByCategory = category => _axios.get(`/category/${category}`)
export const getProductById = productId => _axios.get(`/${productId}`)
export const getUserProducts = (userId, limit) => _axios.get(`/user/${userId}/${limit}`)
export const createProduct = product => _axios.post("/", product)
export const updateProduct = (productId, updates) => _axios.patch(`/${productId}`, updates)
export const deleteProduct = productId => _axios.delete(`/${productId}`)