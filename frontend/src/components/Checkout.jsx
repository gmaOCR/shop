import React, { useState, useEffect } from 'react'
import CustomButton from './CustomButton'
import { useCartContext } from './context/CartContext'
import CartItemLine from './CartItemLine'
import { ShippingAddress } from './ShippingAddress'
import { CartItemSkeleton } from './skeletons/CartItemLineSkeleton'
import { ShippingAddressFormSkeleton } from './skeletons/ShippingAddressFormSkeleton'
import { useCountries } from './hooks/useCountries'

function Checkout() {
  const {
    cart,
    lines,
    loading: { full: fullLoading, linesLoaded },
  } = useCartContext()

  const [initialLoadComplete, setInitialLoadComplete] = useState(false)
  const { loading, error } = useCountries()

  useEffect(() => {
    if (linesLoaded && !fullLoading) {
      setInitialLoadComplete(true)
    }
  }, [linesLoaded, fullLoading])

  const hasItems = lines && lines.length > 0

  const renderLoadingSkeleton = () => (
    <>
      <ShippingAddressFormSkeleton />
      <CartItemSkeleton />
      <CartItemSkeleton />
    </>
  )

  const renderCartItems = () => (
    <>
      {lines.map((line) => (
        <CartItemLine key={line.url} line={line} />
      ))}
      {cart && (
        <div className="mt-4">
          <h3 className="text-xl font-bold">
            Total: <span>{cart.currency}</span> {cart.total_incl_tax}
          </h3>
        </div>
      )}
    </>
  )

  const handleCheckout = () => {
    console.log('Commande finalisée')
    // Ajouter ici la logique de finalisation de la commande
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Checkout</h2>
      {!initialLoadComplete || loading ? (
        renderLoadingSkeleton()
      ) : linesLoaded ? (
        hasItems ? (
          <>
            <ShippingAddress />
            {renderCartItems()}
          </>
        ) : (
          <p>Votre panier est vide.</p>
        )
      ) : (
        <p>Impossible de charger le contenu du panier.</p>
      )}
      <CustomButton
        onClick={handleCheckout}
        texte="Calculer les frais de port"
        variant="outline"
        disabled={!initialLoadComplete || !hasItems || loading}
      />
    </div>
  )
}

export default Checkout
