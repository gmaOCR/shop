import { useEffect, useState } from 'react'
import Menu from 'components/Menu'
import ItemList from 'components/ItemsList'
import Cart from './components/Cart'

function App() {
  const [message, setMessage] = useState('')

  const savedCart = localStorage.getItem('cart')
  const [cartItems, updateCart] = useState(
    savedCart ? JSON.parse(savedCart) : [],
  )
  useEffect(() => {
    console.log('État du panier mis à jour:', cartItems)
    localStorage.setItem('cart', JSON.stringify(cartItems))
  }, [cartItems])

  const disableRightClick = (event) => {
    event.preventDefault()
  }

  useEffect(() => {
    fetch('/api/hello/')
      .then((response) => response.json())
      .then((data) => setMessage(data.message))
      .catch((error) => console.error('Error fetching message:', error))
  }, [])

  return (
    <div>
      <Menu />
      <ItemList
        disableRightClick={disableRightClick}
        updateCart={updateCart}
        cartItems={cartItems}
      />
      <Cart cartItems={cartItems} updateCart={updateCart} />
    </div>
  )
}

export default App
