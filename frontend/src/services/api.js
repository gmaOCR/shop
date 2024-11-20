// src/services/api.js
import { getCSRFToken } from './utils'
export const API_BASE_URL = 'http://localhost:8000/api'
const csrfToken = getCSRFToken()

// Caches
const countriesCache = {
  data: null,
  timestamp: null,
  CACHE_DURATION: 10 * 60 * 1000, // 10 minutes
}

const shippingMethodsCache = {
  data: null,
  timestamp: null,
  CACHE_DURATION: 10 * 60 * 1000, // 10 minutes
}

export const getSessionId = () => {
  let sessionId = localStorage.getItem('oscarApiSessionId')
  return sessionId
}

const debugFetch = async (url, options = {}) => {
  // console.group(`🕵️ API Call Debug`)
  // console.log(`URL: ${url}`)
  // console.log(`Timestamp: ${new Date().toISOString()}`)

  const defaultHeaders = {
    'Content-Type': 'application/json',
    'Session-Id': getSessionId(),
  }

  const mergedOptions = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  }

  try {
    const response = await fetch(url, mergedOptions)

    if (!response.ok) {
      // console.warn(
      //   `❌ Request failed: ${response.status} ${response.statusText}`,
      // )
      throw new Error(`Failed to fetch: ${url}`)
    }

    const data = await response.json()

    // console.log(`✅ Successful response`)
    // console.log(`Response data:`, data)
    // console.groupEnd()

    return data
  } catch (error) {
    // console.error(`🚨 Fetch Error:`, error)
    // console.groupEnd()
    throw error
  }
}

export const fetchProduct = async (productId) => {
  return debugFetch(`${API_BASE_URL}/products/${productId}/`)
}

export const fetchStockRecord = async (
  cart = null,
  productId,
  stockrecordId,
) => {
  if (!cart?.id) {
    console.warn('Pas de panier actif')
    return []
  }
  return debugFetch(
    `${API_BASE_URL}/products/${productId}/stockrecords/${stockrecordId}/`,
  )
}

export const fetchCountries = async (cart = null) => {
  // Vérification du cache
  const now = Date.now()
  if (
    countriesCache.data &&
    countriesCache.timestamp &&
    now - countriesCache.timestamp < countriesCache.CACHE_DURATION
  ) {
    return countriesCache.data
  }

  if (!cart?.id) {
    console.warn('Pas de panier actif')
    return []
  }

  try {
    const countries = await debugFetch(`${API_BASE_URL}/countries/`)

    // Mise en cache
    countriesCache.data = countries.filter(
      (country) => country.is_shipping_country && country.url,
    )
    countriesCache.timestamp = now

    return countriesCache.data
  } catch (error) {
    console.error('Erreur de récupération des pays', error)
    return []
  }
}

export const fetchShippingMethods = async (cart = null) => {
  // Vérification du cache
  const now = Date.now()
  if (
    shippingMethodsCache.data &&
    shippingMethodsCache.timestamp &&
    now - shippingMethodsCache.timestamp < shippingMethodsCache.CACHE_DURATION
  ) {
    return shippingMethodsCache.data
  }

  if (!cart?.id) {
    console.warn('Pas de panier actif')
    return []
  }

  try {
    const methods = await debugFetch(`${API_BASE_URL}/basket/shipping-methods/`)

    // Mise en cache
    shippingMethodsCache.data = methods
    shippingMethodsCache.timestamp = now

    return methods
  } catch (error) {
    console.error("Erreur de récupération des méthodes d'expédition", error)
    return []
  }
}

export const postPayment = async (body) => {
  try {
    console.log('Sending payment request with body:', body)

    const response = await fetch(`${API_BASE_URL}/api-payment/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-CSRFToken': csrfToken },
      body: JSON.stringify(body),
    })

    console.log('Response status:', response.status)

    if (!response.ok) {
      // Essayez de récupérer le message d'erreur du serveur
      const errorText = await response.text()
      console.error('Error response:', errorText)

      throw new Error(
        `Échec de la requête de paiement. Status: ${response.status}, Message: ${errorText}`,
      )
    }

    const jsonResponse = await response.json()
    console.log('Payment response:', jsonResponse)

    return jsonResponse
  } catch (error) {
    console.error('Payment request error:', error)
    throw error
  }
}

// Méthode optionnelle pour invalider le cache si nécessaire
// export const invalidateCache = () => {
//   countriesCache.data = null
//   countriesCache.timestamp = null
//   shippingMethodsCache.data = null
//   shippingMethodsCache.timestamp = null
// }
