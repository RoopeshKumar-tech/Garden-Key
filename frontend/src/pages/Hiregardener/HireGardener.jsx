import React, { useEffect, useState } from 'react';
import './HireGardener.css';
import axios from 'axios';
import { useCart } from '../../context/CartContext';

const timeSlots = [
  '7:00 AM - 9:00 AM',
  '9:00 AM - 11:00 AM',
  '11:00 AM - 1:00 PM',
  '1:00 PM - 3:00 PM',
  '3:00 PM - 5:00 PM',
];

const HireGardener = () => {
  const [gardeners, setGardeners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingGardenerId, setBookingGardenerId] = useState(null);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTimeSlot, setBookingTimeSlot] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchGardeners = async () => {
      try {
        const res = await axios.get('http://localhost:4000/api/gardeners');
        setGardeners(res.data.gardeners);
      } catch (err) {
        console.error('Failed to load gardeners:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchGardeners();
  }, []);

  // Fetch booked slots when a gardener is selected
  const fetchBookedSlots = async (gardenerId) => {
    if (!gardenerId) return;
    try {
      const res = await axios.get(`http://localhost:4000/api/bookings/slots/${gardenerId}`);
      setBookedSlots(res.data.bookings || []);
      setBookingDate('');
      setBookingTimeSlot('');
      setAvailableSlots([]);
    } catch (err) {
      console.error(err);
    }
  };

  const startBooking = (gardenerId) => {
    setBookingGardenerId(gardenerId);
    fetchBookedSlots(gardenerId);
  };

  const cancelBooking = () => {
    setBookingGardenerId(null);
    setBookingDate('');
    setBookingTimeSlot('');
    setAvailableSlots([]);
  };

  // Update available time slots when date changes
  useEffect(() => {
    if (!bookingDate) return;
    const unavailable = bookedSlots
      .filter(b => b.date === bookingDate)
      .map(b => b.timeSlot);
    const filtered = timeSlots.filter(slot => !unavailable.includes(slot));
    setAvailableSlots(filtered);
    setBookingTimeSlot('');
  }, [bookingDate, bookedSlots]);

  const submitBooking = async () => {
    if (!bookingDate || !bookingTimeSlot) {
      alert('Please select both date and time slot');
      return;
    }

    const user = localStorage.getItem('userData');
    let userId = null;
    if (user) {
      try {
        userId = JSON.parse(user)._id || JSON.parse(user).id;
      } catch (e) {
        userId = null;
      }
    }
    if (!userId) {
      alert('You must be logged in to book a gardener.');
      return;
    }

    setBookingLoading(true);
    try {
      await axios.post('http://localhost:4000/api/bookings', {
        userId,
        gardenerId: bookingGardenerId,
        date: bookingDate,
        timeSlot: bookingTimeSlot,
      });
      alert('Booking request sent. Admin will approve and notify you.');
      cancelBooking();
    } catch (error) {
      console.error('Booking failed:', error);
      alert(error.response?.data?.message || 'Failed to send booking request. Please try again.');
    } finally {
      setBookingLoading(false);
    }
  };

  const addBookingToCart = (gardener, date, timeSlot) => {
    addToCart({
      id: gardener._id,
      name: gardener.name,
      price: gardener.pricePerHour,
      image: gardener.profileImage,
      quantity: 1,
      date,
      timeSlot,
      type: 'gardener',
      specialization: gardener.specialization,
      contact: gardener.contactInfo,
      location: gardener.location,
    });
    alert('Gardener booking added to cart!');
  };

  if (loading) return <p>Loading gardeners...</p>;
  if (!gardeners.length) return <p>No gardeners available right now.</p>;

  return (
    <div className="hire-gardener-list">
      <h2>Available Gardeners</h2>
      <div className="gardener-cards">
        {gardeners.map((gardener) => (
          <div key={gardener._id} className="gardener-card">
            <img src={gardener.profileImage ? `http://localhost:4000${gardener.profileImage}` : '/profile_image.png'} alt={gardener.name} />
            <h3>{gardener.name}</h3>
            <p><strong>Experience:</strong> {gardener.experience} years</p>
            <p><strong>Location:</strong> {gardener.location}</p>
            <p><strong>Specialization:</strong> {gardener.specialization}</p>
            <p><strong>Contact:</strong> {gardener.contactInfo}</p>
            <p><strong>Available:</strong> {gardener.availability ? 'Yes' : 'No'}</p>

            {bookingGardenerId === gardener._id ? (
              <div className="booking-form">
                <label>
                  Select Date:
                  <input
                    type="date"
                    value={bookingDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setBookingDate(e.target.value)}
                  />
                </label>
                <label>
                  Select Time Slot:
                  <select
                    value={bookingTimeSlot}
                    onChange={(e) => setBookingTimeSlot(e.target.value)}
                  >
                    <option value="">--Choose a time slot--</option>
                    {availableSlots.length === 0 && <option disabled>No slots available</option>}
                    {availableSlots.map((slot) => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                </label>
                <button onClick={submitBooking} disabled={bookingLoading}>
                  {bookingLoading ? 'Booking...' : 'Submit Booking'}
                </button>
                <button onClick={cancelBooking} disabled={bookingLoading}>Cancel</button>
              </div>
            ) : (
              <button
                className="book-btn"
                disabled={!gardener.availability}
                onClick={() => startBooking(gardener._id)}
              >
                Book Gardener
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HireGardener;
