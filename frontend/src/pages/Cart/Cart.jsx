import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import './Cart.css';

const Cart = () => {
  const { cart, updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();

  const calculateItemTotal = (item) => {
    const price = parseFloat(item.price) || 0;
    const quantity = parseInt(item.quantity) || 0;
    return price * quantity;
  };

  const totalQuantity = cart?.items?.reduce(
    (total, item) => total + (parseInt(item.quantity) || 0),
    0
  ) || 0;

  const totalAmount = cart?.items?.reduce(
    (total, item) => total + calculateItemTotal(item),
    0
  ) || 0;

  const handleCheckout = () => {
    localStorage.setItem('cartTotalAmount', totalAmount);
    localStorage.setItem('cart', JSON.stringify(cart.items));
    navigate('/payment');
  };

  return (
    <div className="cart-page">
      <h2>Your Cart</h2>
      {!cart?.items || cart.items.length === 0 ? (
        <div className="empty-cart">
          <p>Your cart is empty</p>
          <button onClick={() => navigate('/')}>Continue Shopping</button>
        </div>
      ) : (
        <div className="cart-container">
          <div className="cart-items">
            {cart.items.map((item, index) => {
              const imageUrl = item.image?.startsWith('http')
                ? item.image
                : `http://localhost:4000/uploads/${item.image}`;
              return (
                <div key={`${item.productId}-${index}`} className="cart-item">
                  <div className="image-container">
                    {item.image && (
                      <img src={imageUrl} alt={item.name} className="cart-img" />
                    )}
                  </div>
                  <div className="item-details">
                    <h3>{item.name || 'Unknown Product'}</h3>
                    {item.type === 'gardener' && (
                      <>
                        <p><strong>Specialization:</strong> {item.specialization}</p>
                        <p><strong>Contact:</strong> {item.contact}</p>
                        <p><strong>Location:</strong> {item.location}</p>
                        <p><strong>Date:</strong> {item.date}</p>
                        <p><strong>Time Slot:</strong> {item.timeSlot}</p>
                      </>
                    )}
                    <p className="price">₹{parseFloat(item.price).toFixed(2)}</p>
                    <p className="subtotal">Subtotal: ₹{calculateItemTotal(item).toFixed(2)}</p>
                    <div className="quantity-controls">
                      <button
                        onClick={() => updateQuantity(item.productId, -1)}
                        disabled={parseInt(item.quantity) <= 1}
                      >-</button>
                      <span>{parseInt(item.quantity)}</span>
                      <button
                        onClick={() => updateQuantity(item.productId, 1)}
                      >+</button>
                    </div>
                  </div>
                  <button className="remove-btn" onClick={() => removeFromCart(item.productId)}>
                    Remove
                  </button>
                </div>
              );
            })}
          </div>
          <div className="cart-summary">
            <h3>Order Summary</h3>
            <p>Total Items: {totalQuantity}</p>
            <p>Total Amount: ₹{totalAmount.toFixed(2)}</p>
            <button
              className="checkout-btn"
              onClick={handleCheckout}
              disabled={cart.items.length === 0}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
