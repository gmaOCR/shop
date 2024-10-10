import React from 'react'
import CustomButton from './Button'
import { Cross2Icon } from '@radix-ui/react-icons'

function Cart({ cart, updateCart }) {
  if (!cart || !cart.items || cart.items.length === 0) {
    return <div>Your cart is empty</div>
  }
  console.log('Cart:', JSON.stringify(cart, null, 2))

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">Votre panier</h2>
      <p>Session ID: {cart.session_id}</p>

      {cart.items && cart.items.length > 0 ? (
        <ul>
          {cart.items.map((item) => (
            <li key={item.id}>
              {item.name} - Prix: {item.price} € - Quantité: {item.quantity}
            </li>
          ))}
        </ul>
      ) : (
        <p>Le panier est vide.</p>
      )}

      <CustomButton
        onClick={() => updateCart({ ...cart, items: [] })}
        IconComponent={Cross2Icon}
      >
        Vider le panier
      </CustomButton>
    </div>
  )
}

export default Cart
