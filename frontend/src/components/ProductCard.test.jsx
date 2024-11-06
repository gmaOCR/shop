import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import ProductCard from './ProductCard'
import { CartProvider } from './context/CartContext'
import * as useProductPrice from './hooks/useProductPrice'
import * as useProductAvailability from './hooks/useProductAvailability'

// Mock des hooks personnalisés
jest.mock('./hooks/useProductPrice')
jest.mock('./hooks/useProductAvailability')

const renderProductCard = (product, cartContext) => {
  return render(
    <CartProvider value={cartContext}>
      <ProductCard product={product} />
    </CartProvider>,
  )
}

describe('ProductCard', () => {
  const mockProduct = {
    id: 1,
    title: 'Test Product',
    description: 'Test Description',
    price: 10.99,
    images: [{ original: 'test-image.jpg' }],
    availability: true,
  }


  beforeEach(() => {
    useProductPrice.useProductPrice.mockReturnValue({
      fetchPrice: jest.fn(),
      price: '10.99',
      currency: 'EUR',
    })

    useProductAvailability.useProductAvailability.mockReturnValue({
      fetchAvailability: jest.fn(),
      availability: {
        isAvailable: true,
        message: 'In Stock',
      },
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renders product details correctly', () => {
    renderProductCard(mockProduct)

    // Test des éléments avec leurs rôles ARIA
    expect(screen.getByRole('article')).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { level: 2, name: 'Test Product' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('contentinfo')).toHaveTextContent(
      'Test Description',
    )
    expect(
      screen.getByRole('img', { name: 'Test Product' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('status', { name: /Price: 10.99 EUR/ }),
    ).toBeInTheDocument()
    expect(screen.getByRole('status', { name: 'In Stock' })).toBeInTheDocument()
  })

  it('handles add to cart action', async () => {
    const mockUpdateCart = jest.fn()
    const mockCartContext = {
      updateCart: mockUpdateCart,
      lines: [],
    }

    renderProductCard(mockProduct, mockCartContext)

    const addButton = screen.getByRole('button', { name: 'Add to cart' })
    fireEvent.click(addButton)

    await waitFor(() => {
      expect(mockUpdateCart).toHaveBeenCalledWith(mockProduct, 1)
    })
  })

  it('disables add button when product is already in cart', () => {
    const mockCartContext = {
      updateCart: jest.fn(),
      lines: [
        {
          product: `/api/products/${mockProduct.id}/`,
          quantity: 1,
        },
      ],
    }

    renderProductCard(mockProduct, mockCartContext)

    const addButton = screen.getByRole('button', { name: 'Add to cart' })
    expect(addButton).toBeDisabled()
  })

  it('shows loading state while fetching product details', () => {
    useProductAvailability.useProductAvailability.mockReturnValueOnce({
      fetchAvailability: jest.fn(),
      availability: null,
    })

    renderProductCard(mockProduct)

    expect(
      screen.getByRole('status', { name: 'Loading product' }),
    ).toBeInTheDocument()
  })

  it('shows error state when product is unavailable', () => {
    useProductAvailability.useProductAvailability.mockReturnValueOnce({
      fetchAvailability: jest.fn(),
      availability: {
        isAvailable: false,
        message: 'Unavailable',
      },
    })

    renderProductCard(mockProduct)

    expect(
      screen.getByRole('status', { name: 'Unavailable' }),
    ).toBeInTheDocument()
  })

  it('handles missing product data', () => {
    renderProductCard(null)
    expect(screen.getByRole('alert')).toHaveTextContent(
      'Produit non disponible',
    )
  })

  it('handles cart update with loading state', async () => {
    const mockUpdateCart = jest.fn(
      () => new Promise((resolve) => setTimeout(resolve, 1000)),
    )
    const mockCartContext = {
      updateCart: mockUpdateCart,
      lines: [],
    }

    renderProductCard(mockProduct, mockCartContext)

    const addButton = screen.getByRole('button', { name: 'Add to cart' })
    fireEvent.click(addButton)

    expect(addButton).toBeDisabled()

    await waitFor(() => {
      expect(mockUpdateCart).toHaveBeenCalled()
    })
  })
})
