// src/context/OrderMetaContext.jsx
import { createContext, useState } from "react";

export const OrderMetaContext = createContext();

export default function OrderMetaProvider({ children }) {
  const [totalPrice, setTotalPrice] = useState(0);
  const [quantities, setQuantities] = useState({});
  const [orderId, setOrderId] = useState(null);

  return (
    <OrderMetaContext.Provider
      value={{
        totalPrice,
        setTotalPrice,
        quantities,
        setQuantities,
        orderId,
        setOrderId,
      }}
    >
      {children}
    </OrderMetaContext.Provider>
  );
}
