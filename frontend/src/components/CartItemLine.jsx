// Version actuelle simplifiée et optimisée
import React from 'react'
import { useQuery } from '@tanstack/react-query'
import CustomButton from './CustomButton'
import { MinusIcon, PlusIcon, TrashIcon } from '@radix-ui/react-icons'
import { fetchStockRecord } from '@/services/api'
import { useProducts } from './context/ProductsContext'
import { useCartContext } from './context/CartContext'

const CartItemLine = ({ line }) => {
  const productId =
    line.product && typeof line.product === 'string'
      ? line.product.split('/').filter(Boolean).pop()
      : null

  const stockrecordId =
    line.stockrecord && typeof line.stockrecord === 'string'
      ? line.stockrecord.split('/').filter(Boolean).pop()
      : null

  const { products } = useProducts()
  const {
    updateLineQuantity,
    deleteLine,
    loading: { operation: operationLoading },
  } = useCartContext()
  const { cart } = useCartContext()
  const product = products.find((p) => p.id === parseInt(productId))

  const { data: stockrecord, isLoading: stockLoading } = useQuery({
    queryKey: ['stockrecord', productId, stockrecordId],
    queryFn: () => fetchStockRecord(cart, productId, stockrecordId),
    enabled: !!productId && !!stockrecordId,
  })

  if (!line || stockLoading) {
    return <div>Loading...</div>
  }

  const handleIncrement = () => {
    if (
      line.quantity <
      stockrecord?.num_in_stock - stockrecord?.num_allocated
    ) {
      updateLineQuantity(line.url, line.quantity + 1)
    }
  }

  const handleDecrement = () => {
    if (line.quantity > 1) {
      updateLineQuantity(line.url, line.quantity - 1)
    }
  }

  return (
    <div className="flex justify-between items-center p-4 border-b">
      <div className="flex-grow">
        <h3 className="font-bold">{product?.title}</h3>
        <p>
          P.u. {line.price_currency} {stockrecord.price}
        </p>
      </div>
      <div className="flex items-center space-x-2">
        <CustomButton
          onClick={handleDecrement}
          IconComponent={MinusIcon}
          disabled={operationLoading || line.quantity <= 1}
          variant="outline"
        />
        <span>{line.quantity}</span>
        <CustomButton
          onClick={handleIncrement}
          IconComponent={PlusIcon}
          disabled={
            operationLoading ||
            line.quantity >=
              stockrecord?.num_in_stock - stockrecord?.num_allocated
          }
          variant="outline"
        />
        <p className="w-[100px]">
          {line.price_currency} {line.price_incl_tax}
        </p>
        <CustomButton
          onClick={() => deleteLine(line.url)}
          IconComponent={TrashIcon}
          disabled={operationLoading}
          variant="outline"
        />
      </div>
    </div>
  )
}

export default CartItemLine
