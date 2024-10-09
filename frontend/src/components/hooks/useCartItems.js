import { useState, useCallback } from 'react'

export default function useCartItems() {
  const [cart, setCart] = useState({ items: [] })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // const updateGlobalCart = (newCart) => {
  //   setCart(newCart)
  // }

  const addOrUpdateCartItem = useCallback(
    (productId, quantity) => {
      setLoading(true)
      return new Promise((resolve, reject) => {
        const updatedCart = { ...cart }
        const existingItemIndex = updatedCart.items.findIndex(
          (item) => item.product_id === productId,
        )

        if (existingItemIndex !== -1) {
          // Update existing item quantity
          updatedCart.items[existingItemIndex].quantity += quantity
        } else {
          // Add new item to cart
          updatedCart.items.push({ product_id: productId, quantity })
        }

        setCart(updatedCart)
        resolve(updatedCart)
      })
        .then(() => {
          setLoading(false)
        })
        .catch((err) => {
          console.error('Error in addOrUpdateCartItem:', err)
          setError(err.message)
          setLoading(false)
          reject(err)
        })
    },
    [cart, setCart],
  )

  return { addOrUpdateCartItem, loading, error, cart }
}
