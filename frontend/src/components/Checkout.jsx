import React from 'react'
import { useLocation } from 'react-router-dom'
import CustomButton from './CustomButton'
import { PlusIcon, MinusIcon } from '@radix-ui/react-icons'

function Checkout() {
  const location = useLocation()
  const { cart } = location.state || { cart: { items: [] } }

  const [checkoutCart, setCheckoutCart] = React.useState(cart)

  const handleQuantityChange = (itemId, change) => {
    setCheckoutCart((prevCart) => ({
      ...prevCart,
      items: prevCart.items.map((item) =>
        item.product.id === itemId
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item,
      ),
    }))
  }

  const calculateTotal = () => {
    return checkoutCart.items
      .reduce(
        (total, item) => total + Number(item.product.price) * item.quantity,
        0,
      )
      .toFixed(2)
  }

  const formatPrice = (price) => Number(price).toFixed(2)

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Checkout</h2>
      {checkoutCart.items.map((item) => (
        <div
          key={item.product.id}
          className="mb-4 flex justify-between items-center"
        >
          <div>
            <h3 className="font-semibold">{item.product.name}</h3>
            <p>Prix unitaire: {formatPrice(item.product.price)}€</p>
            <p>Description: {item.product.description}</p>
          </div>
          <div className="flex items-center">
            <CustomButton
              onClick={() => handleQuantityChange(item.product.id, -1)}
              IconComponent={MinusIcon}
              className="mr-2"
              variant="outline"
            />
            <span>{item.quantity}</span>
            <CustomButton
              onClick={() => handleQuantityChange(item.product.id, 1)}
              IconComponent={PlusIcon}
              className="ml-2"
              variant="outline_grey"
            />
            <span className="font-bold ml-4">
              {formatPrice(Number(item.product.price) * item.quantity)} €
            </span>
          </div>
        </div>
      ))}
      <div className="mt-4">
        <h3 className="text-xl font-bold">Total: {calculateTotal()} €</h3>
        {/* Ici, vous pouvez ajouter le calcul des frais de livraison */}
      </div>
      <CustomButton
        onClick={() => {
          /* Gérer la finalisation de la commande */
        }}
        className="bg-green-500 text-white px-4 py-2 rounded mt-4"
      >
        Finaliser la commande
      </CustomButton>
    </div>
  )
}

export default Checkout
