// CartItem.jsx
import React, { useEffect } from 'react'
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
import { useProductStockRecords } from './hooks/useProductStockRecords'

const Items = ({ product, onAddToCart, disabled }) => {
  const { fetchPrice, price } = useProductPrice()
  const { fetchAvailability, availability } = useProductAvailability()
  const { fetchStockRecords } = useProductStockRecords()

  useEffect(() => {
    const fetchDetails = async () => {
      await fetchPrice(product.price)
      await fetchAvailability(product.availability)
      await fetchStockRecords(product.stockrecords)
    }

    fetchDetails()
  }, [])

  const handleAddToCart = () => {
    onAddToCart(product, 1)
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
                disabled={disabled}
                variant="outline"
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

export default Items
