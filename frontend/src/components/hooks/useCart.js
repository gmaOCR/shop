import { useState, useCallback, useRef } from 'react'

const useCart = () => {
  const [cart, setCart] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const isFetchingRef = useRef(false)

  const generateRandomIdentifier = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
      /[xy]/g,
      function (c) {
        var r = (Math.random() * 16) | 0,
          v = c == 'x' ? r : (r & 0x3) | 0x8
        return v.toString(16)
      },
    )
  }

  const generateSessionId = () => {
    const type = 'ANON'
    const realm = 'localhost'
    const identifier = generateRandomIdentifier()
    return `SID:${type}:${realm}:${identifier}`
  }

  const getSessionId = () => {
    let sessionId = localStorage.getItem('oscarApiSessionId')
    if (!sessionId) {
      sessionId = generateSessionId()
      localStorage.setItem('oscarApiSessionId', sessionId)
    }
    return sessionId
  }

  const fetchCart = useCallback(() => {
    if (isFetchingRef.current) return

    isFetchingRef.current = true
    setLoading(true)

    const sessionId = getSessionId()
    fetch('http://localhost:8000/api/basket/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Session-Id': sessionId,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        return response.json()
      })
      .then((data) => {
        setCart(data)
      })
      .catch((error) => {
        setError(error)
      })
      .finally(() => {
        setLoading(false)
        isFetchingRef.current = false
      })
  }, [])

  const updateCart = useCallback((product, quantity) => {
    if (isFetchingRef.current) return
    isFetchingRef.current = true
    setLoading(true)

    const sessionId = getSessionId()
    const productUrl = `http://localhost:8000/api/products/${product.id}/`

    const requestBody = {
      url: productUrl,
      quantity: quantity,
    }

    fetch(`http://localhost:8000/api/basket/add-product/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': '*/*',
        'Session-Id': sessionId,
      },
      body: JSON.stringify(requestBody),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        return response.json()
      })
      .then((data) => setCart(data))
      .catch((error) => setError(error))
      .finally(() => {
        setLoading(false)
        isFetchingRef.current = false
      })
  }, [])

  return { cart, error, loading, updateCart, fetchCart, getSessionId }
}

export default useCart
