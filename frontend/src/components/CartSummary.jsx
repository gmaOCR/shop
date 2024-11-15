import React from 'react'
import { Spinner } from '@radix-ui/themes'

const CartSummary = ({ cart, shippingCost, operationLoading }) => {
  return (
    <div className="mt-4 border-t pt-4">
      <h3 className="text-xl font-bold flex items-center justify-between">
        <span>Sous-total</span>
        <div className="flex items-center">
          <span className="mr-1">{cart.currency}</span>
          {operationLoading ? (
            <Spinner className="inline-block ml-2" />
          ) : (
            <span>{cart.total_incl_tax}</span>
          )}
        </div>
      </h3>
      <h3 className="text-xl font-bold flex items-center justify-between">
        <span>Frais de port</span>
        <div className="flex items-center">
          <span className="mr-1">{cart.currency}</span>
          <span>{shippingCost.toFixed(2)}</span>
        </div>
      </h3>
      <h3 className="text-xl font-bold flex items-center justify-between">
        <span>Total</span>
        <div className="flex items-center">
          <span className="mr-1">{cart.currency}</span>
          {operationLoading ? (
            <Spinner className="inline-block ml-2" />
          ) : (
            <span>
              {(parseFloat(cart.total_incl_tax) + shippingCost).toFixed(2)}
            </span>
          )}
        </div>
      </h3>
    </div>
  )
}

export default CartSummary
