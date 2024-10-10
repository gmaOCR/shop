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

  return {
    cart,
    loading,
    addOrUpdateCartItem,
  }
}

export default useCartItems
