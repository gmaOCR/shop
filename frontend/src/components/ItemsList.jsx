import React from 'react'
import {
  Card,
  CardTitle,
  CardDescription,
  CardContent,
  CardHeader,
  CardFooter,
} from 'components/ui/card'
import CustomButton from './Button'
import { PlusCircledIcon } from '@radix-ui/react-icons'
import candlesList from '../datas/candles'

function ItemsList({ cartItems, updateCart }) {
  function addToCart(item) {
    const { id, price } = item
    console.log('Item ajouté:', item)

    updateCart((prevItems) => {
      const existingItem = prevItems.find((i) => i.id === id)

      if (existingItem) {
        return prevItems.map((i) =>
          i.id === id
            ? {
                ...i,
                quantity: (existingItem.quantity || 0) + 1,
                totalPrice: (existingItem.totalPrice || 0) + price,
              }
            : i,
        )
      }

      const newItem = { ...item, quantity: 1, totalPrice: price }
      console.log("Ajout d'un nouvel élément:", newItem)
      return [...prevItems, newItem]
    })
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-[10%]">
      {candlesList.map((candle) => (
        <Card key={candle.id} className="flex flex-col justify-between">
          <CardHeader>
            <CardTitle>{candle.name}</CardTitle>
            <CardDescription>{candle.description}</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center items-center">
            <img
              className="max-w-[200px] max-h-[200px] object-contain rounded-md"
              src={candle.image}
              alt={candle.name}
            />
          </CardContent>
          <CardFooter className="flex justify-evenly">
            <p>Price: {candle.price}€</p>
            <CustomButton
              onClick={() => addToCart(candle)}
              IconComponent={PlusCircledIcon}
            />
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

export default ItemsList
