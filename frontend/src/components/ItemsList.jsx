import React, { useEffect, useCallback, useState, memo } from 'react'
import { useProductApi } from './hooks/useProductAPI'
import CartItem from './CartItem'
import { toast } from 'react-hot-toast'
import useCartItems from './hooks/useCartItems'

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
  }, [getProducts])

  useEffect(() => {
    setLocalCart(initialCart)
  }, [initialCart])

  const handleAddToCart = useCallback(
    async (product) => {
      try {
        const updatedCart = await addOrUpdateCartItem(product, 1)
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
          onAddToCart={() => handleAddToCart(product)}
          disabled={cartLoading}
        />
      ))}
    </div>
  )
}

export default ItemsList
