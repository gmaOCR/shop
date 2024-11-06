import React, { useState, useEffect } from 'react'
import CustomButton from './CustomButton'
import { useCartContext } from './context/CartContext'
import CartItemLine from './CartItemLine'
import { ShippingAddress } from './ShippingAddress'
import { CartItemSkeleton } from './skeletons/CartItemLineSkeleton'
import { ShippingAddressFormSkeleton } from './skeletons/ShippingAddressFormSkeleton'
import { useCountries } from './hooks/useCountries'
import { Spinner } from '@radix-ui/themes'

function Checkout() {
  const {
    cart,
    fetchLines,
    lines,
    loading: {
      cart: cartLoading,
      lines: linesLoading,
      operation: operationLoading,
      isLoading,
    },
    error,
  } = useCartContext()
  const [initialLoadComplete, setInitialLoadComplete] = useState(false)
  const { loading: countriesLoading, error: countriesError } = useCountries()
  const [shippingCost, setShippingCost] = useState(0)

  useEffect(() => {
    if (!cartLoading && !linesLoading) {
      setInitialLoadComplete(true)
    }
  }, [cartLoading, linesLoading])

  useEffect(() => {
    fetchLines()
  }, [fetchLines])

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
      <div className="mt-4">
        {cart && (
          <>
            <h3 className="text-xl font-bold flex items-center">
              Sous-total: <span className="ml-1">{cart.currency}</span>
              {operationLoading ? (
                <Spinner className="inline-block ml-2" />
              ) : (
                <span className="ml-2">{cart.total_incl_tax}</span>
              )}
            </h3>
            <h3 className="text-xl font-bold flex items-center">
              Frais de port: <span className="ml-1">{cart.currency}</span>
              <span className="ml-2">{shippingCost.toFixed(2)}</span>
            </h3>
            <h3 className="text-xl font-bold flex items-center">
              Total: <span className="ml-1">{cart.currency}</span>
              {operationLoading ? (
                <Spinner className="inline-block ml-2" />
              ) : (
                <span className="ml-2">
                  {(parseFloat(cart.total_incl_tax) + shippingCost).toFixed(2)}
                </span>
              )}
            </h3>
          </>
        )}
      </div>
    </>
  )

  const handleShippingChange = (cost) => {
    setShippingCost(parseFloat(cost))
  }

  const handleCheckout = () => {
    console.log('Commande finalisée')
    // Ajouter ici la logique de finalisation de la commande
  }

  if (error || countriesError) {
    return (
      <div className="p-4 text-red-600">
        Une erreur est survenue lors du chargement des données.
      </div>
    )
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Checkout</h2>

      {(!initialLoadComplete || countriesLoading) && renderLoadingSkeleton()}

      {initialLoadComplete && !countriesLoading && (
        <>
          {hasItems ? (
            <>
              <ShippingAddress onShippingChange={handleShippingChange} />
              {renderCartItems()}
            </>
          ) : (
            <p>Votre panier est vide.</p>
          )}
        </>
      )}

      <CustomButton
        onClick={handleCheckout}
        texte="Calculer les frais de port"
        variant="outline"
        disabled={
          !initialLoadComplete || !hasItems || countriesLoading || isLoading
        }
      />
    </div>
  )
}

export default Checkout
