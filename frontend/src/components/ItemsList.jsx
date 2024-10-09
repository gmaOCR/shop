import React from 'react'
import { useEffect, useState } from 'react'
import { useProductApi } from './hooks/useProductAPI'
import CartItem from './CartItem'
import { toast } from 'react-hot-toast'
import useCartItems from './hooks/useCartItems'

function ItemsList({ sessionId, disableRightClick, updateCart }) {
  const {
    data,
    loading: productsLoading,
    error: productsError,
    getProducts,
  } = useProductApi()
  const { addOrUpdateCartItem, loading: cartLoading } = useCartItems(updateCart)

  React.useEffect(() => {
    getProducts()
  }, [])

  const handleAddToCart = async (item) => {
    try {
      const updatedCart = await addOrUpdateCartItem(item.id, 1)
      updateCart(updatedCart) // Pass the updatedCart object to updateCart
      toast.success(`${item.name} added to cart!`)
    } catch (error) {
      console.error('Error adding item to cart:', error)
      toast.error('Failed to add item to cart. Please try again.')
    }
  }

  if (productsLoading) {
    return <div>Loading...</div>
  }

  if (productsError) {
    return <div>Error: {productsError.message}</div>
  }

  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-[10%]"
      onContextMenu={disableRightClick}
    >
      {data.map((product) => (
        <CartItem
          key={product.id}
          product={product}
          sessionId={sessionId}
          onAddToCart={handleAddToCart}
          disabled={cartLoading}
        />
      ))}
    </div>
  )
}

export default ItemsList
