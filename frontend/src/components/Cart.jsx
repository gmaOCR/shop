import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import CustomButton from './CustomButton'
import ConfirmPopup from './ConfirmPopup'
import CartItemLine from './CartItemLine'
import { useCartContext } from './context/CartContext'
import { Spinner } from '@radix-ui/themes'

function Cart() {
  const {
    cart,
    lines,
    loading: { cart: cartLoading, lines: linesLoading, isLoading },
    error,
    updateLineQuantity,
    deleteLine,
    clearCart,
    fetchLines,
  } = useCartContext()

  useEffect(() => {
    if (cart?.id) {
      fetchLines()
    }
  }, [cart, fetchLines])

  const navigate = useNavigate()

  const handleClearCart = () => {
    clearCart()
  }

  const handleShipping = () => {
    navigate('/shipping')
  }

  if (error) {
    return (
      <div>
        Une erreur s'est produite lors de la récupération des lignes du panier.
      </div>
    )
  }

  const isInitialLoading = cartLoading && !cart

  return (
    <div className="p-4">
      {/* {cart && <div>Cart id: {cart.id}</div>} */}
      <div className="flex gap-2 items-center mb-4">
        <h2 className="text-xl font-bold">Votre panier</h2>
        {lines.length > 0 ? (
          <ConfirmPopup
            open={false}
            onConfirm={handleClearCart}
            textUser={`Êtes-vous sûr de vouloir supprimer votre panier ?`}
            textButton="Vider le panier"
          />
        ) : (
          ''
        )}
      </div>
      <div className="min-h-[100px]">
        {isInitialLoading ? (
          <div className="flex items-center justify-center h-full">
            <Spinner size="2" />
          </div>
        ) : lines.length > 0 ? (
          <div>
            <ul className="mb-4">
              {lines.map((line) => (
                <CartItemLine
                  key={line.url}
                  line={line}
                  onUpdateQuantity={updateLineQuantity}
                  onRemove={deleteLine}
                />
              ))}
            </ul>
            <div className="text-right">
              <CustomButton
                onClick={handleShipping}
                texte="Aller à la caisse"
                variant="outline"
              ></CustomButton>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p>Le panier est vide.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Cart
