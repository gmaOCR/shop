import { useState, useEffect } from 'react'

export function useCountries() {
  const [countries, setCountries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchCountries = async () => {
      setLoading(true)
      try {
        const response = await fetch('http://localhost:8000/api/countries/')
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        const data = await response.json()
        setCountries(data)
      } catch (err) {
        setError(err)
      } finally {
        setLoading(false)
      }
    }

    fetchCountries()
  }, [])

  return { countries, loading, error }
}
