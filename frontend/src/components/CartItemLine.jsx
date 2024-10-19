import React from 'react'
import { useQuery } from '@tanstack/react-query'
import CustomButton from './CustomButton'
import { MinusIcon, PlusIcon, TrashIcon } from '@radix-ui/react-icons'
import { fetchProduct, fetchStockRecord } from '@/services/api'

const CartItemLine = ({ line, onUpdateQuantity, onRemove }) => {
  const productId = line.product.split('/').filter(Boolean).pop()
  const stockrecordId = line.stockrecord.split('/').filter(Boolean).pop()

  const { data: product, isLoading: productLoading } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => fetchProduct(productId),
  })

  const { data: stockrecord, isLoading: stockLoading } = useQuery({
    queryKey: ['stockrecord', productId, stockrecordId],
    queryFn: () => fetchStockRecord(productId, stockrecordId),
  })

  if (productLoading || stockLoading) {
    return <div>Loading...</div>
  }
  const handleIncrement = () => {
    if (
      line.quantity <
      stockrecord?.num_in_stock - stockrecord?.num_allocated
    ) {
      onUpdateQuantity(line.url, line.quantity + 1)
    }
  }

  const handleDecrement = () => {
    if (line.quantity > 1) {
      onUpdateQuantity(line.url, line.quantity - 1)
    }
  }

  const handleRemove = () => {
    onRemove(line.url)
  }

  return (
    <div className="flex justify-between items-center p-4 border-b">
      <div className="flex-grow">
        <h3 className="font-bold">{product?.title}</h3>
        <p>Quantity: {line.quantity}</p>
        <p>
          P.u.: {stockrecord.price} {line.price_currency}
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
