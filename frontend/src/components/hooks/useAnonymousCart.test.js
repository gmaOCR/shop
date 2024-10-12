import React from 'react'
import { renderHook, act } from '@testing-library/react'
import useAnonymousCart from './useAnonymousCart'

describe('useAnonymousCart', () => {
  beforeEach(() => {
    localStorage.clear()
    jest.resetAllMocks()
  })

  it('should not return an empty cart and loading state initially', () => {
    const { result } = renderHook(() => useAnonymousCart())
    expect(result.current.cart).not.toBeNull()
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it('should create a new cart and store it in local storage', () => {
    const { result } = renderHook(() => useAnonymousCart())
    expect(result.current.cart).not.toBeNull()
    expect(result.current.cart.session_id).not.toBeNull()
    expect(localStorage.getItem('anonymousCartSessionId')).toBe(
      result.current.cart.session_id,
    )
    expect(
      localStorage.getItem(`anonymousCart_${result.current.cart.session_id}`),
    ).not.toBeNull()
  })

  it('should retrieve a stored cart from local storage', () => {
    const sessionId = 'test-session-id'
    const storedCart = {
      items: [],
      user: {},
      created_at: '2022-01-01T00:00:00.000Z',
      updated_at: '2022-01-01T00:00:00.000Z',
      session_id: sessionId,
    }
    localStorage.setItem('anonymousCartSessionId', sessionId)
    localStorage.setItem(
      `anonymousCart_${sessionId}`,
      JSON.stringify(storedCart),
    )

    const { result } = renderHook(() => useAnonymousCart())
    expect(result.current.cart).toEqual(storedCart)
  })

  it('should update the cart and store it in local storage', () => {
    const { result } = renderHook(() => useAnonymousCart())
    const updatedCart = {
      ...result.current.cart,
      items: [{ id: 1, name: 'Test item' }],
    }
    act(() => {
      result.current.saveCart(updatedCart)
    })
    expect(
      localStorage.getItem(`anonymousCart_${updatedCart.session_id}`),
    ).toEqual(JSON.stringify(updatedCart))
  })

  it('should handle errors when retrieving or updating the cart', () => {
    const error = new Error('Test error')
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw error
    })

    const { result } = renderHook(() => useAnonymousCart())
    expect(result.current.error).toBe(error.message)
  })
})
