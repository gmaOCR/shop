import { useState } from 'react';

export const useProductApi = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async (url, method = 'GET', body = null) => {
    try {
      setLoading(true);
      setError(null);

      const options = {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
      };

      if (body) {
        options.body = JSON.stringify(body);
      }

      const response = await fetch(url, options);

      if (!response.ok) {
        throw new Error('Failed to fetch');
      }

      const result = await response.json();
      setData(result);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Create (POST)
  const createProduct = async (productData) => {
    const url = '/api/products/';
    return await fetchData(url, 'POST', productData);
  };

  // Read (GET)
  const getProducts = async (productId = null) => {
    const url = productId
      ? `/api/products/${productId}/`
      : '/api/products/';
    return await fetchData(url, 'GET');
  };

  // Update (PUT)
  const updateProduct = async (productId, productData) => {
    const url = `/api/products/${productId}/`;
    return await fetchData(url, 'PUT', productData);
  };

  // Delete (DELETE)
  const deleteProduct = async (productId) => {
    const url = `/api/products/${productId}/`;
    return await fetchData(url, 'DELETE');
  };

  return {
    data,
    loading,
    error,
    createProduct,
    getProducts,
    updateProduct,
    deleteProduct,
  };
};
