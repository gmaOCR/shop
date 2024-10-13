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

  const handleCheckout = () => {
    navigate('/checkout', { state: { cart } })
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
  try {
    return (
      <div className="p-4">
        <div className="flex gap-2 items-center mb-4">
          <h2 className="text-xl font-bold">Votre panier</h2>
          <ConfirmPopup
            open={false}
            onConfirm={() => handleClearCart()}
            textUser={`Êtes-vous sûr de vouloir supprimer votre panier ?`}
            textButton="Vider le panier"
          ></ConfirmPopup>
        </div>
        {cart.session_id && (
          <p className="mb-2">Session ID: {cart.session_id}</p>
        )}

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
                    onConfirm={() => handleDeleteItem(item.product.id)}
                    itemId={item.product.id}
                    textUser={`Êtes-vous sûr de vouloir supprimer l'item ${item.product.name} de votre panier ?`}
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
                      variant="outline"
                    />
                    <CustomButton
                      onClick={() => handleIncrementQuantity(item.product.id)}
                      IconComponent={PlusIcon}
                      className="ml-2"
                      variant="outline_grey"
                    />
                    <span className="font-bold ml-4">
                      {formatPrice(Number(item.product.price) * item.quantity)}{' '}
                      €
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
            <div className="text-right">
              <CustomButton
                onClick={handleCheckout}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Valider le panier
              </CustomButton>
            </div>
          </div>
        ) : (
          <p>Le panier est vide.</p>
        )}
      </div>
    )
  } catch (error) {
    console.error('Erreur dans le composant Cart:', error)
    return <div>Une erreur s'est produite lors de l'affichage du panier.</div>
  }
}

export default Cart
