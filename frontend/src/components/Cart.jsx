import React from 'react'
import CustomButton from './Button'
import { Cross2Icon } from '@radix-ui/react-icons'

function Cart({ cart, updateCart }) {
  if (!cart || !cart.items || cart.items.length === 0) {
    return <div>Your cart is empty</div>
  }
  console.log('Cart:', cart)

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">Votre panier</h2>
      <p>Session ID: {cart.session_id}</p>

      {cart.items && cart.items.length > 0 ? (
        <ul>
          {cart && cart.items && cart.items.length > 1 ? (
            cart.items.map((item, index) => (
              <li key={item.product_id || index}>
                Product ID: {item.product_id}, Quantity: {item.quantity}
              </li>
            ))
          ) : (
            <li>Your cart is empty</li>
          )}
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
