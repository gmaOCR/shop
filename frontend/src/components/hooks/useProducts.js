import { useState, useCallback } from 'react'

export const useProducts = () => {
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
      return result
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchProductDetails = useCallback(
    async (productUrl) => {
      try {
        const response = await fetchData(productUrl, 'GET')
        return response
      } catch (err) {
        throw err
      }
    },
    [fetchData],
  )

  const getProducts = useCallback(async () => {
    try {
      const url = '/api/products/'
      const response = await fetchData(url, 'GET')
      const products = await Promise.all(
        response.map((product) => fetchProductDetails(product.url)),
      )
      setData(products)
      return products
    } catch (err) {
      throw err
    }
  }, [fetchData, fetchProductDetails])

  const createProduct = useCallback(
    async (productData) => {
      const url = '/api/products/'
      return await fetchData(url, 'POST', productData)
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
