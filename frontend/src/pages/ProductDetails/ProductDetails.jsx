import React, { useContext } from 'react';
import './ProductDetails.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { CartContext } from '../../context/CartContext';
import { toast } from 'react-toastify';

const ProductDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const product = location.state;
  const { addToCart } = useContext(CartContext);

  if (!product) {
    navigate('/');
    return null;
  }

  const handleAddToCart = () => {
    addToCart(product);
    toast.success('Added to cart!');
  };

  return (
    <div className="product-details">
      <div className="product-image-section">
        <img src={product.image} alt={product.name} />
      </div>

      <div className="product-info-section">
        <h1>{product.name}</h1>
        <div className="product-price">₹{product.price}</div>

        <div className="product-description">
          <h3>Description</h3>
          <p>{product.description}</p>
        </div>

        <div className="product-actions">
          <button
            onClick={handleAddToCart}
            className="add-to-cart-btn"
            disabled={!product.inStock}
          >
            {product.inStock ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
