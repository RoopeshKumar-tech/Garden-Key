import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ListGardeners = ({ isAdmin = false }) => {
  const [gardeners, setGardeners] = useState([]);

  useEffect(() => {
    const fetchGardeners = async () => {
      try {
        const res = await axios.get('http://localhost:4000/api/gardeners');
        const data = isAdmin
          ? res.data.gardeners
          : res.data.gardeners.filter(g => g.category === 'Hire a professional gardener');

        setGardeners(data);
      } catch (err) {
        console.error('Error fetching gardeners:', err);
      }
    };

    fetchGardeners();
  }, [isAdmin]);

  return (
    <div className="gardener-list">
      <h2>{isAdmin ? 'All Gardeners (Admin)' : 'Hire a Professional Gardener'}</h2>
      {gardeners.length === 0 ? (
        <p>No gardeners found.</p>
      ) : (
        gardeners.map((gardener) => (
          <div key={gardener._id} className="gardener-card">
            <img
              src={`http://localhost:4000${gardener.image}`}
              alt={gardener.name}
              style={{ width: '120px', height: '120px', objectFit: 'cover' }}
            />
            <h4>{gardener.name}</h4>
            <p>{gardener.experience} yrs experience</p>
            <p>₹{gardener.pricePerHour}/hour</p>
            <p>{gardener.description}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default ListGardeners;
