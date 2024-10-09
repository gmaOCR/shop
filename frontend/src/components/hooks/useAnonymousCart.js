import { useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'

const useAnonymousCart = () => {
  const [cart, setCart] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const initializeCart = () => {
      setLoading(true)
      try {
        // Tenter de récupérer la session ID stockée
        const storedSessionId = localStorage.getItem('anonymousCartSessionId')

        if (storedSessionId) {
          // Si une session ID existe, tenter de récupérer le panier correspondant
          const storedCart = localStorage.getItem(
            `anonymousCart_${storedSessionId}`,
          )
          if (storedCart) {
            setCart(JSON.parse(storedCart))
          } else {
            // Si le panier n'existe pas pour cette session ID, créer un nouveau panier
            createNewCart(storedSessionId)
          }
        } else {
          // Si aucune session ID n'existe, créer un nouveau panier avec une nouvelle session ID
          createNewCart()
        }
      } catch (error) {
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    initializeCart()
  }, [])

  const createNewCart = (sessionId = uuidv4()) => {
    const newCart = {
      user: {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      session_id: sessionId,
      items: [],
    }
    setCart(newCart)
    localStorage.setItem('anonymousCartSessionId', sessionId)
    localStorage.setItem(`anonymousCart_${sessionId}`, JSON.stringify(newCart))
  }

  const updateCart = (cartData) => {
    console.log('Updating cart with:', cartData)
    setLoading(true)
    try {
      setCart((prevCart) => {
        const updatedCart = {
          ...prevCart, // Préserve tous les champs existants
          ...cartData, // Applique les nouvelles données
          updated_at: new Date().toISOString(),
        }
        console.log('Updated cart:', updatedCart)
        localStorage.setItem(
          `anonymousCart_${updatedCart.session_id}`,
          JSON.stringify(updatedCart),
        )
        console.log('Cart saved to localStorage')
        return updatedCart
      })
    } catch (error) {
      console.error('Error updating cart:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return { cart, loading, error, updateCart }
}

export default useAnonymousCart
