import { renderHook, act } from '@testing-library/react'
import { waitFor } from '@testing-library/react'
import useCartLines from './useCartLines'

// Mock fetch
global.fetch = jest.fn()

describe('useCartLines', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('handles the case when there is no cart correctly', async () => {
    const { result } = renderHook(() => useCartLines(null, 'session-id'))

    expect(result.current.loading).toBe(false)

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.lines).toEqual([])
    expect(result.current.error).toBe(null)
  })

  it('handles the case when there are lines correctly', async () => {
    const mockLines = [{ id: 1, product: 'Product 1' }]
    const mockCart = { lines: 'http://api.com/lines' }
    const mockSessionId = 'test-session-id'

    // Mock de fetch
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockLines),
      }),
    )

    const { result } = renderHook(() => useCartLines(mockCart, mockSessionId))

    // Attendre que le hook termine son exécution
    await waitFor(() => expect(result.current.loading).toBe(false))

    // Vérifier que fetch a été appelé correctement
    expect(global.fetch).toHaveBeenCalledWith('http://api.com/lines', {
      headers: {
        'Session-Id': mockSessionId,
      },
    })

    // Vérifier les résultats
    expect(result.current.lines).toEqual(mockLines)
    expect(result.current.error).toBe(null)
  })

  test('handles the error case correctly', async () => {
    global.fetch.mockRejectedValueOnce(new Error('API Error'))

    const { result } = renderHook(() =>
      useCartLines({ lines: 'http://api.com/lines' }, 'session-id'),
    )

    expect(result.current.loading).toBe(true)

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.lines).toEqual([])
    expect(result.current.error).toBeInstanceOf(Error)
    expect(result.current.error.message).toBe('API Error')
  })
})
