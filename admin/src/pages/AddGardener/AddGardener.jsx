import React, { useState } from 'react';
import './AddGardener.css';
import axios from 'axios';
import { toast } from 'react-toastify';

const AddGardener = () => {
  const [image, setImage] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    experience: '',
    location: '',
    specialization: '',
    contactInfo: '',
    price: '',
    availability: true
  });
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Validation
    const { name, experience, location, specialization, contactInfo, price } = formData;
    if (!name || !experience || !location || !specialization || !contactInfo || !price || !image) {
      toast.error('All fields including image are required.');
      return;
    }

    try {
      const fd = new FormData();
      fd.append('name', formData.name);
      fd.append('experience', formData.experience);
      fd.append('location', formData.location);
      fd.append('specialization', formData.specialization);
      fd.append('contactInfo', formData.contactInfo);
      fd.append('price', formData.price);
      fd.append('availability', formData.availability);
      fd.append('profileImage', image);

      const res = await axios.post('http://localhost:4000/api/gardeners', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data.success) {
        toast.success('Gardener added successfully!');
        setFormData({
          name: '',
          experience: '',
          location: '',
          specialization: '',
          contactInfo: '',
          price: '',
          availability: true
        });
        setImage(null);
      } else {
        toast.error('Failed to add gardener.');
      }
    } catch (err) {
      console.error('Error:', err);
      toast.error(err.response?.data?.message || 'Error adding gardener.');
    }
  };

  return (
    <>
      <div className="add-gardener">
        <h2>Add a New Gardener to Garden Key</h2>
        <form onSubmit={handleSubmit} className="form" aria-label="Add Gardener Form">
          <div className="image-upload">
            <label htmlFor="image">
              <img
                src={image ? URL.createObjectURL(image) : '/upload-placeholder.png'}
                alt="Upload Gardener Profile"
              />
            </label>
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              hidden
              aria-label="Upload Gardener Image"
            />
          </div>
          <input name="name" placeholder="Gardener Name" value={formData.name} onChange={handleChange} required aria-label="Gardener Name" />
          <input name="experience" placeholder="Experience (years)" value={formData.experience} onChange={handleChange} required aria-label="Experience" />
          <input name="location" placeholder="Location" value={formData.location} onChange={handleChange} required aria-label="Location" />
          <input name="specialization" placeholder="Specialization" value={formData.specialization} onChange={handleChange} required aria-label="Specialization" />
          <input name="contactInfo" placeholder="Contact Info" value={formData.contactInfo} onChange={handleChange} required aria-label="Contact Info" />
          <input name="price" placeholder="Price per Hour" value={formData.price} onChange={handleChange} type="number" required aria-label="Price per Hour" />
          <label className="availability-label">
            <input
              type="checkbox"
              name="availability"
              checked={formData.availability}
              onChange={handleChange}
              aria-label="Available"
            />
            Available
          </label>
          <button type="submit" className="submit-btn">Add Gardener</button>
        </form>
      </div>
    </>
  );
};

export default AddGardener;
