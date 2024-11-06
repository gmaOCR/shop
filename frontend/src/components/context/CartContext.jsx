import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from 'react'

const CartContext = createContext(null)

export const CartProvider = ({ children }) => {
  const [loading, setLoading] = useState({
    cart: true,
    lines: true,
    operation: false,
  })
  const [cart, setCart] = useState(null)
  const [lines, setLines] = useState([])
  const [error, setError] = useState(null)

  const getSessionId = useCallback(() => {
    let sessionId = localStorage.getItem('oscarApiSessionId')
    if (!sessionId) {
      sessionId = `SID:ANON:localhost:${Math.random().toString(16).slice(2, 10)}`
      localStorage.setItem('oscarApiSessionId', sessionId)
    }
    return sessionId
  }, [])

  const fetchCart = useCallback(async () => {
    setLoading((prev) => ({ ...prev, cart: true }))
    setError(null)

    try {
      const response = await fetch('http://localhost:8000/api/basket/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Session-Id': getSessionId(),
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch cart')
      }

      const data = await response.json()
      setCart(data)
    } catch (error) {
      setError(error.message)
      setCart(null)
    } finally {
      setLoading((prev) => ({ ...prev, cart: false }))
    }
  }, [getSessionId])

  const fetchLines = useCallback(async () => {
    if (!cart?.id) {
      setLoading((prev) => ({ ...prev, lines: false }))
      return
    }
    setLoading((prev) => ({ ...prev, lines: true }))
    try {
      const response = await fetch(
        `http://localhost:8000/api/baskets/${cart.id}/lines/`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Session-Id': getSessionId(),
          },
        },
      )
      if (!response.ok) {
        throw new Error('Failed to fetch lines')
      }
      const data = await response.json()
      setLines(data)
    } catch (error) {
      setError(error.message)
      setLines([])
    } finally {
      setLoading((prev) => ({ ...prev, lines: false }))
    }
  }, [cart?.id, getSessionId])

  const updateCart = useCallback(
    async (product, quantity) => {
      if (loading.operation) return

      setLoading((prev) => ({ ...prev, operation: true }))
      setError(null)

      const sessionId = getSessionId()
      const productUrl = `http://localhost:8000/api/products/${product.id}/`
      const requestBody = {
        url: productUrl,
        quantity: quantity,
      }

      try {
        const response = await fetch(
          `http://localhost:8000/api/basket/add-product/`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Session-Id': sessionId,
            },
            body: JSON.stringify(requestBody),
          },
        )

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(
            errorData.reason || 'Erreur lors de la mise à jour du panier',
          )
        }

        await fetchCart()
        await fetchLines()
      } catch (error) {
        console.error('Erreur lors de la mise à jour du panier:', error)
        setError(error.message)
      } finally {
        setLoading((prev) => ({ ...prev, operation: false }))
      }
    },
    [fetchCart, fetchLines, getSessionId, loading.operation],
  )

  const updateLineQuantity = useCallback(
    async (lineUrl, newQuantity) => {
      if (loading.operation) return

      setLoading((prev) => ({ ...prev, operation: true }))
      setError(null)

      try {
        setLines((currentLines) =>
          currentLines.map((line) =>
            line.url === lineUrl ? { ...line, quantity: newQuantity } : line,
          ),
        )

        const response = await fetch(lineUrl, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Session-Id': getSessionId(),
          },
          body: JSON.stringify({ quantity: newQuantity }),
        })

        if (!response.ok) {
          throw new Error('Failed to update quantity')
        }

        await Promise.all([fetchCart(), fetchLines()])
      } catch (error) {
        console.error('Error updating quantity:', error)
        setError(error.message)
        await Promise.all([fetchCart(), fetchLines()])
      } finally {
        setLoading((prev) => ({ ...prev, operation: false }))
      }
    },
    [fetchCart, fetchLines, getSessionId, loading.operation],
  )

  const deleteLine = useCallback(
    async (lineUrl) => {
      if (loading.operation) return

      setLoading((prev) => ({ ...prev, operation: true }))
      setError(null)

      try {
        setLines((currentLines) =>
          currentLines.filter((line) => line.url !== lineUrl),
        )

        const response = await fetch(lineUrl, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Session-Id': getSessionId(),
          },
        })

        if (!response.ok) {
          throw new Error('Failed to delete line')
        }

        await Promise.all([fetchCart(), fetchLines()])
      } catch (error) {
        console.error('Error deleting line:', error)
        setError(error.message)
        await Promise.all([fetchCart(), fetchLines()])
      } finally {
        setLoading((prev) => ({ ...prev, operation: false }))
      }
    },
    [fetchCart, fetchLines, getSessionId, loading.operation],
  )

  const clearCart = useCallback(async () => {
    if (loading.operation) return

    setLoading((prev) => ({ ...prev, operation: true }))
    setError(null)

    try {
      for (const line of lines) {
        const response = await fetch(line.url, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Session-Id': getSessionId(),
          },
        })

        if (!response.ok) {
          throw new Error('Failed to delete line')
        }
      }

      await Promise.all([fetchCart(), fetchLines()])
    } catch (error) {
      console.error('Error clearing cart:', error)
      setError(error.message)
      await Promise.all([fetchCart(), fetchLines()])
    } finally {
      setLoading((prev) => ({ ...prev, operation: false }))
    }
  }, [lines, fetchCart, fetchLines, getSessionId, loading.operation])

  useEffect(() => {
    fetchCart()
  }, [fetchCart])

  useEffect(() => {
    return () => {
      setCart(null)
      setLines([])
      setError(null)
      setLoading({
        cart: false,
        lines: false,
        operation: false,
      })
    }
  }, [])

  const isLoading = loading.cart || loading.lines || loading.operation

  return (
    <CartContext.Provider
      value={{
        cart,
        lines,
        loading: { ...loading, isLoading },
        error,
        clearCart,
        fetchLines,
        updateCart,
        updateLineQuantity,
        deleteLine,
        isLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCartContext = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCartContext must be used within a CartProvider')
  }
  return context
}

export default CartProvider
