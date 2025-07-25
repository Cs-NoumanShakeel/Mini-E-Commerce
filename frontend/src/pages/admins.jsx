import axios from "axios";
import { useEffect, useState } from "react";
import { ACCESS_TOKEN } from "../constants";
import "../styles/main.css";

export default function Admins() {
  const [orders, setOrders] = useState([]);
  const [next, setNext] = useState(null);
  const [previous, setPrevious] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem(ACCESS_TOKEN);

  const fetchOrders = async (url = "http://localhost:8000/api/orders/") => {
    setLoading(true);
    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (Array.isArray(response.data.results)) {
        setOrders(response.data.results);
        setNext(response.data.next);
        setPrevious(response.data.previous);
      } else {
        console.warn("Unexpected format:", response.data);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/orders/${id}/delete/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const newOrders = orders.filter((order) => order.id !== id);
      setOrders(newOrders);
    } catch (err) {
      alert("Error deleting order: " + err.message);
    }
  };

  return (
    <div className="admin-container">
      <h1>🧾 Admin Orders</h1>

      {loading ? (
        <p>Loading orders...</p>
      ) : orders.length === 0 ? (
        <p>🛑 No orders found</p>
      ) : (
        <>
          {orders.map((order, orderIndex) => {
            const items = order.ordered_items || [];
            const totalPrice = items.reduce((sum, item) => {
              const price = Number(item.product?.price) || 0;
              const quantity = Number(item.quantity) || 0;
              return sum + price * quantity;
            }, 0);

            return (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <p>
                    <strong>Order ID:</strong> {order.id}
                  </p>
                  <p>
                    <strong>User:</strong> {order.username || "Unknown"}
                  </p>
                  <button
                    className="delete-order"
                    onClick={() => handleDelete(order.id)}
                  >
                    🗑️ Delete
                  </button>
                </div>

                <div className="items-row">
                  {items.map((item, index) => {
                    const price = Number(item.price || item.product?.price || 0);
                    const name = item.product?.name || "Unnamed Product";
                    const img = item.product?.image || "/placeholder.jpg";

                    return (
                      <div className="item-card" key={index}>
                        <img
                          src={img}
                          alt={name}
                          className="item-image"
                        />
                        <div className="item-details">
                          <p><strong>{name}</strong></p>
                          <p>Quantity: {item.quantity}</p>
                          <p>Price: ${price.toFixed(2)}</p>
                          <p>Status: {item.status || "N/A"}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <p className="total-price">
                  <strong>Total:</strong> ${totalPrice.toFixed(2)}
                </p>
              </div>
            );
          })}

          {/* Pagination Buttons */}
          <div className="pagination">
            <button
              className="pagination-button"
              onClick={() => fetchOrders(previous)}
              disabled={!previous}
            >
              ⬅️ Previous
            </button>
            <button
              className="pagination-button"
              onClick={() => fetchOrders(next)}
              disabled={!next}
            >
              Next ➡️
            </button>
          </div>
        </>
      )}
    </div>
  );
}
