import { renderHook, act } from '@testing-library/react'
import { useProducts } from './useProducts'

describe('useProducts', () => {
  let originalFetch

  beforeEach(() => {
    originalFetch = global.fetch
    global.fetch = jest.fn()
  })

  afterEach(() => {
    global.fetch = originalFetch
  })

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useProducts())

    expect(result.current.data).toEqual([])
    expect(result.current.loading).toBeFalsy()
    expect(result.current.error).toBeNull()
  })

  it('should fetch products successfully', async () => {
    const mockProducts = [
      { id: 1, name: 'Product 1', url: 'http://example.com/product/1' },
      { id: 2, name: 'Product 2', url: 'http://example.com/product/2' },
    ]

    global.fetch.mockImplementation((url) => {
      if (url === '/api/products/') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockProducts),
        })
      } else {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockProducts.find((p) => p.url === url)),
        })
      }
    })

    const { result } = renderHook(() => useProducts())

    await act(async () => {
      await result.current.getProducts()
    })

    expect(result.current.data).toEqual(mockProducts)
    expect(result.current.loading).toBeFalsy()
    expect(result.current.error).toBeNull()
  })

  it('should handle fetch error', async () => {
    const errorMessage = 'Failed to fetch'
    global.fetch.mockRejectedValueOnce(new Error(errorMessage))

    const { result } = renderHook(() => useProducts())

    await act(async () => {
      await expect(result.current.getProducts()).rejects.toThrow(errorMessage)
    })

    expect(result.current.data).toEqual([])
    expect(result.current.loading).toBeFalsy()
    expect(result.current.error).toBe(errorMessage)
  })

  it('should create a product successfully', async () => {
    const newProduct = { name: 'New Product', price: 9.99 }
    const createdProduct = { id: 3, ...newProduct }

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(createdProduct),
    })

    const { result } = renderHook(() => useProducts())

    let response
    await act(async () => {
      response = await result.current.createProduct(newProduct)
    })

    expect(response).toEqual(createdProduct)
    expect(global.fetch).toHaveBeenCalledWith(
      '/api/products/',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(newProduct),
      }),
    )
  })

  it('should update a product successfully', async () => {
    const updatedProduct = { id: 1, name: 'Updated Product', price: 19.99 }

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(updatedProduct),
    })

    const { result } = renderHook(() => useProducts())

    let response
    await act(async () => {
      response = await result.current.updateProduct(1, updatedProduct)
    })

    expect(response).toEqual(updatedProduct)
    expect(global.fetch).toHaveBeenCalledWith(
      '/api/products/1/',
      expect.objectContaining({
        method: 'PUT',
        body: JSON.stringify(updatedProduct),
      }),
    )
  })
  it('should delete a product successfully', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({}),
    })
    const { result } = renderHook(() => useProducts())
    await act(async () => {
      await result.current.deleteProduct(1)
    })
    expect(global.fetch).toHaveBeenCalledWith(
      '/api/products/1/',
      expect.objectContaining({
        method: 'DELETE',
      }),
    )
  })

  it('should handle error when creating a product', async () => {
    const errorMessage = 'Failed to create product'
    global.fetch.mockRejectedValueOnce(new Error(errorMessage))
    const { result } = renderHook(() => useProducts())
    await act(async () => {
      await expect(
        result.current.createProduct({ name: 'Test' }),
      ).rejects.toThrow(errorMessage)
    })
    expect(result.current.error).toBe(errorMessage)
  })

  it('should handle error when updating a product', async () => {
    const errorMessage = 'Failed to update product'
    global.fetch.mockRejectedValueOnce(new Error(errorMessage))
    const { result } = renderHook(() => useProducts())
    await act(async () => {
      await expect(
        result.current.updateProduct(1, { name: 'Updated' }),
      ).rejects.toThrow(errorMessage)
    })
    expect(result.current.error).toBe(errorMessage)
  })

  it('should handle error when deleting a product', async () => {
    const errorMessage = 'Failed to delete product'
    global.fetch.mockRejectedValueOnce(new Error(errorMessage))
    const { result } = renderHook(() => useProducts())
    await act(async () => {
      await expect(result.current.deleteProduct(1)).rejects.toThrow(
        errorMessage,
      )
    })
    expect(result.current.error).toBe(errorMessage)
  })

  it('should handle network error when fetching products', async () => {
    const networkError = new Error('Network error')
    global.fetch.mockRejectedValueOnce(networkError)

    const { result } = renderHook(() => useProducts())

    await act(async () => {
      await expect(result.current.getProducts()).rejects.toThrow(
        'Network error',
      )
    })

    expect(result.current.data).toEqual([])
    expect(result.current.loading).toBeFalsy()
    expect(result.current.error).toBe('Network error')
  })

  it('should handle non-ok response when fetching products', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
    })

    const { result } = renderHook(() => useProducts())

    await act(async () => {
      await expect(result.current.getProducts()).rejects.toThrow(
        'Failed to fetch',
      )
    })

    expect(result.current.data).toEqual([])
    expect(result.current.loading).toBeFalsy()
    expect(result.current.error).toBe('Failed to fetch')
  })

  it('should handle unexpected error during product operations', async () => {
    const unexpectedError = new Error('Unexpected error')
    global.fetch.mockImplementationOnce(() => {
      throw unexpectedError
    })

    const { result } = renderHook(() => useProducts())

    await act(async () => {
      await expect(result.current.getProducts()).rejects.toThrow(
        'Unexpected error',
      )
    })

    expect(result.current.data).toEqual([])
    expect(result.current.loading).toBeFalsy()
    expect(result.current.error).toBe('Unexpected error')
  })
  it('should handle error when fetching product details during getProducts', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve([{ url: 'https://api.example.com/products/1' }]),
    })

    const error = new Error('Failed to fetch product details')
    global.fetch.mockImplementationOnce(() => Promise.reject(error))

    const { result } = renderHook(() => useProducts())

    await act(async () => {
      await expect(result.current.getProducts()).rejects.toThrow(
        'Failed to fetch product details',
      )
    })

    expect(result.current.loading).toBeFalsy()
    expect(result.current.error).toBe('Failed to fetch product details')
  })
})
