import { useEffect, useState, useCallback } from 'react'

const useCartLines = (cart, getSessionId) => {
  const [lines, setLines] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const sessionId = getSessionId()

  const fetchLines = useCallback(async () => {
    const fetchLines = async () => {
      if (!cart || !cart.lines) {
        setLines([])
        setLoading(false)
        return
      }

      try {
        const response = await fetch(cart.lines, {
          headers: {
            'Session-Id': sessionId,
          },
        })

        if (!response) {
          throw new Error('Pas de réponse du serveur')
        }

        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`)
        }

        const data = await response.json()
        setLines(data)
      } catch (error) {
        console.error('Erreur lors de la récupération des lignes:', error)
        setError(error)
        setLines([])
      } finally {
        setLoading(false)
      }
    }

    fetchLines()
  }, [cart, sessionId])

  useEffect(() => {
    fetchLines()
  }, [fetchLines])

  const updateLineQuantity = useCallback(
    async (lineUrl, newQuantity) => {
      setLines((prevLines) =>
        prevLines.map((line) =>
          line.url === lineUrl ? { ...line, quantity: newQuantity } : line,
        ),
      )

      try {
        const response = await fetch(lineUrl, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Session-Id': sessionId,
          },
          body: JSON.stringify({ quantity: newQuantity }),
        })

        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`)
        }

        const updatedLine = await response.json()

        setLines((prevLines) =>
          prevLines.map((line) =>
            line.url === lineUrl ? { ...line, ...updatedLine } : line,
          ),
        )
      } catch (error) {
        console.error('Erreur lors de la mise à jour de la quantité:', error)
        setError(error)
        setLines((prevLines) =>
          prevLines.map((line) =>
            line.url === lineUrl ? { ...line, quantity: line.quantity } : line,
          ),
        )
      }
    },
    [sessionId],
  )

  const deleteLine = useCallback(
    async (lineUrl) => {
      const originalLines = lines
      setLines((prevLines) => prevLines.filter((line) => line.url !== lineUrl))

      try {
        const response = await fetch(lineUrl, {
          method: 'DELETE',
          headers: {
            'Session-Id': sessionId,
          },
        })

        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`)
        }
      } catch (error) {
        console.error('Erreur lors de la suppression de la ligne:', error)
        setError(error)
        setLines(originalLines)
      }
    },
    [sessionId, lines],
  )
  return { lines, loading, error, updateLineQuantity, deleteLine, fetchLines }
}

export default useCartLines
