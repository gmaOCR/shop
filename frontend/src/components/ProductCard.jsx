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
  const { fetchPrice, price } = useProductPrice()
  const { fetchAvailability, availability } = useProductAvailability()
  const { cart, updateCart } = useCartContext()
  const [isAdding, setIsAdding] = useState(false)

  useEffect(() => {
    const fetchDetails = async () => {
      await fetchPrice(product.price)
      await fetchAvailability(product.availability)
    }

    fetchDetails()
  }, [])

  const handleAddToCart = async () => {
    setIsAdding(true)
    try {
      await updateCart(product, 1)
    } catch (error) {
      console.error("Erreur lors de l'ajout au panier:", error)
    } finally {
      setIsAdding(false)
    }
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
              <p>Price: {price}€</p>
              <p>{availability.message}</p>
              <CustomButton
                onClick={handleAddToCart}
                IconComponent={PlusCircledIcon}
                disabled={isAdding}
                variant={'outline'}
              />
              {isAdding ? 'Ajout en cours...' : ''}
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
