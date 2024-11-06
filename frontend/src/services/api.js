// src/services/api.js
const API_BASE_URL = 'http://localhost:8000/api'

export const fetchProduct = async (productId) => {
  const response = await fetch(`${API_BASE_URL}/products/${productId}/`)
  if (!response.ok) throw new Error('Failed to fetch product')
  return response.json()
}

export const fetchStockRecord = async (productId, stockrecordId) => {
  const response = await fetch(
    `${API_BASE_URL}/products/${productId}/stockrecords/${stockrecordId}/`,
  )
  if (!response.ok) throw new Error('Failed to fetch stock record')
  return response.json()
}

export const fetchCountries = async () => {
  const response = await fetch(`${API_BASE_URL}/countries/`)
  if (!response.ok) throw new Error('Failed to fetch countries')
  return response.json()
}

export const fetchShippingMethods = async () => {
  const response = await fetch(`${API_BASE_URL}/basket/shipping-methods/`)
  if (!response.ok) throw new Error('Failed to fetch shipping methods')
  return response.json()
}
