import React from 'react'
import CustomButton from './Button'
import { Cross2Icon } from '@radix-ui/react-icons'

function Cart({ cart, updateCart }) {
  if (!cart || !cart.items || cart.items.length === 0) {
    return <div>Votre panier est vide</div>
  }
  console.debug('Cart:', cart)

  const handleClearCart = () => {
    updateCart({ ...cart, items: [] })
  }

  const calculateTotal = () => {
    return cart.items
      .reduce(
        (total, item) => total + Number(item.product.price) * item.quantity,
        0,
      )
      .toFixed(2)
  }

  const formatPrice = (price) => {
    return Number(price).toFixed(2)
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Votre panier</h2>
      {cart.session_id && <p className="mb-2">Session ID: {cart.session_id}</p>}

      {cart.items && cart.items.length > 0 ? (
        <div>
          <ul className="mb-4">
            {cart.items.map((item) => (
              <li
                key={item.product.id}
                className="mb-2 flex justify-between items-center"
              >
                <div>
                  <span className="font-semibold">{item.product.name}</span> -
                  Prix unitaire: {formatPrice(item.product.price)} € - Quantité:{' '}
                  {item.quantity}
                </div>
                <span className="font-bold">
                  {formatPrice(Number(item.product.price) * item.quantity)} €
                </span>
              </li>
            ))}
          </ul>
          <div className="text-right mb-4">
            <span className="font-bold text-lg">
              Total: {calculateTotal()} €
            </span>
          </div>
        </div>
      ) : (
        <p>Le panier est vide.</p>
      )}

      <CustomButton
        onClick={handleClearCart}
        IconComponent={Cross2Icon}
        className="mt-4"
      >
        Vider le panier
      </CustomButton>
    </div>
  )
}

export default Cart
