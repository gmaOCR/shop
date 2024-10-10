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
          const storedCartData = JSON.parse(storedCart)
          const lastUpdated = storedCartData.updated_at
          const currentCart = { ...storedCartData, items: [] } // Create a new cart with empty items
          currentCart.updated_at = new Date().toISOString()
          if (lastUpdated !== currentCart.updated_at) {
            // Cart data has been updated, use the new cart state
            setCart(currentCart)
          } else {
            // Cart data is up-to-date, use the stored cart state
            setCart(storedCartData)
          }
        } else {
          // No cart data found, create a new cart
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
        }
      }
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
      if (updatedCart.items && updatedCart.items.length > 0) {
        updatedCart.updated_at = new Date().toISOString()
      }
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
