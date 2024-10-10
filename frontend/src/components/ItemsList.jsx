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
    async (item) => {
      try {
        console.log('Adding to cart:', item)
        const updatedCart = await addOrUpdateCartItem(item.id, 1)
        console.log('Updated cart:', updatedCart)

        if (updatedCart) {
          setLocalCart(updatedCart)
          saveCart(updatedCart)
          toast.success(`${item.name} added to cart!`)
        } else {
          throw new Error('Failed to update cart')
        }
      } catch (error) {
        console.error('Error adding item to cart:', error)
        toast.error('Failed to add item to cart. Please try again.')
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
