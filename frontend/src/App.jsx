// App.jsx
import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Menu from '@/components/Menu'
import Cart from '@/components/Cart'
import Login from '@/components/Login'
import Checkout from '@/components/Checkout'
import { useCartContext } from '@/components/context/CartContext'
import ProductList from '@/components/ProductList'

function App() {
  const { cart, handleUpdateCart } = useCartContext()

  return (
    <Router>
      <div className="px-[10%]">
        <Menu />
        <hr />
        <Routes>
          <Route
            path="/"
            element={
              <>
                <ProductList cart={cart} handleUpdateCart={handleUpdateCart} />
                <hr />
                <Cart cart={cart} />
              </>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/checkout" element={<Checkout />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
