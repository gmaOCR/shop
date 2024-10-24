import { useEffect, useState } from 'react'

export function useShippingMethods() {
  const [shippingMethods, setShippingMethods] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    fetch(`http://localhost:8000/api/basket/shipping-methods/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            "Erreur lors de la récupération des méthodes d'expédition",
          )
        }
        return response.json()
      })
      .then((data) => {
        setShippingMethods(data)
        setLoading(false)
      })
      .catch((error) => {
        setError(error)
        setLoading(false)
      })
  }, [])

  return { shippingMethods, loading, error }
}
