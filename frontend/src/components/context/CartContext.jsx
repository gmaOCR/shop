import React, { createContext, useContext, useState, useEffect } from 'react'
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
    updateLineQuantity,
    deleteLine,
    fetchLines,
  } = useCartLines(cart, getSessionId)

  const [total, setTotal] = useState(0)

  useEffect(() => {
    fetchCart()
  }, [fetchCart])

  useEffect(() => {
    if (cart && cart.lines) {
      fetchLines()
    }
  }, [cart?.id, fetchLines])

  // useEffect(() => {
  //   console.debug('CartContext - cart:', cart)
  //   console.debug('CartContext - lines:', lines)
  //   console.debug('CartContext - cartLoading:', cartLoading)
  //   console.debug('CartContext - linesLoading:', linesLoading)
  //   console.debug('CartContext - cartError:', cartError)
  //   console.debug('CartContext - linesError:', linesError)
  // }, [cart, lines, cartLoading, linesLoading, cartError, linesError])

  useEffect(() => {
    if (lines) {
      const newTotal = lines.reduce(
        (sum, line) => sum + line.price * line.quantity,
        0,
      )
      setTotal(newTotal)
    }
  }, [lines])

  return (
    <CartContext.Provider
      value={{
        cart,
        lines,
        loading: cartLoading || linesLoading,
        error: cartError || linesError,
        total,
        updateCart,
        fetchCart,
        updateLineQuantity,
        deleteLine,
        getSessionId,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}
