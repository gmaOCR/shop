// hooks/useAnonymousCart.js
import { useState, useEffect, useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid'

const useAnonymousCart = () => {
  const [cart, setCart] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const initializeCart = useCallback(() => {
    try {
      const storedSessionId = localStorage.getItem('anonymousCartSessionId')
      if (storedSessionId) {
        const storedCart = localStorage.getItem(
          `anonymousCart_${storedSessionId}`,
        )
        if (storedCart) {
          setCart(JSON.parse(storedCart))
          return
        }
      }

      // Si aucun cart n'est trouvé, on en crée un nouveau
      const newSessionId = uuidv4()
      const newCart = {
        items: [],
        user: {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        session_id: newSessionId,
      }
      localStorage.setItem('anonymousCartSessionId', newSessionId)
      localStorage.setItem(
        `anonymousCart_${newSessionId}`,
        JSON.stringify(newCart),
      )
      setCart(newCart)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    initializeCart()
  }, [initializeCart])

  const saveCart = useCallback((updatedCart) => {
    if (updatedCart && updatedCart.session_id) {
      localStorage.setItem(
        `anonymousCart_${updatedCart.session_id}`,
        JSON.stringify(updatedCart),
      )
      setCart(updatedCart)
    }
  }, [])

  return { cart, loading, error, saveCart }
}

export default useAnonymousCart
