import { useContext, useState } from "react";
import api from "../api";
import "../styles/cart.css";
import { OrderContext } from "../context/OrderContext";
import { ACCESS_TOKEN } from "../constants";
import Products from "./Products";
import { OrderMetaContext } from "../context/OrderMetaContext";

export default function Cart() {
  const { orders, setorders } = useContext(OrderContext);
 // const [quantities, setQuantities] = useState({});
  const [disabledItems, setDisabledItems] = useState({});
  //const [totalPrice, setTotalPrice] = useState(0);
  const [orderPlaced, setOrderPlaced] = useState(false);
  //const [orderId, setOrderId] = useState(null);

   const {
    totalPrice,
    setTotalPrice,
    quantities,
    setQuantities,
    orderId,
    setOrderId,
  } = useContext(OrderMetaContext);

  const handleQuantityChange = (id, value) => {
  //  const quantity = parseInt(value, 10) || 1;
    setQuantities((prev) => ({ ...prev, [id]: value }));
  };

  const handlePlaceOrder = async () => {
    let calculatedTotal = 0;
    const newDisabledItems = {};

    const ordered_items = orders.map((order) => {
      const quantity = quantities[order.id] || 1;
      calculatedTotal += order.price * quantity;
      newDisabledItems[order.id] = true;

      return {
        product: order.id,
        quantity: quantity,
      };
    });

    const orderData = {
      status: "pending",
      ordered_items: ordered_items,
    };

    try {
      const token = localStorage.getItem(ACCESS_TOKEN);
      if (!token) {
        alert(" No access token found. Please login again.");
        return;
      }

      const response = await api.post("/api/orders/create/", orderData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(" Order placed:", response.data);
      alert(" Order placed successfully!");
      setDisabledItems(newDisabledItems);
      setTotalPrice(calculatedTotal);
      setOrderId(response.data.id); 
      setOrderPlaced(true);
    } catch (error) {
      console.error(" Order failed:", error);
      const msg = error.response?.data?.detail || JSON.stringify(error.response?.data || error.message);
      alert(" Order failed: " + msg);
    }
  };




const handleUpdateItem = async (itemId, newPrice, newQuantity) => {
  const token = localStorage.getItem(ACCESS_TOKEN);
    setTotalPrice(prev => Number(prev) + Number(newPrice));


  if (!orderId) {
    alert("❌ Cannot update. Order has not been placed yet.");
    return;
  }

  try {
    const response = await api.patch(
      `/api/orders/${orderId}/update-item/`,  // 🔁 Updated endpoint
      {
        item_id: itemId,
        price: newPrice,
        quantity: newQuantity,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("✅ Order item updated:", response.data);
    alert('Your order was updated')


  } catch (error) {
    console.error(" Failed to update order item:", error);
    alert("Something went wrong while updating the item.");
  }
};



  const handleDeleteItem = async (id, price) => {
    const quantity = quantities[id] || 1;
    const itemTotal = price * quantity;

    if (!orderPlaced) {
      const newOrders = orders.filter(order => order.id !== id);
      setorders(newOrders);
      setTotalPrice(prev => Math.max(prev - itemTotal, 0));
    } else {
      const token = localStorage.getItem(ACCESS_TOKEN);
      if (!orderId) {
        alert(" Cannot delete. Order ID is missing.");
        return;
      }
      const orderedItem = orders.find(order => order.product === productId);
      const orderedItemId = orderedItem ? orderedItem.id : null;

      try {
        await api.delete(`/api/orders/${orderedItemId}/delete/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const newOrders = orders.filter(order => order.id !== id);
        setorders(newOrders);
        setTotalPrice(prev => Math.max(prev - itemTotal, 0));
        alert("🗑️ Order item deleted from backend.");
        setOrderPlaced(false);
        setOrderId(null);
      } catch (error) {
        console.error(" Failed to delete order:", error);
        alert("Failed to delete order: " + (error.response?.data?.detail || error.message));
      }
    }
  };

  

  return (
    <div className={`cart-container ${orders.length === 0 ? "active" : ""}`}>
      {orders.map((order) => {
        const quantity = quantities[order.id] || 1;
        const isDisabled = disabledItems[order.id] || false;

        return (
          <div className="order-card" key={order.id}>
            <img src={order.image} alt={order.name} className="order-poster" />

            <div className="ordercard_layout">
 
              <button
                className="delete-button"
                onClick={() => handleDeleteItem(order.id, order.price)}
               
              >
                🗑️
              </button>
        <button
        className="update-button"
        disabled={!orderPlaced}
        onClick={() => handleUpdateItem(order.id, order.price, quantities[order.id])}

        >
        🔄
       </button>


            </div>

            <div className="order-info">
              <h3>{order.name}</h3>
              <p><strong>Quantity: {quantity}</strong></p>

              <input
              type="number"
              className="filter-input"
              min="1"
              value={quantity}
              disabled={!orderPlaced}  // ✅ Allow editing after placing order
              onChange={(e) => handleQuantityChange(order.id, e.target.value)}
              />

              <p><strong>Subtotal: ${order.price * quantity}</strong></p>
            </div>
          </div>
        );
      })}

      <div className="cart-summary">
        <button
          className="Order-button"
          type="button"
          onClick={handlePlaceOrder}
          disabled={orders.every(order => disabledItems[order.id])}
        >
          Place Order
        </button>

        <div className="price">
         <p><strong>Total Price: ${isNaN(totalPrice) ? "0.00" : totalPrice.toFixed(2)}</strong></p>




        </div>

        <div className="status">
          <p><strong>Status: {orderPlaced ? "Order Placed" : "Pending"}</strong></p>
        </div>
      </div>
    </div>
  );
}
