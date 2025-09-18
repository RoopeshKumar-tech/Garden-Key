import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './Orders.css';
import OrderStatus from '../../components/OrderStatus/OrderStatus';
import { useAuth } from '../../context/AuthContext';

const statusColors = {
  pending: '#FFC107',
  approved: '#28a745',
  rejected: '#dc3545',
  Delivered: '#4CAF50',
  Processing: '#2196F3',
  'Order Placed': '#FFC107',
  Shipped: '#FF9800',
  'Out for Delivery': '#9C27B0',
};

const statusIcons = {
  pending: '⏳',
  approved: '✅',
  rejected: '❌',
  Delivered: '📦',
  Processing: '🔄',
  'Order Placed': '📝',
  Shipped: '🚚',
  'Out for Delivery': '🛵',
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();
  const [filterStatus, setFilterStatus] = useState('all');
  const [gardenerNotes, setGardenerNotes] = useState({});

  const statusOptions = [
    'Order Placed',
    'Processing',
    'Shipped',
    'Out for Delivery',
    'Delivered'
  ];

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/admin/orders', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setOrders(response.data.orders);
      }
    } catch (error) {
      toast.error('Failed to fetch orders');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus, note) => {
    if (!window.confirm(`Are you sure you want to ${newStatus} this booking? This action cannot be undone.`)) return;
    try {
      const response = await axios.patch(
        `http://localhost:4000/api/admin/orders/${orderId}/status`,
        note !== undefined ? { status: newStatus, note } : { status: newStatus },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        setOrders(prevOrders =>
          prevOrders.map(order =>
            order.orderId === orderId
              ? { ...order, status: newStatus, bookingStatus: newStatus }
              : order
          )
        );
        toast.success(`Order ${orderId} status updated to ${newStatus}`);
      }
    } catch (error) {
      toast.error('Failed to update order status');
      console.error('Error:', error);
    }
  };

  const filteredOrders = filterStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status === filterStatus);

  if (loading) {
    return <div className="orders-loading">Loading orders...</div>;
  }

  return (
    <div className="admin-orders">
      <div className="orders-header">
        <h1>Order Management</h1>
        <div className="filter-section">
          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="status-filter"
            aria-label="Filter Orders by Status"
          >
            <option value="all">All Orders</option>
            {statusOptions.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="no-orders">No orders found in Garden Key</div>
      ) : (
        <div className="orders-grid" aria-label="Orders Grid">
          {filteredOrders.map((order) => (
            <div key={order.orderId} className="order-card" style={{ boxShadow: '0 6px 24px rgba(0,0,0,0.10)', border: '1.5px solid #e0e0e0', borderRadius: 16, background: '#fff', marginBottom: 24 }}>
              <div className="order-header" style={{ borderBottom: '1.5px solid #eee', paddingBottom: 12, marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ color: '#007bff', margin: 0, fontWeight: 700 }}>Order #{order.orderId}</h3>
                  <span className="order-date" style={{ color: '#666', fontSize: 15 }}>{new Date(order.createdAt).toLocaleDateString()}</span>
                </div>
                <span className="status-badge" style={{ background: statusColors[order.type === 'gardener' ? (order.bookingStatus || order.status) : order.status] || '#eee', color: '#fff', padding: '7px 18px', borderRadius: 20, fontWeight: 700, fontSize: 15, display: 'flex', alignItems: 'center', gap: 7 }}>
                  {statusIcons[order.type === 'gardener' ? (order.bookingStatus || order.status) : order.status] || '📦'} {order.type === 'gardener' ? (order.bookingStatus || order.status) : order.status}
                </span>
              </div>

              <div className="customer-info" style={{ background: '#f8f9fa', padding: 18, borderRadius: 10, marginBottom: 18, fontSize: 15 }}>
                <p><strong>Customer ID:</strong> {order.userId ? order.userId._id : 'N/A'}</p>
                {order.type !== 'gardener' && <p><strong>Payment Method:</strong> {order.paymentDetails?.method || 'N/A'}</p>}
                {order.type !== 'gardener' && <p><strong>Payment ID:</strong> {order.paymentDetails?.paymentId || 'N/A'}</p>}
              </div>

              {order.type !== 'gardener' && (
                <div className="order-items">
                  {order.items && order.items.length > 0 ? (
                    order.items.map((item) => (
                      item && item._id ? (
                        <div key={item._id} className="order-item">
                          <img src={item.image} alt={item.name} />
                          <div className="item-details">
                            <p className="item-name">{item.name}</p>
                            <p className="item-quantity">Qty: {item.quantity}</p>
                            <p className="item-price">₹{item.price}</p>
                          </div>
                        </div>
                      ) : (
                        <div key={`${order.orderId}-${item.name}`} className="order-item">
                          {/* Fallback content */}
                        </div>
                      )
                    ))
                  ) : (
                    <div className="no-items">No items in this order</div>
                  )}
                </div>
              )}

              <div className="order-status-section">
                {order.type === 'gardener' ? (
                  <div className="gardener-approval-section" style={{ background: '#f4f8f6', border: '1.5px solid #d1e7dd', borderRadius: 12, padding: 18, margin: '18px 0', boxShadow: '0 2px 8px rgba(40,167,69,0.07)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                      <span style={{ fontWeight: 700, fontSize: 16, color: '#28a745' }}>Gardener Booking</span>
                      <span className="status-badge" style={{ background: statusColors[order.bookingStatus || order.status] || '#eee', color: '#fff', padding: '5px 14px', borderRadius: 16, fontWeight: 600, fontSize: 14, display: 'flex', alignItems: 'center', gap: 5 }}>
                        {statusIcons[order.bookingStatus || order.status] || '📦'} {order.bookingStatus || order.status}
                      </span>
                    </div>
                    <div style={{ marginBottom: 10 }}>
                      <strong>Name:</strong> {order.name || '-'}<br />
                      <strong>Specialization:</strong> {order.specialization || '-'}<br />
                      <strong>Location:</strong> {order.location || '-'}<br />
                      <strong>Date:</strong> {order.date}<br />
                      <strong>Time Slot:</strong> {order.timeSlot}<br />
                      <strong>Contact:</strong> {order.contactInfo || '-'}
                    </div>
                    {(['approved', 'rejected'].includes(order.bookingStatus) && order.status !== 'Delivered') ? (
                      <div style={{ marginTop: 10, color: '#888', fontWeight: 500, fontSize: 15 }}>
                        Decision made. No further action required.
                      </div>
                    ) : null}
                    {(order.bookingStatus === 'pending' && order.status !== 'Delivered') && (
                      <>
                        <textarea
                          placeholder="Optional message to user (e.g. reason for rejection, or approval note)"
                          value={gardenerNotes[order.orderId] || ''}
                          onChange={e => setGardenerNotes({ ...gardenerNotes, [order.orderId]: e.target.value })}
                          rows={2}
                          style={{ width: '100%', margin: '10px 0', borderRadius: 8, border: '1.5px solid #ccc', padding: 8, fontSize: 15 }}
                        />
                        <div style={{ display: 'flex', gap: 12 }}>
                          <button
                            className="approve-btn"
                            style={{ background: '#28a745', color: 'white', padding: '8px 22px', border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer', fontSize: 15 }}
                            onClick={() => updateOrderStatus(order.orderId, 'approved', gardenerNotes[order.orderId] || '')}
                          >
                            ✅ Approve
                          </button>
                          <button
                            className="reject-btn"
                            style={{ background: '#dc3545', color: 'white', padding: '8px 22px', border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer', fontSize: 15 }}
                            onClick={() => updateOrderStatus(order.orderId, 'rejected', gardenerNotes[order.orderId] || '')}
                          >
                            ❌ Reject
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <OrderStatus
                    orderId={order.orderId}
                    currentStatus={order.status}
                    onStatusUpdate={(newStatus) => updateOrderStatus(order.orderId, newStatus)}
                    isAdmin={true}
                  />
                )}
              </div>

              <div className="order-footer" style={{ borderTop: '1.5px solid #eee', paddingTop: 18, marginTop: 18, fontSize: 16 }}>
                {order.type !== 'gardener' && (
                  <p className="total-amount" style={{ textAlign: 'right', fontSize: 18, color: '#007bff', fontWeight: 700 }}>
                    <strong>Total Amount:</strong> ₹{order.totalAmount}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
