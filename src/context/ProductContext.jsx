import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const ProductsContext = createContext();

export function ProductsProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProducts = async (filters = {}) => {
    setLoading(true);
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/products/", {
        params: filters,
      });
      setProducts(res.data.results);
    } catch (err) {
      setError("Failed to fetch products");
    }
    setLoading(false);
  };

  return (
    <ProductsContext.Provider
      value={{ products, setProducts, loading, error, fetchProducts }}
    >
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  return useContext(ProductsContext);
}
