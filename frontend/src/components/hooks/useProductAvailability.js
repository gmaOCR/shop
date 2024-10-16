import { useState, useCallback } from 'react'

export const useProductAvailability = () => {
  const [availability, setAvailability] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchAvailability = useCallback(async (availabilityUrl) => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(availabilityUrl, { method: 'GET' })
      const data = await response.json()

      // Assuming data has the structure you provided
      setAvailability({
        isAvailable: data.is_available_to_buy,
        message: data.message,
      })
    } catch (error) {
      console.error(error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }, [])

  return { availability, loading, error, fetchAvailability }
}
