import { useState, useCallback } from 'react'

const useCartItems = (initialCart = { items: [] }) => {
  const [cart, setCart] = useState(initialCart)
  const [loading, setLoading] = useState(false)

  const addOrUpdateCartItem = useCallback(
    async (product, quantity) => {
      setLoading(true)
      try {
        const updatedCart = { ...cart }
        const existingItemIndex = updatedCart.items.findIndex(
          (item) => item.product.id === product.id,
        )

        if (existingItemIndex !== -1) {
          // Le produit existe déjà, mettre à jour la quantité
          updatedCart.items[existingItemIndex].quantity += quantity
        } else {
          // Ajouter un nouveau produit
          updatedCart.items.push({
            product: {
              id: product.id,
              name: product.name,
              description: product.description,
              price: product.price,
              image: product.image,
              // Ajoutez ici tous les autres champs nécessaires du produit
            },
            quantity: quantity,
          })
        }

        // Mettre à jour la date de mise à jour
        updatedCart.updated_at = new Date().toISOString()

        setCart(updatedCart)
        return updatedCart
      } catch (error) {
        console.error('Error updating cart:', error)
        throw error
      } finally {
        setLoading(false)
      }
    },
    [cart],
  )

  const removeCartItem = useCallback(
    async (productId) => {
      setLoading(true)
      try {
        const updatedCart = {
          ...cart,
          items: cart.items.filter((item) => item.product.id !== productId),
        }
        updatedCart.updated_at = new Date().toISOString()
        setCart(updatedCart)
        return updatedCart
      } catch (error) {
        console.error('Error removing item from cart:', error)
        throw error
      } finally {
        setLoading(false)
      }
    },
    [cart],
  )

  const updateCartItemQuantity = useCallback(
    async (productId, newQuantity) => {
      setLoading(true)
      try {
        const updatedCart = {
          ...cart,
          items: cart.items.map((item) =>
            item.product.id === productId
              ? { ...item, quantity: newQuantity }
              : item,
          ),
        }
        updatedCart.updated_at = new Date().toISOString()
        setCart(updatedCart)
        return updatedCart
      } catch (error) {
        console.error('Error updating item quantity:', error)
        throw error
      } finally {
        setLoading(false)
      }
    },
    [cart],
  )

  const clearCart = useCallback(async () => {
    setLoading(true)
    try {
      const updatedCart = { items: [], updated_at: new Date().toISOString() }
      setCart(updatedCart)
      return updatedCart
    } catch (error) {
      console.error('Error clearing cart:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    cart,
    loading,
    addOrUpdateCartItem,
    removeCartItem,
    updateCartItemQuantity,
    clearCart,
  }
}

export default useCartItems
