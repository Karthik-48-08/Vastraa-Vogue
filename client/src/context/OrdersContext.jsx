import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "./AuthContext";

const OrdersContext = createContext();

export const useOrders = () => useContext(OrdersContext);

export const OrdersProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);
  const { user } = useAuth();

  // Fetch orders from backend when user logs in or component mounts
  const fetchOrders = useCallback(async () => {
    if (!user || !user.token) {
      setOrders([]);
      setHasFetched(false);
      return;
    }

    // Prevent multiple simultaneous fetches
    if (loading) return;

    setLoading(true);
    try {
      console.log('📋 Fetching orders from backend...');
      const response = await fetch('http://localhost:5000/api/orders/myorders', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const ordersData = await response.json();
        console.log('✅ Orders fetched successfully:', ordersData);
        
        // Transform backend orders to match frontend format
        const transformedOrders = ordersData.map(order => ({
          orderId: order._id,
          id: order._id,
          items: order.products || [],
          shippingAddress: order.shippingAddress,
          measurements: order.measurements,
          paymentMethod: order.paymentMethod,
          status: order.status || 'Processing',
          total: order.totalAmount,
          date: new Date(order.orderDate).toLocaleDateString('en-GB', { 
            day: 'numeric', 
            month: 'short', 
            year: 'numeric' 
          }),
          orderDate: order.orderDate
        }));
        
        setOrders(transformedOrders);
        setHasFetched(true);
      } else {
        console.error('Failed to fetch orders:', response.status);
        if (response.status !== 404) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch orders');
        } else {
          // No orders found is not an error
          setOrders([]);
          setHasFetched(true);
        }
      }
    } catch (error) {
      console.error('❌ Error fetching orders:', error);
      // Don't show alert for network errors to avoid annoying users
      if (!error.message.includes('Failed to fetch')) {
        console.warn('Failed to load orders:', error.message);
      }
      setHasFetched(true);
    } finally {
      setLoading(false);
    }
  }, [user, loading]);

  // Fetch orders when user changes (login/logout)
  useEffect(() => {
    // Only fetch if we haven't already fetched for this user
    if (user && user.token && !hasFetched && !loading) {
      fetchOrders();
    }
  }, [user, hasFetched, loading, fetchOrders]);

  const addOrder = (newOrder) => {
    // Generate a unique order ID and date for the frontend
    const orderWithDetails = {
      ...newOrder,
      orderId: newOrder.id || `VV-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toLocaleDateString('en-GB', { 
        day: 'numeric', 
        month: 'short', 
        year: 'numeric' 
      }),
    };
    
    // Add to local state immediately for better UX
    setOrders((prevOrders) => [orderWithDetails, ...prevOrders]);
    // Reset the fetch flag so we'll refresh from backend next time
    setHasFetched(false);
  };

  const refreshOrders = () => {
    setHasFetched(false);
  };

  const value = {
    orders,
    loading,
    addOrder,
    refreshOrders
  };

  return (
    <OrdersContext.Provider value={value}>
      {children}
    </OrdersContext.Provider>
  );
};