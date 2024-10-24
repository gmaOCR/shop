import React, { createContext, useContext, useEffect, useState } from 'react'
import useCart from '../hooks/useCart'
import useCartLines from '../hooks/useCartLines'

const CartContext = createContext()

export const useCartContext = () => useContext(CartContext)

export const CartProvider = ({ children }) => {
  const {
    cart,
    error: cartError,
    loading: cartLoading,
    updateCart,
    fetchCart,
    getSessionId,
  } = useCart()
  const {
    lines,
    loading: linesLoading,
    error: linesError,
    linesLoaded,
    updateLineQuantity,
    deleteLine,
    fetchLines,
  } = useCartLines(cart, getSessionId)

  const [fullLoading, setFullLoading] = useState(true)

  useEffect(() => {
    fetchCart()
  }, [])

  useEffect(() => {
    if (cart?.id) {
      fetchLines()
    }
  }, [cart?.lines])

  useEffect(() => {
    setFullLoading(cartLoading || linesLoading || !linesLoaded)
  }, [cartLoading, linesLoading, linesLoaded])

  return (
    <CartContext.Provider
      value={{
        cart,
        lines,
        loading: {
          cart: cartLoading,
          lines: linesLoading,
          linesLoaded,
          full: fullLoading,
        },
        error: cartError || linesError,
        updateCart,
        fetchCart,
        fetchLines,
        updateLineQuantity,
        deleteLine,
        getSessionId,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}
