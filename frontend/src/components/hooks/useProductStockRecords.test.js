import { renderHook, act } from '@testing-library/react'
import { useProductStockRecords } from './useProductStockRecords.js.bak'

// Mock de la fonction fetch globale
global.fetch = jest.fn()

describe('useProductStockRecords', () => {
  let consoleErrorSpy

  beforeEach(() => {
    jest.clearAllMocks()
    // Créer un nouveau spy pour console.error avant chaque test
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    consoleErrorSpy.mockRestore()
  })

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useProductStockRecords())

    expect(result.current.stockRecords).toBeNull()
    expect(result.current.loading).toBeFalsy()
    expect(result.current.error).toBeNull()
  })

  it('should fetch stock records successfully', async () => {
    const mockData = [
      { id: 1, quantity: 10 },
      { id: 2, quantity: 20 },
    ]
    global.fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockData),
    })

    const { result } = renderHook(() => useProductStockRecords())

    await act(async () => {
      await result.current.fetchStockRecords('https://api.example.com/stock')
    })

    expect(result.current.stockRecords).toEqual(mockData)
    expect(result.current.loading).toBeFalsy()
    expect(result.current.error).toBeNull()
  })

  it('should handle network error when fetching stock records', async () => {
    const networkError = new Error('Network error')
    global.fetch.mockRejectedValueOnce(networkError)

    const { result } = renderHook(() => useProductStockRecords())

    await act(async () => {
      await expect(
        result.current.fetchStockRecords('https://api.example.com/stock'),
      ).rejects.toThrow('Network error')
    })

    expect(result.current.stockRecords).toBeNull()
    expect(result.current.loading).toBeFalsy()
    expect(result.current.error).toBe('Network error')
  })

  it('should set loading state while fetching', async () => {
    global.fetch.mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(() => resolve({ json: () => Promise.resolve([]) }), 100),
        ),
    )

    const { result } = renderHook(() => useProductStockRecords())

    act(() => {
      result.current.fetchStockRecords('https://api.example.com/stock')
    })

    expect(result.current.loading).toBeTruthy()

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 150))
    })

    expect(result.current.loading).toBeFalsy()
  })

  it('should reset error state before new fetch', async () => {
    global.fetch
      .mockRejectedValueOnce(new Error('First error'))
      .mockResolvedValueOnce({ json: () => Promise.resolve([]) })

    const { result } = renderHook(() => useProductStockRecords())

    await act(async () => {
      await expect(
        result.current.fetchStockRecords('https://api.example.com/stock'),
      ).rejects.toThrow('First error')
    })

    expect(result.current.error).toBe('First error')

    await act(async () => {
      await result.current.fetchStockRecords('https://api.example.com/stock')
    })

    expect(result.current.error).toBeNull()
  })
})
