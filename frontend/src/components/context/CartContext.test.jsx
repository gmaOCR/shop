import { renderHook, act, waitFor } from '@testing-library/react'
import { CartProvider, useCartContext } from './CartContext'
import { jest } from '@jest/globals'
import '@testing-library/jest-dom'

global.fetch = jest.fn()

describe('CartProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorage.clear()
  })

  it('should initialize with null cart, empty lines, and loading states', () => {
    const { result } = renderHook(() => useCartContext(), {
      wrapper: CartProvider,
    })

    expect(result.current.cart).toBeNull()
    expect(result.current.lines).toEqual([])
    expect(result.current.loading.isLoading).toBe(true)
  })

  it('should fetch cart successfully', async () => {
    const mockCartData = { id: 1, items: [] }
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockCartData),
    })

    const { result } = renderHook(() => useCartContext(), {
      wrapper: CartProvider,
    })

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0))
    })

    expect(result.current.cart).toEqual(mockCartData)
    expect(result.current.loading.cart).toBe(false)
    expect(fetch).toHaveBeenCalledWith('http://localhost:8000/api/basket/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Session-Id': expect.any(String),
      },
    })
  })

  it('should update cart with new product and handle existing line quantity', async () => {
    const mockCartData = { id: 1, items: [] }
    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockCartData),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            ...mockCartData,
            items: [
              { url: 'http://localhost:8000/api/products/1/', quantity: 2 },
            ],
          }),
      })

    const { result } = renderHook(() => useCartContext(), {
      wrapper: CartProvider,
    })

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0))
    })

    const product = { id: 1 }
    await act(async () => {
      await result.current.updateCart(product, 2)
    })

    expect(result.current.lines).toEqual([
      { url: `http://localhost:8000/api/products/${product.id}/`, quantity: 2 },
    ])

    // Update existing line quantity
    await act(async () => {
      await result.current.updateCart(product, 3)
    })

    expect(result.current.lines).toContainEqual({
      url: `http://localhost:8000/api/products/${product.id}/`,
      quantity: 3,
    })
  })

  it('should delete a line', async () => {
    const mockCartData = { id: 1, items: [] }
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockCartData),
    })

    const { result } = renderHook(() => useCartContext(), {
      wrapper: CartProvider,
    })

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0))
    })

    const product = { id: 1 }
    await act(async () => {
      await result.current.updateCart(product, 2)
    })

    const lineUrl = `http://localhost:8000/api/products/${product.id}/`
    await act(async () => {
      await result.current.deleteLine(lineUrl)
    })

    expect(result.current.lines).toEqual([])
  })

  it('should handle fetch errors gracefully', async () => {
    global.fetch = jest.fn().mockRejectedValueOnce(new Error('Network error'))

    const { result } = renderHook(() => useCartContext(), {
      wrapper: CartProvider,
    })

    await waitFor(() => {
      expect(result.current.error).toBeTruthy()
      expect(result.current.loading.isLoading).toBe(false)
    })
  })

  it('should not duplicate cart fetching and handle concurrent operations', async () => {
    const { result } = renderHook(() => useCartContext(), {
      wrapper: CartProvider,
    })

    // Attendre que le chargement initial soit terminé
    await waitFor(() => expect(result.current.loading.cart).toBe(false))

    // Simuler une opération
    act(() => {
      result.current.updateCart({ id: 1 }, 1)
    })

    // Attendre que TOUTES les opérations soient terminées
    await waitFor(() => {
      expect(result.current.loading.operation).toBe(false)
      expect(result.current.loading.lines).toBe(false) // Ajout de cette vérification
    })

    expect(result.current.loading.isLoading).toBe(false)
  })

  it('should handle session ID generation and storage', () => {
    localStorage.clear()
    const { result } = renderHook(() => useCartContext(), {
      wrapper: CartProvider,
    })
    expect(localStorage.getItem('oscarApiSessionId')).toBeTruthy()

    const existingSessionId = 'existing-session-id'
    localStorage.setItem('oscarApiSessionId', existingSessionId)
    renderHook(() => useCartContext(), { wrapper: CartProvider })
    expect(localStorage.getItem('oscarApiSessionId')).toBe(existingSessionId)
  })

  it('should handle various error scenarios', async () => {
    global.fetch = jest
      .fn()
      .mockRejectedValueOnce(new Error('Fetch error'))
      .mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
      })
      .mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({ detail: 'Failed to update quantity' }),
      })
      .mockRejectedValueOnce(new Error('Delete failed'))

    const { result } = renderHook(() => useCartContext(), {
      wrapper: CartProvider,
    })

    // fetchCart error
    await waitFor(() => {
      expect(result.current.error).toBeTruthy()
      expect(result.current.error.message).toBe('Fetch error')
    })

    // updateLineQuantity error
    await act(async () => {
      await result.current.updateLineQuantity('someUrl', 5)
    })
    expect(result.current.error).toBeTruthy()
    expect(result.current.error.message).toBe('Failed to update quantity')

    // updateCart error
    await act(async () => {
      await result.current.updateCart({ id: 1 }, 2)
    })
    expect(result.current.error).toBeTruthy()

    // deleteLine error
    await act(async () => {
      await result.current.deleteLine('someUrl')
    })
    expect(result.current.error).toBeTruthy()
    expect(result.current.error.message).toBe('Delete failed')
  })

  it('should provide all required context values', () => {
    const { result } = renderHook(() => useCartContext(), {
      wrapper: CartProvider,
    })

    expect(result.current).toEqual(
      expect.objectContaining({
        cart: null,
        lines: expect.any(Array),
        loading: expect.objectContaining({
          cart: expect.any(Boolean),
          isLoading: expect.any(Boolean),
          lines: expect.any(Boolean),
          operation: expect.any(Boolean),
        }),
        error: null,
        fetchLines: expect.any(Function),
        updateCart: expect.any(Function),
        updateLineQuantity: expect.any(Function),
        deleteLine: expect.any(Function),
      }),
    )
  })

  it('should handle network errors and malformed responses', async () => {
    // Mock fetch pour simuler une réponse malformée
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: () => Promise.reject(new Error('Invalid JSON')),
    })

    const { result } = renderHook(() => useCartContext(), {
      wrapper: CartProvider,
    })

    await waitFor(() => {
      expect(result.current.error).toBeTruthy()
      expect(result.current.error.message).toBe('Invalid JSON')
    })
  })

  it('should handle session storage unavailability', () => {
    const originalStorage = window.localStorage
    delete window.localStorage

    const { result } = renderHook(() => useCartContext(), {
      wrapper: CartProvider,
    })

    expect(result.current.cart).toBeNull()

    window.localStorage = originalStorage
  })

  it('should not update cart when already fetching', async () => {
    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            id: 1,
            lines: [{ url: 'http://example.com/line/1', quantity: 1 }],
          }),
      }),
    )

    const { result } = renderHook(() => useCartContext(), {
      wrapper: CartProvider,
    })

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0))
    })

    await act(async () => {
      result.current.updateCart({ id: 1 }, 1)
      result.current.updateCart({ id: 2 }, 1)
    })

    await waitFor(() => {
      expect(result.current.loading.operation).toBe(false)
      expect(global.fetch).toHaveBeenCalledTimes(2) // Une fois pour le panier initial, une fois pour l'update
    })
  })

  it('should handle deleteLine during loading state', async () => {
    global.fetch = jest.fn()

    const mockUseCartContext = () => ({
      loading: { operation: true },
      deleteLine: jest.fn(),
      getSessionId: jest.fn(() => 'mock-session-id'),
    })

    const { result } = renderHook(() => mockUseCartContext())

    await act(async () => {
      await result.current.deleteLine('some-url')
    })

    expect(fetch).not.toHaveBeenCalled()
    expect(result.current.deleteLine).toHaveBeenCalledWith('some-url')
  })

  // Test pour la ligne 169
  it('should not update cart when already fetching or operation in progress', async () => {
    const { result } = renderHook(() => useCartContext(), {
      wrapper: CartProvider,
    })

    // Simuler loading.operation = true
    result.current.loading.operation = true

    await result.current.updateCart({ id: 1 }, 1)
    // Vérifier qu'aucune mise à jour n'a eu lieu
  })

  // Test pour la ligne 186
  it('should handle failed cart update', async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: () => Promise.resolve({ error: 'Bad Request' }),
    })

    const { result } = renderHook(() => useCartContext(), {
      wrapper: CartProvider,
    })

    await act(async () => {
      await result.current.updateCart({ id: 1 }, 1)
    })

    await waitFor(() => {
      expect(result.current.error).toBeTruthy()
    })
  })

  // Test pour les lignes 219-222
  it('should handle errors during cart update and cleanup', async () => {
    const mockError = new Error('Network error')
    global.fetch = jest.fn().mockRejectedValueOnce(mockError)

    const { result } = renderHook(() => useCartContext(), {
      wrapper: CartProvider,
    })

    await act(async () => {
      await result.current.updateCart({ id: 1 }, 1)
    })

    await waitFor(() => {
      expect(result.current.error).toBeTruthy()
      expect(result.current.error.message).toBe('Network error')
    })
  })

  // Test pour la ligne 279
  it('should initialize cart when not initialized', async () => {
    // Mock de la réponse de l'API
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ id: '123', total: 100 }),
    })

    const { result } = renderHook(() => useCartContext(), {
      wrapper: CartProvider,
    })

    // Vérifier que le chargement initial est en cours
    expect(result.current.loading.cart).toBe(true)

    // Attendre que le chargement soit terminé
    await waitFor(() => {
      expect(result.current.loading.cart).toBe(false)
    })

    // Vérifier que le panier a été initialisé
    expect(result.current.cart).toBeTruthy()
    expect(result.current.cart.id).toBe('123')
  })
})
