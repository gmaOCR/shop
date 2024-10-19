import React, { useEffect } from 'react'
import Menu from '@/components/Menu'
import ProductCard from '@/components/ProductCard'
import Cart from '@/components/Cart'
import Login from '@/components/Login'
import { useCartContext } from '@/components/context/CartContext'
import { useProducts } from '@/components/hooks/useProducts'

function App() {
  const { cart, handleUpdateCart } = useCartContext()
  const { data: products, loading, error, getProducts } = useProducts()

  useEffect(() => {
    getProducts()
  }, [getProducts])

  if (loading) {
    return <div>Chargement...</div>
  }

  if (error) {
    return <div>Erreur : {error.message}</div>
  }

  return (
    <div className="px-[10%]">
      <Menu />
      <hr />
      {products.map((product) => (
        <ProductCard key={product.id} product={product} disabled={false} />
      ))}
      <hr />
      <Cart cart={cart} />
      <hr />
      <Login />
    </div>
  )
}

export default App
