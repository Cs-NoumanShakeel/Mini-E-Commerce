import "../styles/itemcard.css";
import { useUserType } from "../context/UserTypeContext";
import { useOrder } from "../context/OrderContext";
import axios from "axios";
import { ACCESS_TOKEN } from "../constants";

export default function ItemCard({ product, refreshProducts }) {
  const { userType } = useUserType();
  const { orders, setorders } = useOrder();
  const isPrivileged = userType === "admin" || userType === "staff";
  const API_BASE = "http://localhost:8000/api";

  const token = localStorage.getItem(ACCESS_TOKEN);
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const addToCart = () => {
    const exists = orders.some((item) => item.id === product.id);
    if (!exists) setorders([...orders, product]);
    alert("Order added to Cart");
  };

  const handleAddStock = async () => {
    const confirm = window.confirm("Add 1 unit to stock?");
    if (!confirm) return;

    try {
      await axios.patch(
        `${API_BASE}/products/${product.id}/update/`,
        { stock: product.stock + 1 },
        config
      );
      alert("Stock increased!");
      refreshProducts();
    } catch (err) {
      alert("Error increasing stock.");
      console.error(err);
    }
  };

  const handleDelete = async () => {
  const reduce = window.confirm("Do you want to reduce stock by 1?");
  if (reduce) {
    try {
      await axios.patch(
        `${API_BASE}/products/${product.id}/update/`,
        { stock: product.stock - 1 },
        config
      );
      alert("✅ Stock reduced by 1.");
      refreshProducts();
    } catch (err) {
      alert("❌ Error reducing stock.");
      console.error(err);
    }
    return;
  }

  // If user didn't confirm stock reduction, ask about deletion
  const del = window.confirm("Do you want to delete the product completely?");
  if (!del) return;

  try {
    await axios.delete(`${API_BASE}/products/${product.id}/delete/`, config);
    alert("🗑️ Product deleted.");
    refreshProducts();
  } catch (err) {
    alert("❌ Error deleting product.");
    console.error(err);
  }
};


  const handleUpdate = async () => {
    const newName = window.prompt("Enter new name:", product.name);
    const newPrice = window.prompt("Enter new price:", product.price);

    if (newName === null || newPrice === null) return;

    try {
      await axios.patch(
        `${API_BASE}/products/${product.id}/update/`,
        {
          name: newName,
          price: parseFloat(newPrice),
        },
        config
      );
      alert("Product updated!");
      refreshProducts();
    } catch (err) {
      alert("Error updating product.");
      console.error(err);
    }
  };

  return (
    <div className="item-card" key={product.id}>
      <img src={product.image} className="item-poster" alt={product.name} />

      <div className="item-overlay">
        <div className="button-group">
          <button className="cart-button" onClick={addToCart}>🛒</button>

          {isPrivileged && (
            <>
              <button className="add-button" onClick={handleAddStock}>➕</button>
              <button className="delete-button" onClick={handleDelete}>🗑️</button>
              <button className="update-button" onClick={handleUpdate}>🔄</button>
            </>
          )}
        </div>
      </div>

      <div className="item-info">
        <h3>{product.name}</h3>
        <p>{product.description}</p>
        <p><strong>${product.price}</strong></p>
        <p><strong>Stock: {product.stock}</strong></p>
      </div>
    </div>
  );
}
