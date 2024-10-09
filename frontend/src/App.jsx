import { useState, useEffect } from 'react'
import Menu from '@/components/Menu'
import ItemList from '@/components/ItemsList'
import Cart from '@/components/Cart'
import useAnonymousCart from '@/components/hooks/useAnonymousCart'

localStorage.clear()

function App() {
  const { cart, updateCart, loading, error } = useAnonymousCart()

  const disableRightClick = (event) => {
    event.preventDefault()
  }

  useEffect(() => {
    console.log('Cart state changed:', cart)
  }, [cart])

  if (loading) {
    return <div>Chargement...</div>
  }

  if (error) {
    return <div>Erreur: {error}</div>
  }

  return (
    <div>
      <Menu />
      <ItemList
        disableRightClick={disableRightClick}
        updateCart={updateCart}
        cart={cart}
        sessionId={cart ? cart.session_id : null}
      />
      <Cart cart={cart} updateCart={updateCart} />
    </div>
  )
}

export default App
