import { useState, useCallback } from 'react'

export const useProductApi = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchData = useCallback(async (url, method = 'GET', body = null) => {
    try {
      setLoading(true)
      setError(null)

      const options = {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
      }

      if (body) {
        options.body = JSON.stringify(body)
      }

      const response = await fetch(url, options)

      if (!response.ok) {
        throw new Error('Failed to fetch')
      }

      const result = await response.json()
      setData(result)
      return result
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const createProduct = useCallback(
    async (productData) => {
      const url = '/api/products/'
      return await fetchData(url, 'POST', productData)
    },
    [fetchData],
  )

  const getProducts = useCallback(
    async (productId = null) => {
      const url = productId ? `/api/products/${productId}/` : '/api/products/'
      return await fetchData(url, 'GET')
    },
    [fetchData],
  )

  const updateProduct = useCallback(
    async (productId, productData) => {
      const url = `/api/products/${productId}/`
      return await fetchData(url, 'PUT', productData)
    },
    [fetchData],
  )

  const deleteProduct = useCallback(
    async (productId) => {
      const url = `/api/products/${productId}/`
      return await fetchData(url, 'DELETE')
    },
    [fetchData],
  )

  return {
    data,
    loading,
    error,
    createProduct,
    getProducts,
    updateProduct,
    deleteProduct,
  }
}
