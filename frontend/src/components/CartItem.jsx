// CartItem.jsx
import React from 'react'
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

const CartItem = ({ product, onAddToCart, disabled }) => {
  const handleAddToCart = () => {
    onAddToCart(product)
  }

  return (
    <Card className="flex flex-col justify-between">
      <CardHeader>
        <CardTitle>{product.name}</CardTitle>
        <CardDescription>{product.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center items-center">
        <img
          className="max-w-[200px] max-h-[200px] object-contain rounded-md"
          src={product.image}
          alt={product.name}
        />
      </CardContent>
      <CardFooter className="flex justify-evenly">
        <p>Price: {product.price}€</p>
        <CustomButton
          onClick={handleAddToCart}
          IconComponent={PlusCircledIcon}
          disabled={disabled}
        />
      </CardFooter>
    </Card>
  )
}

export default CartItem
