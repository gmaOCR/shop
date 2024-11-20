// App.jsx
import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Menu from '@/components/Menu'
import Cart from '@/components/Cart'
import Login from '@/components/Login'
import Shipping from '@/components/Shipping'
import ProductList from '@/components/ProductList'
import CheckoutForm from '@/components/CheckoutForm'
import CompletePage from '@/components/CompletePage'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
// import { getCSRFToken } from '@/services/utils'

// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
// This is a public sample test API key.
// Don’t submit any personally identifiable information in requests made with this key.
// Sign in to see your own test API key embedded in code samples.
export const stripePromise = loadStripe(
  'pk_test_51QKigELOM2fuF9oiCOXNOo2X5yhgThBhBYLbiz44DZpge8ZkXOC3uJzb8oqGY2z0gY0u922408tm78iGe783sWv6008iO6Uwju',
)

function App() {
  // const [clientSecret, setClientSecret] = useState('')
  // const [dpmCheckerLink, setDpmCheckerLink] = useState('')

  // useEffect(() => {
  //   // Create PaymentIntent as soon as the page loads
  //   const csrfToken = getCSRFToken()
  //   fetch('api-payment/', {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json', 'X-CSRFToken': csrfToken },
  //     body: JSON.stringify({ items: [{ id: 'xl-tshirt', amount: 1000 }] }),
  //   })
  //     .then((res) => res.json())
  //     .then((data) => {
  //       setClientSecret(data.clientSecret)
  //       // [DEV] For demo purposes only
  //       setDpmCheckerLink(data.dpmCheckerLink)
  //     })
  // }, [])

  const appearance = {
    theme: 'stripe',
  }
  // Enable the skeleton loader UI for optimal loading.
  const loader = 'auto'

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
                <ProductList />
                <hr />
                <Cart />
              </>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/shipping" element={<Shipping />} />
          <Route path="/checkout" element={<CheckoutForm />} />
          <Route path="/complete" element={<CompletePage />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
