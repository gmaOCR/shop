import React from 'react'
import CustomButton from './CustomButton'
import ConfirmPopup from './ConfirmPopup'
import CartItemLine from './CartItemLine'
import { useCartContext } from './context/CartContext'

function Cart() {
  const {
    cart,
    lines,
    loading,
    error,
    total,
    updateLineQuantity,
    deleteLine,
    updateCart,
  } = useCartContext()

  if (loading) {
    return (
      <div>
        {cart ? <div>Cart ID: {cart?.id}</div> : <div>No cart available</div>}
        Chargement des lignes...
      </div>
    )
  }

  if (error) {
    return (
      <div>
        Une erreur s'est produite lors de la récupération des lignes du panier.
      </div>
    )
  }

  if (!cart || !cart.id) {
    return <div>Panier non présent</div>
  }

  if (!lines || lines.length === 0) {
    return <div>Cart ID: {cart?.id} Votre panier est vide</div>
  }

  const handleClearCart = () => {
    updateCart({ ...cart, lines: [] })
  }

  const handleCheckout = () => {
    // Logique pour le checkout
    console.debug('Checkout initiated')
  }

  try {
    return (
      <div className="p-4">
        Cart id: {cart.id}
        <div className="flex gap-2 items-center mb-4">
          <h2 className="text-xl font-bold">Votre panier</h2>
          <ConfirmPopup
            open={false}
            onConfirm={handleClearCart}
            textUser={`Êtes-vous sûr de vouloir supprimer votre panier ?`}
            textButton="Vider le panier"
          />
        </div>
        {lines.length > 0 ? (
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
            <div className="text-right mb-4">
              <span className="font-bold text-lg">Total: {total} €</span>
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
