import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { useCartContext } from './context/CartContext'
import CartItemLine from './CartItemLine'
import CustomButton from './CustomButton'
import { ShippingAddress } from './ShippingAddress'
import { CartItemSkeleton } from './skeletons/CartItemLineSkeleton'
import { ShippingAddressFormSkeleton } from './skeletons/ShippingAddressFormSkeleton'
import { fetchCountries, fetchShippingMethods } from '../services/api'
import { useCreateOrder } from './hooks/useCreateOrder'
import CartSummary from './CartSummary'

function Shipping() {
  const {
    cart,
    fetchLines,
    lines,
    loading: {
      cart: cartLoading,
      lines: linesLoading,
      operation: operationLoading,
    },
    error,
  } = useCartContext()
  const { createOrder } = useCreateOrder()

  // États pour les pays et méthodes d'expédition
  const [countries, setCountries] = useState([])
  const [shippingMethods, setShippingMethods] = useState([])
  const [countriesLoading, setCountriesLoading] = useState(true)
  const [countriesError, setCountriesError] = useState(null)

  const [initialLoadComplete, setInitialLoadComplete] = useState(false)
  const [shippingCost, setShippingCost] = useState(0)
  const [shippingData, setShippingData] = useState(null)

  // Chargement des pays et méthodes d'expédition
  useEffect(() => {
    const loadCountriesAndShippingMethods = async () => {
      if (!cart) {
        setCountriesLoading(false)
        return
      }

      try {
        setCountriesLoading(true)
        // Chargement des pays via la méthode mise à jour dans api.js
        const loadedCountries = await fetchCountries(cart)
        setCountries(loadedCountries)

        // Chargement des méthodes d'expédition via la méthode mise à jour dans api.js
        const loadedShippingMethods = await fetchShippingMethods(cart)
        setShippingMethods(loadedShippingMethods)

        setCountriesError(null)
      } catch (error) {
        console.error('Erreur de chargement', error)
        setCountriesError(error)
        setCountries([])
        setShippingMethods([])
      } finally {
        setCountriesLoading(false)
      }
    }

    loadCountriesAndShippingMethods()
  }, [cart])

  // Gestion du chargement initial
  useEffect(() => {
    // Vérifiez que tous les chargements principaux sont terminés
    if (!cartLoading && !linesLoading && !countriesLoading) {
      setInitialLoadComplete(true)
    }
  }, [cartLoading, linesLoading, countriesLoading])

  // Chargement des lignes du panier si nécessaire
  useEffect(() => {
    if (!lines.length) {
      fetchLines()
    }
  }, [fetchLines, lines.length])

  // Memoization des items du panier
  const cartItems = useMemo(
    () => lines.map((line) => <CartItemLine key={line.url} line={line} />),
    [lines],
  )

  // Gestion du checkout
  const handleCheckout = useCallback(async () => {
    // Récupération des données depuis le localStorage
    const savedFormData = JSON.parse(
      localStorage.getItem('shippingFormData') || '{}',
    )
    const savedCountry = localStorage.getItem('selectedCountry')
    const savedShipping = localStorage.getItem('selectedShipping')

    // Combiner les données
    const shippingData = {
      ...savedFormData,
      country: savedCountry || savedFormData.country,
      shipping: savedShipping || savedFormData.shipping,
    }

    // Vérification des données essentielles
    if (!lines || lines.length === 0) {
      console.error('Votre panier est vide')
      alert('Votre panier est vide')
      return
    }

    // Validation plus précise du formulaire de livraison
    const requiredFields = [
      'first_name',
      'last_name',
      'guest_email',
      'line1',
      'postcode',
      'country',
      'phone_number',
      'shipping',
    ]

    const missingFields = requiredFields.filter(
      (field) => !shippingData?.[field] || shippingData[field].trim() === '',
    )

    if (missingFields.length > 0) {
      console.error(
        `Veuillez remplir tous les champs obligatoires : ${missingFields.join(', ')}`,
      )
      alert(
        `Veuillez remplir tous les champs obligatoires : ${missingFields.join(', ')}`,
      )
      return
    }

    try {
      const orderData = {
        shipping_address: {
          first_name: shippingData.first_name,
          last_name: shippingData.last_name,
          guest_email: shippingData.guest_email,
          line1: shippingData.line1,
          line2: shippingData.line2 || '',
          line4: shippingData.line4 || shippingData.city || '',
          postcode: shippingData.postcode,
          country: shippingData.country,
          phone_number: shippingData.phone_number,
        },
        shipping_method: shippingData.shipping,
        basket: cart.url,
        total: parseFloat(cart.total_incl_tax) + shippingCost,
      }

      // Ajouter des logs de débogage
      console.log('Order Data:', orderData)

      const response = await createOrder(orderData)

      if (response.payment_url) {
        window.location.href = response.payment_url
      } else {
        console.info('Commande créée avec succès')
        alert('Commande créée avec succès')
        // Optionnellement, nettoyer le localStorage après la commande
        localStorage.removeItem('shippingFormData')
        localStorage.removeItem('selectedCountry')
        localStorage.removeItem('selectedShipping')
      }
    } catch (error) {
      // Gestion plus détaillée des erreurs
      console.error('Erreur lors du passage de commande', error)

      if (error.response) {
        // L'erreur vient de la réponse du serveur
        alert(
          error.response.data.detail ||
            'Une erreur est survenue lors du passage de commande',
        )
      } else if (error.request) {
        // La requête a été faite mais pas de réponse
        alert('Pas de réponse du serveur. Veuillez réessayer.')
      } else {
        // Erreur lors de la configuration de la requête
        alert('Erreur de configuration. Veuillez contacter le support.')
      }
    }
  }, [shippingCost, cart, lines, createOrder])

  // Gestion des erreurs
  if (error || countriesError) {
    return (
      <div className="p-4 text-red-600">
        Une erreur est survenue lors du chargement des données.
        {countriesError && <p>{countriesError.message}</p>}
      </div>
    )
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Checkout</h2>

      {/* Condition de chargement modifiée */}
      {!initialLoadComplete ? (
        <>
          <ShippingAddressFormSkeleton />
          <CartItemSkeleton />
          <CartItemSkeleton />
        </>
      ) : (
        <>
          {lines.length > 0 ? (
            <>
              <ShippingAddress
                onShippingChange={(cost) => setShippingCost(parseFloat(cost))}
                onShippingData={(data) => {
                  setShippingData(data)
                  const selectedShippingMethod = shippingMethods.find(
                    (method) => method.code === data.shipping,
                  )
                  if (selectedShippingMethod) {
                    setShippingCost(
                      parseFloat(selectedShippingMethod.price.incl_tax),
                    )
                  }
                }}
              />
              {cartItems}

              {cart && (
                <CartSummary
                  cart={cart}
                  shippingCost={shippingCost}
                  operationLoading={operationLoading}
                />
              )}

              <div className="mt-4">
                <CustomButton
                  onClick={handleCheckout}
                  texte="Finaliser la commande et passer au paiement"
                  variant="outline"
                />
              </div>
            </>
          ) : (
            <p>Votre panier est vide.</p>
          )}
        </>
      )}
    </div>
  )
}

export default Shipping
