import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react'
import useCart from '@/components/hooks/useCart'

const CartContext = createContext()

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([])
  const [loading, setLoading] = useState(true)
  const { fetchCart } = useCart()

  const loadCart = useCallback(async () => {
    if (loading) return
    setLoading(true)
    try {
      const cartData = await fetchCart()
      setCart(cartData)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [fetchCart, loading])

  useEffect(() => {
    loadCart()
  }, [loadCart])

  const handleUpdateCart = (product, quantity) => {
    setCart((prevCart) => {
      if (!Array.isArray(prevCart)) return [product]

      const existingProductIndex = prevCart.findIndex(
        (item) => item.id === product.id,
      )

      if (existingProductIndex !== -1) {
        const updatedCart = [...prevCart]
        updatedCart[existingProductIndex].quantity += quantity
        return updatedCart
      } else {
        return [...prevCart, { ...product, quantity }]
      }
    })
  }

  return (
    <CartContext.Provider value={{ cart, handleUpdateCart }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCartContext = () => useContext(CartContext)
