import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './OrderStatus.css';
import { useAuth } from '../../context/AuthContext'; // adjust the path if needed

const OrderStatus = () => {
  const { user } = useAuth(); // Logged-in user context
  const [statusSteps] = useState([
    'Order Placed',
    'Processing',
    'Shipped',
    'Out for Delivery',
    'Delivered',
  ]);

  const [orders, setOrders] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch both orders and bookings for this user
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user) return;

        const [ordersRes, bookingsRes] = await Promise.all([
          axios.get(`http://localhost:4000/api/orders/user/${user._id}`),
          axios.get(`http://localhost:4000/api/bookings/user/${user._id}`),
        ]);

        setOrders(ordersRes.data.orders || []);
        setBookings(bookingsRes.data.bookings || []);
      } catch (error) {
        console.error('Error fetching orders/bookings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const getCurrentStepIndex = (status) => {
    return statusSteps.indexOf(status);
  };

  if (!user) return <p>Please log in to view your status.</p>;
  if (loading) return <p>Loading your orders and bookings...</p>;

  return (
    <div className="order-status-container">
      <h2>My Orders</h2>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        orders.map((order) => {
          const currentStep = getCurrentStepIndex(order.status);
          return (
            <div key={order._id} className="order-status">
              <h4>Order ID: {order._id}</h4>
              <div className="status-bar">
                {statusSteps.map((step, index) => {
                  const isCompleted = index <= currentStep;
                  const isActive = index === currentStep;

                  return (
                    <React.Fragment key={step}>
                      <div
                        className={`status-step ${isCompleted ? 'completed' : ''} ${
                          isActive ? 'active' : ''
                        }`}
                      >
                        <div className="step-dot"></div>
                        <span className="step-label">{step}</span>
                      </div>
                      {index < statusSteps.length - 1 && (
                        <div
                          className={`status-line ${isCompleted ? 'completed' : ''}`}
                        ></div>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          );
        })
      )}

      <h2>My Gardener Bookings</h2>
      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        bookings.map((booking) => (
          <div key={booking._id} className="booking-block">
            <h4>Gardener: {booking.gardenerId?.name}</h4>
            <p>Date: {booking.date}</p>
            <p>Time Slot: {booking.timeSlot}</p>
            <p>Status: <strong>{booking.status}</strong></p>
          </div>
        ))
      )}
    </div>
  );
};

export default OrderStatus;
