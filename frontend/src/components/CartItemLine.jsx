import React from 'react'
import { useQuery } from '@tanstack/react-query'
import CustomButton from './CustomButton'
import { MinusIcon, PlusIcon, TrashIcon } from '@radix-ui/react-icons'
import { fetchStockRecord } from '@/services/api'
import { useProducts } from './context/ProductsContext'
import { useCartContext } from './context/CartContext'

const CartItemLine = ({
  line,
  onUpdateQuantity: propOnUpdateQuantity,
  onRemove: propOnRemove,
}) => {
  const productId = line.product.split('/').filter(Boolean).pop()
  const stockrecordId = line.stockrecord.split('/').filter(Boolean).pop()

  const { products } = useProducts()
  const {
    updateLineQuantity: contextUpdateLineQuantity,
    deleteLine: contextDeleteLine,
    fetchCart,
  } = useCartContext()

  const product = products.find((p) => p.id === parseInt(productId))

  const { data: stockrecord, isLoading: stockLoading } = useQuery({
    queryKey: ['stockrecord', productId, stockrecordId],
    queryFn: () => fetchStockRecord(productId, stockrecordId),
  })

  if (!product || stockLoading) {
    return <div>Loading...</div>
  }

  const handleUpdateQuantity = async (newQuantity) => {
    if (propOnUpdateQuantity) {
      await propOnUpdateQuantity(line.url, newQuantity)
    } else {
      await contextUpdateLineQuantity(line.url, newQuantity)
      fetchCart()
    }
  }

  const handleRemove = async () => {
    if (propOnRemove) {
      await propOnRemove(line.url)
    } else {
      await contextDeleteLine(line.url)
      fetchCart()
    }
  }

  const handleIncrement = () => {
    if (
      line.quantity <
      stockrecord?.num_in_stock - stockrecord?.num_allocated
    ) {
      handleUpdateQuantity(line.quantity + 1)
    }
  }

  const handleDecrement = () => {
    if (line.quantity > 1) {
      handleUpdateQuantity(line.quantity - 1)
    }
  }
  return (
    <div className="flex justify-between items-center p-4 border-b">
      <div className="flex-grow">
        <h3 className="font-bold">{product?.title}</h3>
        <p>
          P.u. {stockrecord.price} {line.price_currency}
        </p>
      </div>
      <div className="flex items-center space-x-2">
        <CustomButton
          onClick={handleDecrement}
          IconComponent={MinusIcon}
          disabled={line.quantity <= 1}
          variant="outline"
        />
        <span>{line.quantity}</span>
        <CustomButton
          onClick={handleIncrement}
          IconComponent={PlusIcon}
          disabled={
            line.quantity >=
            stockrecord?.num_in_stock - stockrecord?.num_allocated
          }
          variant="outline"
        />
        <p className="w-[100px]">
          {line.price_incl_tax} {line.price_currency}
        </p>
        <CustomButton
          onClick={handleRemove}
          IconComponent={TrashIcon}
          variant="outline"
        />
      </div>
    </div>
  )
}

export default CartItemLine
