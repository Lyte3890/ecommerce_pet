// VITE_API_URL = https://swagger.store.skuriatin.com
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const fetchProducts = async () => {
  try {
    const response = await fetch(`${API_URL}/api/v1/products`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error during product loading:", error);
    return []; 
  }
};

export const fetchCategories = async () => {
  try {
    const response = await fetch(`${API_URL}/api/v1/categories`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error during cataolog loading:", error);
    return [];
  }
};

export const fetchProductById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/api/v1/products/${id}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error during product loading ${id}:`, error);
    return null;
  }
};