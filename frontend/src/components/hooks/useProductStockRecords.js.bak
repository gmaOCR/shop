import { useState, useCallback } from 'react'

const fetchData = async (url, method) => {
  try {
    const response = await fetch(url, { method })
    return response.json()
  } catch (error) {
    throw error
  }
}

export const useProductStockRecords = () => {
  const [stockRecords, setStockRecords] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchStockRecords = useCallback(
    async (stockRecordsUrl) => {
      try {
        setLoading(true)
        setError(null)
        const response = await fetchData(stockRecordsUrl, 'GET')
        setStockRecords(response)
        return response
      } catch (err) {
        setError(err.message)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [fetchData],
  )

  return { stockRecords, loading, error, fetchStockRecords }
}
