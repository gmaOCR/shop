import { useState } from 'react'

export const useProductPrice = () => {
  const [price, setPrice] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchPrice = async (priceUrl) => {
    try {
      setLoading(true)
      const response = await fetch(priceUrl)
      const data = await response.json()
      setPrice(data.incl_tax)
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return { price, loading, error, fetchPrice }
}
