// App.js
import React from 'react'
import Menu from '@/components/Menu'
import ItemList from '@/components/ItemsList'
import Cart from '@/components/Cart'
import useAnonymousCart from '@/components/hooks/useAnonymousCart'

// For dev only
// localStorage.clear()

function App() {
  const { cart, loading, error, saveCart } = useAnonymousCart()

  const handleUpdateCart = (newCart) => {
    saveCart(newCart)
  }

  const disableRightClick = (event) => {
    event.preventDefault()
  }

  if (loading) {
    return <div>Chargement...</div>
  }

  if (error) {
    return <div>Erreur: {error}</div>
  }

  return (
    <div className="px-[10%]">
      <Menu />
      <ItemList
        disableRightClick={disableRightClick}
        saveCart={handleUpdateCart}
        cart={cart}
      />
      <Cart cart={cart} saveCart={handleUpdateCart} />
    </div>
  )
}

export default App
