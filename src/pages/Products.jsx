import { useState, useEffect } from "react";
import { useProducts } from "../context/ProductContext";
import ItemCard from "../components/itemCard";
import Navbar from "../components/Navbar";
import "../styles/Product.css";
import { useUserType } from "../context/UserTypeContext";

export default function Products() {
  const [query, setQuery] = useState("");
  const [price, setPrice] = useState("");
  const [ordering, setOrdering] = useState("");

  const { userType } = useUserType();
  const { products, loading, error, fetchProducts } = useProducts();

  useEffect(() => {
  
    fetchProducts(); 
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProducts({
      search: query,
      price,
      ordering,
    });
  };

  return (
    <>
      <Navbar />
      <div className="product">
        <form className="search-form" onSubmit={handleSearch}>
  <input
    className="search-input"
    placeholder="Search"
    value={query}
    onChange={(e) => setQuery(e.target.value)}
  />
  <input
    type="number"
    className="filter-input"
    placeholder="Filter by price"
    value={price}
    onChange={(e) => setPrice(e.target.value)}
  />
  <select
    className="filter-select"
    value={ordering}
    onChange={(e) => setOrdering(e.target.value)}
  >
    <option value="">-- Order By --</option>
    <option value="price">Price (Low → High)</option>
    <option value="-price">Price (High → Low)</option>
  </select>
  <button className="search-button" type="submit">
    Search
  </button>
</form>


        {error && <div className="error">{error}</div>}
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="item-grid">
            {products.map((product) => (
              <ItemCard
                key={product.id}
                product={product}
                refreshProducts={fetchProducts}
                showAdminControls={userType === "admin" || userType === "staff"}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
