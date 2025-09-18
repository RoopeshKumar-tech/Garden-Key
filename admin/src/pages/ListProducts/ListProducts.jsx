import React, { useEffect, useState } from 'react';
import './ListProducts.css';
import axios from 'axios';
import { toast } from 'react-toastify';

const ListProducts = () => {
  const URL = 'http://localhost:4000';
  const [list, setList] = useState([]);

  const fetchList = async () => {
    try {
      const response = await axios.get(`${URL}/api/products/list`);
      setList(response.data.data);
    } catch (error) {
      console.error(error);
      toast.error('Error fetching products');
    }
  };

  const removeProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.post(`${URL}/api/products/remove`, { id });
        await fetchList();
        toast.success('Product deleted successfully');
      } catch (error) {
        toast.error(`Error deleting product: ${error.response?.data?.message || error.message}`);
      }
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className="list-products">
      <h2>Garden Key Products List</h2>
      {list.length > 0 ? (
        <div className="table-wrapper" aria-label="Product List Table">
          <table className="product-table">
            <thead>
              <tr>
                <th scope="col">Image</th>
                <th scope="col">Name</th>
                <th scope="col">Category</th>
                <th scope="col">Price</th>
                <th scope="col">Status</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {list.map((item) => (
                <tr key={item._id}>
                  <td>
                    <img
                      className="product-image"
                      src={`${URL}/images/${item.image}`}
                      alt={item.name}
                    />
                  </td>
                  <td className="truncate" title={item.name}>{item.name}</td>
                  <td className="truncate" title={item.category}>{item.category}</td>
                  <td className="price">₹{item.price}</td>
                  <td>
                    <span className={`status ${item.inStock ? 'in-stock' : 'out-of-stock'}`}>
                      {item.inStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </td>
                  <td>
                    <span
                      className="delete-btn"
                      title="Delete Product"
                      aria-label={`Delete ${item.name}`}
                      onClick={() => removeProduct(item._id)}
                    >
                      ×
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="no-products">
          <p>No products found in Garden Key</p>
        </div>
      )}
    </div>
  );
};

export default ListProducts;
