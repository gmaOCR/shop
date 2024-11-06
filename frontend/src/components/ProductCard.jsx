import React, { useEffect, useState, useCallback } from 'react'
import {
  Card,
  CardTitle,
  CardDescription,
  CardContent,
  CardHeader,
  CardFooter,
} from '@/components/ui/card'
import CustomButton from './CustomButton'
import { PlusCircledIcon, CheckIcon } from '@radix-ui/react-icons'
import { useProductPrice } from './hooks/useProductPrice'
import { useProductAvailability } from './hooks/useProductAvailability'
import { useCartContext } from './context/CartContext'
import { Spinner } from '@radix-ui/themes'

const ProductCard = ({ product }) => {
  const { fetchPrice, price, currency } = useProductPrice()
  const { fetchAvailability, availability } = useProductAvailability()
  const { updateCart, lines } = useCartContext()
  const [error, setError] = useState(null)
  const [isInCart, setIsInCart] = useState(false)

  useEffect(() => {
    const fetchDetails = async () => {
      if (!product || !product.id) {
        setError('Produit invalide ou ID manquant')
        return
      }

      try {
        await fetchPrice(product.price)
        await fetchAvailability(product.availability)
      } catch (error) {
        console.error(
          'Erreur lors de la récupération des détails du produit:',
          error,
        )
        setError('Impossible de charger les détails du produit')
      }
    }

    fetchDetails()
  }, [product])

  useEffect(() => {
    const checkIfInCart = () => {
      const productInCart = lines?.some((item) => item.product === product?.url)
      setIsInCart(!!productInCart)
    }

    checkIfInCart()
  }, [lines, product?.url])

  const handleAddToCart = useCallback(async () => {
    try {
      await updateCart(product, 1)
      setIsInCart(true)
    } catch (error) {
      console.error("Erreur lors de l'ajout au panier:", error)
      setError("Impossible d'ajouter au panier")
    }
  }, [product, updateCart])

  if (!product) {
    return <div role="alert">Produit non disponible</div>
  }

  if (error) {
    return <div role="alert">{error}</div>
  }

  return (
    <Card className="flex flex-col justify-between" role="article">
      <CardHeader>
        <CardTitle role="heading" aria-level="2">
          {product.title}
        </CardTitle>
        <CardDescription role="contentinfo">
          {product.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center items-center">
        {product.images && product.images[0] && (
          <img
            className="max-w-[200px] max-h-[200px] object-contain rounded-md"
            src={product.images[0].original}
            alt={product.title}
            role="img"
          />
        )}
      </CardContent>
      <CardFooter className="flex justify-evenly">
        {availability ? (
          availability.isAvailable ? (
            <>
              <p role="status" aria-label={`Price: ${price} ${currency}`}>
                Price: {price}
                <span> {currency}</span>
              </p>
              <p role="status" aria-label={availability.message}>
                {availability.message}
              </p>

              <CustomButton
                key={`add-to-cart-${product.id}`}
                onClick={handleAddToCart}
                IconComponent={isInCart ? CheckIcon : PlusCircledIcon}
                disabled={isInCart}
                variant={isInCart ? 'secondary' : 'outline'}
                aria-label={
                  isInCart ? 'Produit dans le panier' : 'Ajouter au panier'
                }
                role="button"
              >
                {isInCart ? 'Dans le panier' : 'Ajouter au panier'}
              </CustomButton>
            </>
          ) : (
            <p role="status" aria-label="Unavailable">
              Unavailable
            </p>
          )
        ) : (
          <div
            role="status"
            className="flex items-center justify-center h-full"
          >
            <Spinner size="2" />
          </div>
        )}
      </CardFooter>
    </Card>
  )
}

export default ProductCard
