import React, { createContext, useContext, useEffect, useState } from 'react'

const ProductContext = createContext()

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchProductDetails = async (productId) => {
    try {
      const response = await fetch(`/api/products/${productId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch product details')
      }
      return await response.json()
    } catch (err) {
      console.error(`Error fetching details for product ${productId}:`, err)
      throw err
    }
  }

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/products/')
      if (!response.ok) {
        throw new Error('Failed to fetch products')
      }
      const productList = await response.json()

      // Fetch details for each product
      const productsWithDetails = await Promise.all(
        productList.map(async (product) => {
          try {
            const details = await fetchProductDetails(product.id)
            return { ...product, ...details }
          } catch (err) {
            console.error(
              `Failed to fetch details for product ${product.id}`,
              err,
            )
            return product
          }
        }),
      )

      setProducts(productsWithDetails)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  return (
    <ProductContext.Provider
      value={{ products, loading, error, fetchProducts }}
    >
      {children}
    </ProductContext.Provider>
  )
}

export const useProducts = () => {
  return useContext(ProductContext)
}
