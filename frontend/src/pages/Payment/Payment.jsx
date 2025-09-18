import React, { useEffect, useState } from 'react';
import './Payment.css';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const Payment = () => {
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const { token, user } = useAuth();

  const [totalAmount, setTotalAmount] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [paymentError, setPaymentError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const userDetails = {
    name: user?.name || 'User',
    email: user?.email || 'test@gmail.com',
    contact: user?.phone || '9999999999'
  };

  const testCardDetails = {
    number: '4111 1111 1111 1111',
    expiry: '12/27',
    cvv: '123'
  };

  useEffect(() => {
    const total = parseInt(localStorage.getItem('cartTotalAmount')) || 0;
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    setTotalAmount(total);
    setCartItems(cart);

    if (total <= 0 || cart.length === 0) {
      alert("Cart is empty. Redirecting to cart...");
      navigate('/cart');
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
  }, [navigate]);

  const handlePayment = () => {
    setPaymentError(null);

    if (!token) {
      alert("Please login to proceed with payment.");
      navigate('/login');
      return;
    }

    setIsProcessing(true);

    if (paymentMethod === 'cod' || paymentMethod === 'upi') {
      const mockPaymentId = `MOCK-${paymentMethod.toUpperCase()}-${Date.now()}`;
      createOrder(mockPaymentId, 'pending');
      return;
    }

    const options = {
      key: 'rzp_test_1DP5mmOlF5G5ag',
      amount: totalAmount * 100,
      currency: 'INR',
      name: 'Garden Key 🪴',
      description: 'Eyewear Purchase',
      handler: function (response) {
        if (response.razorpay_payment_id) {
          createOrder(response.razorpay_payment_id, 'completed');
        } else {
          setIsProcessing(false);
          setPaymentError('Payment failed. Please try again.');
        }
      },
      modal: {
        ondismiss: function () {
          setIsProcessing(false);
          setPaymentError('Payment cancelled');
        }
      },
      prefill: {
        name: userDetails.name,
        email: userDetails.email,
        contact: userDetails.contact
      },
      theme: {
        color: '#007bff'
      }
    };

    try {
      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response) {
        setIsProcessing(false);
        setPaymentError(`Payment failed: ${response.error.description}`);
      });
      rzp.open();
    } catch (error) {
      setIsProcessing(false);
      setPaymentError('Failed to initialize payment. Please try again.');
    }
  };

  const createOrder = async (paymentId, status) => {
    try {
      // If the cart contains a gardener booking
      if (cartItems.length === 1 && cartItems[0].gardenerId) {
        const booking = cartItems[0];
        const orderData = {
          type: "gardener",
          gardenerId: booking.gardenerId,
          date: booking.date,
          timeSlot: booking.timeSlot,
          totalAmount: parseFloat(totalAmount),
          paymentDetails: {
            method: paymentMethod,
            paymentId: paymentId,
            status: status
          }
        };

        const response = await axios.post(
          'http://localhost:4000/api/orders',
          orderData,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        if (response.data.success) {
          setOrderId(response.data.order.orderId);
          setOrderConfirmed(true);
          clearCart();
          localStorage.removeItem('cart');
          localStorage.removeItem('cartTotalAmount');
        }
      } else {
        // Otherwise, treat as product order
        const items = cartItems.map(item => {
          if (!item.productId) throw new Error("Missing product ID in cart item.");
          return {
            productId: item.productId,
            name: item.name,
            quantity: parseInt(item.quantity),
            price: parseFloat(item.price),
            image: item.image
          };
        });

        const orderData = {
          type: "product",
          items,
          totalAmount: parseFloat(totalAmount),
          paymentDetails: {
            method: paymentMethod,
            paymentId: paymentId,
            status: status
          }
        };

        const response = await axios.post(
          'http://localhost:4000/api/orders',
          orderData,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        if (response.data.success) {
          setOrderId(response.data.order.orderId);
          setOrderConfirmed(true);
          clearCart();
          localStorage.removeItem('cart');
          localStorage.removeItem('cartTotalAmount');
        }
      }
    } catch (error) {
      console.error('Error creating order:', error.response?.data || error);
      setPaymentError(error.response?.data?.message || 'Failed to create order');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="payment-page">
      {!orderConfirmed ? (
        <>
          <h2>Confirm Your Payment</h2>

          <div className="summary-box">
            <h3>Order Summary</h3>
            {cartItems.map((item, index) => (
              <div key={index} className="summary-item">
                <span>{item.name}</span>
                <span>Qty: {item.quantity}</span>
              </div>
            ))}
            <hr />
            <h4>Total: ₹{totalAmount}</h4>
          </div>

          <div className="payment-methods">
            <h3>Select Payment Method</h3>
            <label>
              <input
                type="radio"
                name="payment"
                value="razorpay"
                checked={paymentMethod === 'razorpay'}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              Card/UPI via Razorpay
            </label>
            <label>
              <input
                type="radio"
                name="payment"
                value="upi"
                checked={paymentMethod === 'upi'}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              Direct UPI (Mock)
            </label>
            <label>
              <input
                type="radio"
                name="payment"
                value="cod"
                checked={paymentMethod === 'cod'}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              Cash on Delivery
            </label>

            {paymentMethod === 'razorpay' && (
              <div className="test-card-details">
                <h4>Test Card Details</h4>
                <div className="card-info">
                  <p>Card Number: {testCardDetails.number}</p>
                  <p>Expiry: {testCardDetails.expiry}</p>
                  <p>CVV: {testCardDetails.cvv}</p>
                  <small>Use these details for testing the payment</small>
                </div>
              </div>
            )}
          </div>

          {paymentError && (
            <div className="payment-error">
              ❌ {paymentError}
            </div>
          )}

          <button
            onClick={handlePayment}
            className="pay-btn"
            disabled={isProcessing}
          >
            {isProcessing ? 'Processing...' : `Proceed with ${paymentMethod.toUpperCase()}`}
          </button>
        </>
      ) : (
        <>
          <h2>🎉 Order Successful!</h2>
          <div className="invoice-box">
            <h3>Order Info</h3>
            <p><strong>Order ID:</strong> {orderId}</p>
            {cartItems.map((item, index) => (
              <div key={index} className="invoice-item">
                <span>{item.name}</span>
                <span>Qty: {item.quantity}</span>
              </div>
            ))}
            <hr />
            <p><strong>Total Paid:</strong> ₹{totalAmount}</p>
            <p><strong>Payment Method:</strong> {paymentMethod.toUpperCase()}</p>
            <p>📩 Check your email for the invoice.</p>
          </div>
          <button onClick={() => navigate('/')} className="home-btn">
            🏠 Back to Home
          </button>
        </>
      )}
    </div>
  );
};

export default Payment;
