import { useState, useCallback } from 'react'

const useCart = () => {
  const [cart, setCart] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(false)

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
    console.debug('fetchCart called')
    if (isFetching) return
    setIsFetching(true)
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
        console.debug('Response:', response)
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        return response.json()
      })
      .then((data) => {
        setCart(data)
        console.debug('Cart data:', data)
      })
      .catch((error) => setError(error))
      .finally(() => {
        setLoading(false)
        setIsFetching(false)
      })
  }, [])

  const updateCart = useCallback(
    (product, quantity) => {
      if (isFetching) return
      setIsFetching(true)
      setLoading(true)

      const sessionId = getSessionId()

      const productUrl = `http://localhost:8000/api/products/${product.id}/`

      const requestBody = {
        url: productUrl,
        quantity: quantity,
      }

      console.debug('Sending request with:', requestBody)

      fetch(`http://localhost:8000/api/basket/add-product/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': '*/*',
          'Cookie': `sessionid=${sessionId}`,
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
          setIsFetching(false)
        })
    },
    [isFetching],
  )

  return { cart, error, loading, updateCart, fetchCart }
}

export default useCart
