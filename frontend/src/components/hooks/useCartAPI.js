import { useState, useEffect } from 'react'

const useCartApi = (isAuthenticated) => {
  const baseUrl = '/api/cart/'
  const [carts, setCarts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [session_id, setSessionId] = useState(null)

  useEffect(() => {
    console.log('useEffect pour récupérer le session_id')
    const sessionIdCookie = document.cookie.match(/sessionid=([^;]*)/)
    if (sessionIdCookie) {
      console.log('session_id trouvé :', sessionIdCookie[1])
      setSessionId(sessionIdCookie[1])
    } else {
      console.log('session_id non trouvé')
    }
  }, [])

  const fetchCarts = async () => {
    console.log('fetchCarts appelé')
    if (!session_id) {
      console.log('session_id non défini, retour')
      return
    }
    console.log('session_id défini, fetch en cours')
    setLoading(true)
    try {
      let url
      if (isAuthenticated) {
        url = `${baseUrl}`
      } else {
        url = `${baseUrl}anon/${session_id}/`
      }
      console.log('URL :', url)
      const response = await fetch(url)
      if (!response.ok) {
        console.log('Réponse non OK :', response.status)
        throw new Error('Failed to fetch carts')
      }
      const data = await response.json()
      console.log('Données reçues :', data)
      setCarts(data)
    } catch (err) {
      console.log('Erreur :', err.message)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const updateCart = async (cartData) => {
    console.log('updateCart appelé')
    try {
      let url
      if (isAuthenticated) {
        url = `${baseUrl}auth/`
      } else {
        url = `${baseUrl}anon/${session_id}/`
      }
      console.log('URL :', url)
      const response = await fetch(url, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cartData),
      })
      if (!response.ok) {
        console.log('Réponse non OK :', response.status)
        throw new Error('Failed to update cart')
      }
      const updatedCart = await response.json()
      console.log('Données reçues :', updatedCart)
      setCarts((prevCarts) =>
        prevCarts.map((cart) => (cart.id === id ? updatedCart : cart)),
      )
    } catch (err) {
      console.log('Erreur :', err.message)
      setError(err.message)
    }
  }

  const deleteCart = async (id) => {
    console.log('deleteCart appelé')
    try {
      let url
      if (isAuthenticated) {
        url = `${baseUrl}auth/`
      } else {
        url = `${baseUrl}anon/${session_id}/`
      }
      console.log('URL :', url)
      const response = await fetch(url, {
        method: 'DELETE',
      })
      if (!response.ok) {
        console.log('Réponse non OK :', response.status)
        throw new Error('Failed to delete cart')
      }
      setCarts((prevCarts) => prevCarts.filter((cart) => cart.id !== id))
    } catch (err) {
      console.log('Erreur :', err.message)
      setError(err.message)
    }
  }

  useEffect(() => {
    console.log('useEffect pour fetchCarts')
    fetchCarts()
  }, [isAuthenticated, session_id])

  return { carts, loading, error, updateCart, deleteCart }
}

export default useCartApi
