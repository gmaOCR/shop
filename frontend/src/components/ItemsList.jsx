import React, { useEffect, useCallback, useState, memo } from 'react'
import { useProductApi } from './hooks/useProductAPI'
import CartItem from './CartItem'
import { toast } from 'react-hot-toast'
import useCartItems from './hooks/useCartItems'

// Utilisation de memo pour optimiser le rendu des éléments enfants
const MemoizedCartItem = memo(CartItem)

function ItemsList({ cart: initialCart, disableRightClick, saveCart }) {
  const [localCart, setLocalCart] = useState(initialCart)
  const {
    data,
    loading: productsLoading,
    error: productsError,
    getProducts,
  } = useProductApi()
  const { addOrUpdateCartItem, loading: cartLoading } = useCartItems(localCart)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        await getProducts()
      } catch (error) {
        console.error('Error fetching products:', error)
      }
    }
    fetchProducts()
  }, [getProducts]) // Ajout de getProducts comme dépendance

  useEffect(() => {
    setLocalCart(initialCart)
  }, [initialCart])

  const handleAddToCart = useCallback(
    async (productId) => {
      try {
        const updatedCart = await addOrUpdateCartItem(productId, 1)
        setLocalCart(updatedCart)
        await saveCart(updatedCart)
        toast.success('Produit ajouté au panier')
      } catch (error) {
        console.error('Error adding to cart:', error)
        toast.error("Erreur lors de l'ajout au panier")
      }
    },
    [addOrUpdateCartItem, saveCart],
  )

  if (productsLoading) {
    return <div>Loading...</div>
  }

  if (productsError) {
    return <div>Error loading products: {productsError}</div>
  }

  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-[10%]"
      onContextMenu={disableRightClick}
    >
      {data.map((product) => (
        <MemoizedCartItem
          key={product.id}
          product={product}
          onAddToCart={handleAddToCart}
          disabled={cartLoading}
        />
      ))}
    </div>
  )
}

export default ItemsList
