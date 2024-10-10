import { useCallback } from 'react'

export default function useCartItems(initialCart = { items: [] }) {
  const addOrUpdateCartItem = useCallback(
    async (productId, quantity) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          const updatedCart = {
            ...initialCart,
            items: [...(initialCart.items || [])],
          }

          const existingItem = updatedCart.items.find(
            (item) => item.product_id === productId,
          )

          if (existingItem) {
            // Si l'item existe, mettre à jour sa quantité
            updatedCart.items = updatedCart.items.map((item) =>
              item.product_id === productId
                ? { ...item, quantity: item.quantity + quantity }
                : item,
            )
          } else {
            // Sinon, ajouter un nouvel item
            updatedCart.items.push({ product_id: productId, quantity })
          }

          // Mettre à jour la date de mise à jour
          updatedCart.updated_at = new Date().toISOString()

          resolve(updatedCart)
        }, 500) // Simuler un délai de 500ms
      })
    },
    [initialCart],
  )

  return {
    addOrUpdateCartItem,
    loading: false, // Nous pourrions ajouter un état de chargement réel si nécessaire
  }
}
