import React, { useState, useEffect } from 'react';
import './EditProduct.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import { assets } from '../../assets/assets';

const EditProduct = () => {
  const URL = 'http://localhost:4000';
  const [products, setProducts] = useState(() => {
    const savedProducts = localStorage.getItem('products');
    return savedProducts ? JSON.parse(savedProducts) : [];
  });
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${URL}/api/products/list`);
      if (response.data.success) {
        setProducts(response.data.data);
        localStorage.setItem('products', JSON.stringify(response.data.data));
      }
    } catch (error) {
      const savedProducts = localStorage.getItem('products');
      if (savedProducts) {
        setProducts(JSON.parse(savedProducts));
        toast.info('Loading products from cache');
      } else {
        toast.error('Failed to fetch products');
      }
    } finally {
      setLoading(false);
    }
  };

  const startEditing = (product) => {
    setEditingId(product._id);
    setEditForm({ ...product });
    setImagePreview(null);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditForm(null);
    setImagePreview(null);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setEditForm(prev => ({
          ...prev,
          image: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (productId) => {
    setLoading(true);
    try {
      const formData = new FormData();
      if (imagePreview) {
        const response = await fetch(imagePreview);
        const blob = await response.blob();
        formData.append('image', blob, 'image.jpg');
      }
      
      Object.keys(editForm).forEach(key => {
        if (key !== 'image' && key !== '_id' && key !== '__v') {
          formData.append(key, editForm[key]);
        }
      });

      const response = await axios.put(
        `${URL}/api/products/edit/${productId}`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' }
        }
      );

      if (response.data.success) {
        setProducts(prevProducts => 
          prevProducts.map(p => 
            p._id === productId ? { ...p, ...editForm } : p
          )
        );
        toast.success('Product updated successfully!');
        cancelEditing();
      }
    } catch (error) {
      toast.error('Failed to update product');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading products...</div>;

  return (
    <div className="edit-products">
      <h2>Edit Garden Key Products</h2>
      <div className="products-grid" aria-label="Edit Products Grid">
        {products.map(product => (
          <div key={product._id} className="product-card">
            {editingId === product._id ? (
              <div className="edit-form">
                <div className="image-section">
                  <img
                    src={imagePreview || `${URL}/images/${product.image}`}
                    alt={product.name}
                    onError={(e) => e.target.src = assets.no_image}
                  />
                  <input
                    type="file"
                    onChange={handleImageChange}
                    accept="image/*"
                    aria-label="Upload new product image"
                  />
                </div>
                <input
                  type="text"
                  name="name"
                  value={editForm.name}
                  onChange={handleInputChange}
                  placeholder="Product Name"
                  aria-label="Product Name"
                />
                <select
                  name="category"
                  value={editForm.category}
                  onChange={handleInputChange}
                  aria-label="Product Category"
                >
                  {[
                    'Flowering Plants',
                    'Fruit & Vegetable Plants',
                    'Soil & Fertilizers',
                    'Pesticides & Insecticides',
                    'Gardening Tools',
                    'Seedlings & Saplings',
                    'Pots & Planters'
                  ].map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <input
                  type="number"
                  name="price"
                  value={editForm.price}
                  onChange={handleInputChange}
                  placeholder="Price"
                  aria-label="Product Price"
                />
                <textarea
                  name="description"
                  value={editForm.description}
                  onChange={handleInputChange}
                  placeholder="Description"
                  aria-label="Product Description"
                />
                <label>
                  <input
                    type="checkbox"
                    name="inStock"
                    checked={editForm.inStock}
                    onChange={handleInputChange}
                    aria-label="In Stock"
                  />
                  In Stock
                </label>
                <div className="edit-actions">
                  <button onClick={() => handleSubmit(product._id)}>
                    Save Changes
                  </button>
                  <button onClick={cancelEditing} className="cancel">
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <img
                  src={product.image?.startsWith('data:') ? product.image : `${URL}/images/${product.image}`}
                  alt={product.name}
                  onError={(e) => e.target.src = assets.no_image}
                />
                <h3>{product.name}</h3>
                <p>{product.category}</p>
                <p>₹{product.price}</p>
                <button onClick={() => startEditing(product)} aria-label={`Edit ${product.name}`}>
                  Edit Product
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default EditProduct;