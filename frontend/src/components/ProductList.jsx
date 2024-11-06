import React from 'react'
import ProductCard from '@/components/ProductCard'
import { useProducts } from './context/ProductsContext'

const ProductList = () => {
  const { products, loading, error } = useProducts()

  if (loading) return <div>Loading products...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
      {products.length === 0 ? (
        <div>No products found</div>
      ) : (
        products.map((product) => (
          <ProductCard key={product.id} product={product} isLoading={false} />
        ))
      )}
    </div>
  )
}

export default ProductList
