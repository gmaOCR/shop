// ProductCard.jsx
import React, { useEffect, useState } from 'react'
import {
  Card,
  CardTitle,
  CardDescription,
  CardContent,
  CardHeader,
  CardFooter,
} from '@/components/ui/card'
import CustomButton from './CustomButton'
import { PlusCircledIcon } from '@radix-ui/react-icons'
import { useProductPrice } from './hooks/useProductPrice'
import { useProductAvailability } from './hooks/useProductAvailability'
import { useCartContext } from './context/CartContext'

const ProductCard = ({ product }) => {
  const { fetchPrice, price, currency } = useProductPrice()
  const { fetchAvailability, availability } = useProductAvailability()
  const { updateCart, lines } = useCartContext()

  useEffect(() => {
    const fetchDetails = async () => {
      await fetchPrice(product.price)
      await fetchAvailability(product.availability)
    }

    fetchDetails()
  }, [product.id])

  const handleAddToCart = async () => {
    try {
      await updateCart(product, 1)
    } catch (error) {
      console.error("Erreur lors de l'ajout au panier:", error)
    }
  }

  const isInCart = lines.some((item) => {
    const itemProductId = item.product.split('/').slice(-2, -1)[0]

    return itemProductId === product.id.toString()
  })

  if (!product) {
    return <div>Produit non disponible</div>
  }

  return (
    <Card className="flex flex-col justify-between">
      <CardHeader>
        <CardTitle>{product.title}</CardTitle>
        <CardDescription>{product.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center items-center">
        <img
          className="max-w-[200px] max-h-[200px] object-contain rounded-md"
          src={product.images[0].original}
          alt={product.title}
        />
      </CardContent>
      <CardFooter className="flex justify-evenly">
        {availability ? (
          availability.isAvailable ? (
            <>
              <p>
                Price: {price}
                <span> {currency}</span>
              </p>
              <p>{availability.message}</p>

              <CustomButton
                onClick={handleAddToCart}
                IconComponent={PlusCircledIcon}
                disabled={isInCart}
                variant={'outline'}
              />
            </>
          ) : (
            <p>Unavailable</p>
          )
        ) : (
          <p>Loading...</p>
        )}
      </CardFooter>
    </Card>
  )
}

export default ProductCard
