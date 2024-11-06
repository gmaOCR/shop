import { renderHook, act } from '@testing-library/react'
import { useProductAvailability } from './useProductAvailability'

// Mock fetch globally
global.fetch = jest.fn()

describe('useProductAvailability', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  let consoleErrorSpy

  beforeEach(() => {
    jest.clearAllMocks()
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    consoleErrorSpy.mockRestore()
  })

  it('should initialize with null availability, no loading, and no error', () => {
    const { result } = renderHook(() => useProductAvailability())

    expect(result.current.availability).toBeNull()
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it('should fetch availability successfully', async () => {
    const mockData = {
      is_available_to_buy: true,
      message: 'Product is available',
    }

    global.fetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(mockData),
    })

    const { result } = renderHook(() => useProductAvailability())

    await act(async () => {
      await result.current.fetchAvailability('http://example.com/availability')
    })

    expect(result.current.loading).toBe(false)
    expect(result.current.availability).toEqual({
      isAvailable: true,
      message: 'Product is available',
    })
    expect(result.current.error).toBeNull()
    expect(global.fetch).toHaveBeenCalledWith(
      'http://example.com/availability',
      { method: 'GET' },
    )
  })

  it('should handle fetch error', async () => {
    const errorMessage = 'Network error'
    global.fetch.mockRejectedValueOnce(new Error(errorMessage))

    const { result } = renderHook(() => useProductAvailability())

    await act(async () => {
      await result.current.fetchAvailability('http://example.com/availability')
    })

    expect(result.current.loading).toBe(false)
    expect(result.current.availability).toBeNull()
    expect(result.current.error).toBe(errorMessage)
  })
})
