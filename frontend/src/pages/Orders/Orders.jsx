import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Orders.css';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ORDER_STEPS = [
  'Order Placed',
  'Processing',
  'Shipped',
  'Out for Delivery',
  'Delivered'
];

const OrderStatusBar = ({ status }) => {
  const currentStepIndex = ORDER_STEPS.indexOf(status);

  return (
    <div className="order-status-section">
      <div className="order-status-bar">
        {ORDER_STEPS.map((step, idx) => (
          <div key={step} className="status-step">
            <div className={`circle ${idx <= currentStepIndex ? 'active' : ''}`}>
              {idx + 1}
            </div>
            <span className={`label ${idx <= currentStepIndex ? 'active' : ''}`}>
              {step}
            </span>
            {idx < ORDER_STEPS.length - 1 && <div className={`line ${idx < currentStepIndex ? 'active' : ''}`}></div>}
          </div>
        ))}
      </div>
    </div>
  );
};

const Orders = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [gardenerDetails, setGardenerDetails] = useState({});

  useEffect(() => {
    if (!token) {
      navigate('/');
      return;
    }
    fetchOrders();
  }, [token, navigate]);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/orders/history', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        setOrders(response.data.orders);
        const gardenerOrderIds = response.data.orders
          .filter(order => order.type === 'gardener' && order.shippingAddress?.gardenerId)
          .map(order => order.shippingAddress.gardenerId);
        if (gardenerOrderIds.length > 0) {
          fetchAllGardenerDetails(gardenerOrderIds);
        }
      }
    } catch (error) {
      toast.error('Failed to fetch orders');
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllGardenerDetails = async (gardenerIds) => {
    const uniqueIds = [...new Set(gardenerIds)];
    const details = {};
    await Promise.all(uniqueIds.map(async (id) => {
      try {
        const res = await axios.get(`http://localhost:4000/api/gardeners/${id}`);
        details[id] = res.data.gardener;
      } catch (e) {
        details[id] = null;
      }
    }));
    setGardenerDetails(details);
  };

  if (loading) {
    return <div className="orders-loading">Loading orders...</div>;
  }

  return (
    <div className="orders-page">
      <h1>Your Orders</h1>
      {orders.length === 0 ? (
        <div className="no-orders">
          <p>You haven't placed any orders yet.</p>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order, orderIndex) => (
            <div key={`order-${order.orderId}-${orderIndex}`} className="order-card">
              {order.type === 'gardener' ? (
                <>
                  <div className="order-header">
                    <h3>Gardener Booking #{order.orderId}</h3>
                    <span className="order-date">{new Date(order.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="order-items">
                    <div className="order-item">
                      <img
                        src={order.profileImage ? `http://localhost:4000${order.profileImage}` : '/profile_image.png'}
                        alt={order.name || 'Gardener'}
                      />
                      <div className="item-details">
                        <p className="item-name"><strong>Name:</strong> {order.name || 'Gardener'}</p>
                        <p><strong>Specialization:</strong> {order.specialization || '-'}</p>
                        <p><strong>Location:</strong> {order.location || '-'}</p>
                        <p><strong>Date:</strong> {order.date}</p>
                        <p><strong>Time Slot:</strong> {order.timeSlot}</p>
                        <p><strong>Status:</strong> {order.bookingStatus || order.status}</p>
                        <p><strong>Contact:</strong> {order.contactInfo || '-'}</p>
                        <p className="cash-message">Please pay the gardener in cash upon arrival. Contact: {order.contactInfo || '-'}</p>
                        <p className="arrival-message">Your gardener will arrive at the selected time slot.</p>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="order-header">
                    <h3>Order #{order.orderId}</h3>
                    <span className="order-date">{new Date(order.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="order-items">
                    {order.items && order.items.length > 0 ? (
                      order.items.map((item, idx) => (
                        <div key={idx} className="order-item">
                          <img src={item.image} alt={item.name} />
                          <div className="item-details">
                            <p className="item-name">{item.name}</p>
                            <p className="item-quantity">Qty: {item.quantity}</p>
                            <p className="item-price">₹{item.price}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="no-items">No items in this order</div>
                    )}
                  </div>
                  {/* Status bar section like admin */}
                  <OrderStatusBar status={order.status} />
                  <div className="order-footer">
                    <p className="total-amount">
                      <strong>Total Amount:</strong> ₹{order.totalAmount}
                    </p>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
