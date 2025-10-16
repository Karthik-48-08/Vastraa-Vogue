import React, { createContext, useContext, useState } from "react";

const OrdersContext = createContext();

export const useOrders = () => useContext(OrdersContext);

export const OrdersProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);

  const addOrder = (newOrder) => {
    // Generate a unique order ID and date for the frontend
    const orderWithDetails = {
        ...newOrder,
        orderId: `VV-${Math.floor(1000 + Math.random() * 9000)}`,
        date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
    };
    setOrders((prevOrders) => [orderWithDetails, ...prevOrders]); // Add new order to the top
  };

  return (
    <OrdersContext.Provider value={{ orders, addOrder }}>
      {children}
    </OrdersContext.Provider>
  );
};