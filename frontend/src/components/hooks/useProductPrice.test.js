import { renderHook, act } from '@testing-library/react'
import { useProductPrice } from './useProductPrice'

describe('useProductPrice', () => {
  let originalFetch

  beforeEach(() => {
    originalFetch = global.fetch
    global.fetch = jest.fn()
  })

  afterEach(() => {
    global.fetch = originalFetch
  })

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useProductPrice())

    expect(result.current.price).toBeNull()
    expect(result.current.loading).toBeFalsy()
    expect(result.current.error).toBeNull()
  })

  it('should fetch price successfully', async () => {
    const mockPrice = 19.99
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ incl_tax: mockPrice }),
    })

    const { result } = renderHook(() => useProductPrice())

    await act(async () => {
      result.current.fetchPrice('http://example.com/price')
    })

    expect(result.current.price).toBe(mockPrice)
    expect(result.current.loading).toBeFalsy()
    expect(result.current.error).toBeNull()
  })

  it('should handle network errors', async () => {
    const errorMessage = 'Network error'
    global.fetch.mockRejectedValueOnce(new Error(errorMessage))

    const { result } = renderHook(() => useProductPrice())

    await act(async () => {
      result.current.fetchPrice('http://example.com/price')
    })

    expect(result.current.price).toBeNull()
    expect(result.current.loading).toBeFalsy()
    expect(result.current.error).toBe(errorMessage)
  })

  it('should handle non-ok responses', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      statusText: 'Not Found',
    })

    const { result } = renderHook(() => useProductPrice())

    await act(async () => {
      result.current.fetchPrice('http://example.com/price')
    })

    expect(result.current.price).toBeNull()
    expect(result.current.loading).toBeFalsy()
    expect(result.current.error).toBeTruthy()
  })
})
