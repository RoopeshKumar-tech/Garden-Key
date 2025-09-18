import React, { useEffect, useState } from 'react';
import './ListGardeners.css';
import axios from 'axios';
import { toast } from 'react-toastify';

const ListGardeners = () => {
  const URL = 'http://localhost:4000';
  const [list, setList] = useState([]);

  const fetchList = async () => {
    try {
      const response = await axios.get(`${URL}/api/gardeners`);
      setList(response.data.gardeners);
    } catch (error) {
      console.error(error);
      toast.error('Error fetching gardeners');
    }
  };

  const removeGardener = async (id) => {
    if (window.confirm('Are you sure you want to delete this gardener?')) {
      try {
        await axios.delete(`${URL}/api/gardeners/${id}`);
        await fetchList();
        toast.success('Gardener deleted successfully');
      } catch (error) {
        toast.error(`Error deleting gardener: ${error.response?.data?.message || error.message}`);
      }
    }
  };

  const toggleAvailability = async (id, currentAvailability) => {
    try {
      await axios.put(`${URL}/api/gardeners/${id}`, { availability: !currentAvailability });
      setList(list => list.map(g => g._id === id ? { ...g, availability: !currentAvailability } : g));
      toast.success(`Gardener is now ${!currentAvailability ? 'available' : 'unavailable'}`);
    } catch (error) {
      toast.error('Failed to update availability');
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className="list-gardeners">
      <h2>Garden Key Gardeners List</h2>
      {list.length > 0 ? (
        <div className="table-wrapper" aria-label="Gardener List Table">
          <table className="gardener-table">
            <thead>
              <tr>
                <th scope="col">Image</th>
                <th scope="col">Name</th>
                <th scope="col">Specialization</th>
                <th scope="col">Location</th>
                <th scope="col">Experience</th>
                <th scope="col">Availability</th>
                <th scope="col">Contact</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {list.map((item) => (
                <tr key={item._id}>
                  <td>
                    <img
                      className="product-image"
                      src={item.profileImage ? `${URL}${item.profileImage}` : '/profile_image.png'}
                      alt={item.name}
                    />
                  </td>
                  <td className="truncate" title={item.name}>{item.name}</td>
                  <td className="truncate" title={item.specialization}>{item.specialization}</td>
                  <td className="truncate" title={item.location}>{item.location}</td>
                  <td>{item.experience} yrs</td>
                  <td>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={item.availability}
                        onChange={() => toggleAvailability(item._id, item.availability)}
                        style={{ width: 22, height: 22 }}
                      />
                      <span className={`status ${item.availability ? 'in-stock' : 'out-of-stock'}`}>{item.availability ? 'Available' : 'Unavailable'}</span>
                    </label>
                  </td>
                  <td className="truncate" title={item.contactInfo}>{item.contactInfo}</td>
                  <td>
                    <span
                      className="delete-btn"
                      title="Delete Gardener"
                      aria-label={`Delete ${item.name}`}
                      onClick={() => removeGardener(item._id)}
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
        <div className="no-gardeners">
          <p>No gardeners found in Garden Key</p>
        </div>
      )}
    </div>
  );
};

export default ListGardeners; 