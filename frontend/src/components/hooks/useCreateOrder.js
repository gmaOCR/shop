import { useState } from 'react'
import { API_BASE_URL, getSessionId } from '../../services/api'

export function useCreateOrder() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [orderData, setOrderData] = useState(null)

  const createOrder = async ({
    basket,
    total,
    shipping_method,
    shipping_address,
  }) => {
    setLoading(true)
    setError(null)

    try {
      const requestData = {
        basket: basket,
        total: total,
        shipping_method_code: shipping_method,
        guest_email: shipping_address.guest_email,
        shipping_address: {
          country: shipping_address.country,
          first_name: shipping_address.first_name,
          last_name: shipping_address.last_name,
          line1: shipping_address.line1,
          line2: shipping_address.line2 || '',
          line4: shipping_address.line4 || '',
          postcode: shipping_address.postcode,
          phone_number: shipping_address.phone_number,
        },
      }

      const response = await fetch(`${API_BASE_URL}/checkout/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Session-Id': getSessionId(),
        },
        body: JSON.stringify(requestData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'Failed to create order')
      }

      const data = await response.json()
      data.payment_url = 'http://localhost:5173/api-payment'
      setOrderData(data)
      return data
    } catch (err) {
      setError(err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    createOrder,
    loading,
    error,
    orderData,
  }
}
