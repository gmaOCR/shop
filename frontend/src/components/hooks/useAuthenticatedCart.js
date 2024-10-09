import { useState, useEffect } from 'react'

const useAuthenticatedCart = () => {
  const baseUrl = '/api/carts/'
  const [carts, setCarts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchCarts = async () => {
    setLoading(true)
    try {
      const response = await fetch(baseUrl)
      if (!response.ok) {
        throw new Error('Failed to fetch carts')
      }
      const data = await response.json()
      setCarts(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const updateCart = async (cartData) => {
    try {
      const response = await fetch(`${baseUrl}auth/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cartData),
      })
      if (!response.ok) {
        throw new Error('Failed to update cart')
      }
      const updatedCart = await response.json()
      setCarts((prevCarts) =>
        prevCarts.map((cart) => (cart.id === id ? updatedCart : cart)),
      )
    } catch (err) {
      setError(err.message)
    }
  }

  const deleteCart = async (id) => {
    try {
      const response = await fetch(`${baseUrl}auth/`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        throw new Error('Failed to delete cart')
      }
      setCarts((prevCarts) => prevCarts.filter((cart) => cart.id !== id))
    } catch (err) {
      setError(err.message)
    }
  }

  useEffect(() => {
    fetchCarts()
  }, [])

  return { carts, loading, error, updateCart, deleteCart }
}

export default useAuthenticatedCart
