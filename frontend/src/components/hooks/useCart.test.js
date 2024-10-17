import { renderHook, act } from '@testing-library/react'
import useCart from './useCart'
import 'jest-fetch-mock'

global.fetch = jest.fn()

describe('useCart hook', () => {
  beforeEach(() => {
    localStorage.clear()
    jest.resetAllMocks()
  })
  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should return an initial state with null cart and no error', () => {
    const { result } = renderHook(() => useCart())
    expect(result.current.cart).toBeNull()
    expect(result.current.error).toBeNull()
  })

  it('should use the session ID from local storage', async () => {
    const sessionId = 'test-session-id'
    localStorage.setItem('oscarApiSessionId', sessionId)

    // Mock fetch to return a resolved promise
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ items: [] }),
    })

    const { result } = renderHook(() => useCart())

    await act(async () => {
      await result.current.fetchCart()
    })

    expect(global.fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({
          'Session-Id': sessionId,
        }),
      }),
    )

    localStorage.clear()
  })

  it('should fetch cart data when fetchCart is called', async () => {
    const mockCartData = { items: [] }
    jest.spyOn(global, 'fetch').mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockCartData),
      ok: true,
    })

    const { result } = renderHook(() => useCart())

    await act(async () => {
      await result.current.fetchCart()
    })

    expect(global.fetch).toHaveBeenCalledTimes(1)
    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:8000/api/basket/',
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Session-Id': expect.any(String),
        },
      },
    )

    expect(result.current.cart).toEqual(mockCartData)
  })

  it('should update cart data when updateCart is called', async () => {
    const mockUpdatedCart = { items: [{ id: 1, quantity: 2 }] }
    jest.spyOn(global, 'fetch').mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockUpdatedCart),
      ok: true,
    })

    const { result } = renderHook(() => useCart())

    const product = { id: 1 }
    const quantity = 2

    await act(async () => {
      await result.current.updateCart(product, quantity)
    })

    expect(global.fetch).toHaveBeenCalledTimes(1)
    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:8000/api/basket/add-product/',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': '*/*',
          'Cookie': expect.any(String),
        },
        body: JSON.stringify({
          url: 'http://localhost:8000/api/products/1/',
          quantity: 2,
        }),
      },
    )

    expect(result.current.cart).toEqual(mockUpdatedCart)
  })

  it('should handle errors when fetching cart data', async () => {
    jest
      .spyOn(global, 'fetch')
      .mockImplementation(() => Promise.reject(new Error('API Error')))

    const { result } = renderHook(() => useCart())

    await act(async () => {
      result.current.fetchCart()
      await new Promise((resolve) => setTimeout(resolve, 0))
    })

    expect(result.current.error).toBeDefined()
    expect(result.current.error).toBeInstanceOf(Error)
  })

  it('should handle errors when updating cart data', async () => {
    jest
      .spyOn(global, 'fetch')
      .mockImplementation(() => Promise.reject(new Error('API Error')))

    const { result } = renderHook(() => useCart())

    await act(async () => {
      result.current.updateCart({ id: 1 }, 1)
      await new Promise((resolve) => setTimeout(resolve, 0))
    })

    expect(result.current.error).toBeDefined()
    expect(result.current.error).toBeInstanceOf(Error)

    global.fetch.mockRestore()
  })

  it('should handle network errors when fetching cart', async () => {
    // Mock fetch to simulate a network error
    global.fetch = jest.fn().mockRejectedValue(new Error('Network error'))

    const { result } = renderHook(() => useCart())

    await act(async () => {
      await result.current.fetchCart()
    })

    expect(result.current.error).toBeInstanceOf(Error)
    expect(result.current.error.message).toBe('Network error')
  })

  it('should handle non-ok responses when fetching cart', async () => {
    // Mock fetch to simulate a non-ok response
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 400,
      statusText: 'Bad Request',
    })

    const { result } = renderHook(() => useCart())

    await act(async () => {
      await result.current.fetchCart()
    })

    expect(result.current.error).toBeInstanceOf(Error)
    expect(result.current.error.message).toBe('Network response was not ok')
  })

  it('should handle network errors when updating cart', async () => {
    // Mock fetch to simulate a network error
    global.fetch = jest.fn().mockRejectedValue(new Error('Network error'))

    const { result } = renderHook(() => useCart())

    await act(async () => {
      await result.current.updateCart({ id: 1 }, 2)
    })

    expect(result.current.error).toBeInstanceOf(Error)
    expect(result.current.error.message).toBe('Network error')
  })

  it('should handle non-ok responses when updating cart', async () => {
    // Mock fetch to simulate a non-ok response
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 400,
      statusText: 'Bad Request',
    })

    const { result } = renderHook(() => useCart())

    await act(async () => {
      await result.current.updateCart({ id: 1 }, 2)
    })

    expect(result.current.error).toBeInstanceOf(Error)
    expect(result.current.error.message).toBe('Network response was not ok')
  })

  it('should not fetch cart when already fetching', async () => {
    let resolvePromise
    global.fetch = jest.fn().mockImplementation(
      () =>
        new Promise((resolve) => {
          resolvePromise = resolve
        }),
    )

    const { result } = renderHook(() => useCart())

    act(() => {
      result.current.fetchCart() // Premier appel
    })

    act(() => {
      result.current.fetchCart() // Deuxième appel immédiat
    })

    expect(global.fetch).toHaveBeenCalledTimes(1)

    // Résoudre la promesse pour terminer le test proprement
    resolvePromise({
      ok: true,
      json: () => Promise.resolve({ items: [] }),
    })
  })

  it('should handle network errors', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Network error'))

    const { result } = renderHook(() => useCart())

    await act(async () => {
      await result.current.fetchCart()
    })

    expect(result.current.error).toBeInstanceOf(Error)
    expect(result.current.error.message).toBe('Network error')
  })

  it('should generate a new session ID if not present in localStorage', async () => {
    localStorage.clear()

    // Mock fetch to return a resolved promise
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ items: [] }),
    })

    const { result } = renderHook(() => useCart())

    await act(async () => {
      await result.current.fetchCart()
    })

    expect(localStorage.getItem('oscarApiSessionId')).not.toBeNull()
  })

  it('should use existing session ID from localStorage', async () => {
    const existingSessionId = 'existing-session-id'
    localStorage.setItem('oscarApiSessionId', existingSessionId)

    // Mock fetch to return a resolved promise
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ items: [] }),
    })

    const { result } = renderHook(() => useCart())

    await act(async () => {
      await result.current.fetchCart()
    })

    expect(global.fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({
          'Session-Id': existingSessionId,
        }),
      }),
    )
  })
})
