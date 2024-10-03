import React from 'react'
import CustomButton from './Button'
import { Cross2Icon } from '@radix-ui/react-icons'

function Cart({ cartItems, updateCart }) {
  console.log('items here', cartItems)

  const total = cartItems.reduce((acc, item) => acc + (item.totalPrice || 0), 0)

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">Votre panier</h2>
      {cartItems.length === 0 ? (
        <p>Le panier est vide.</p>
      ) : (
        <ul>
          {cartItems.map((item) => (
            <li key={item.id} className="flex justify-between">
              <span>
                {item.name} (x{item.quantity || 1})
              </span>
              <span>{item.totalPrice.toFixed(2)}€</span>{' '}
            </li>
          ))}
        </ul>
      )}
      <h3>Total : {total.toFixed(2)}€</h3>
      <CustomButton
        onClick={() => updateCart([])}
        IconComponent={Cross2Icon}
      ></CustomButton>
    </div>
  )
}

export default Cart
