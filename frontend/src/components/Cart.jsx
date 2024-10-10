import React from 'react'
import CustomButton from './CustomButton'
import { Cross2Icon, PlusIcon, MinusIcon } from '@radix-ui/react-icons'
import ConfirmPopup from './ConfirmPopup'

function Cart({ cart, saveCart }) {
  if (!cart || !cart.items || cart.items.length === 0) {
    return <div>Votre panier est vide</div>
  }
  console.debug('Cart:', cart)

  const handleClearCart = () => {
    saveCart({ ...cart, items: [] })
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

  const handleIncrementQuantity = (itemId) => {
    const updatedCart = { ...cart }
    const itemIndex = updatedCart.items.findIndex(
      (item) => item.product.id === itemId,
    )
    if (itemIndex !== -1) {
      updatedCart.items[itemIndex].quantity += 1
      saveCart(updatedCart)
    }
  }

  const handleDecrementQuantity = (itemId) => {
    const updatedCart = { ...cart }
    const itemIndex = updatedCart.items.findIndex(
      (item) => item.product.id === itemId,
    )
    if (itemIndex !== -1 && updatedCart.items[itemIndex].quantity > 1) {
      updatedCart.items[itemIndex].quantity -= 1
      saveCart(updatedCart)
    }
  }

  const handleDeleteItem = (itemId) => {
    const updatedCart = { ...cart }
    const itemIndex = updatedCart.items.findIndex(
      (item) => item.product.id === itemId,
    )
    if (itemIndex !== -1) {
      updatedCart.items.splice(itemIndex, 1)
      saveCart(updatedCart)
    }
  }

  return (
    <div className="p-4">
      <div className="flex gap-2 items-center mb-4">
        <h2 className="text-xl font-bold">Votre panier</h2>
        <CustomButton
          onClick={handleClearCart}
          className="mt-4"
          texte="Vider le panier"
        ></CustomButton>
      </div>
      {cart.session_id && <p className="mb-2">Session ID: {cart.session_id}</p>}

      {cart.items && cart.items.length > 0 ? (
        <div>
          <ul className="mb-4">
            {cart.items.map((item) => (
              <li
                key={item.product.id}
                className="mb-2 flex justify-between items-center"
              >
                <ConfirmPopup
                  open={false}
                  onClose={() => console.log('Annuler')}
                  onConfirm={() => handleDeleteItem(item.product.id)}
                  itemId={item.product.id}
                  itemName={item.product.name}
                ></ConfirmPopup>
                <div>
                  <span className="font-semibold">{item.product.name}</span> -
                  P.u.: {formatPrice(item.product.price)}€ - Quantité:{' '}
                  {item.quantity}
                </div>
                <div className="flex items-center">
                  <CustomButton
                    onClick={() => handleDecrementQuantity(item.product.id)}
                    IconComponent={MinusIcon}
                    className="mr-2"
                  />
                  <CustomButton
                    onClick={() => handleIncrementQuantity(item.product.id)}
                    IconComponent={PlusIcon}
                    className="ml-2"
                  />
                  <span className="font-bold ml-4">
                    {formatPrice(Number(item.product.price) * item.quantity)} €
                  </span>
                </div>
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
    </div>
  )
}

export default Cart
