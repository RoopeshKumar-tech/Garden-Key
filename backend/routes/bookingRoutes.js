import express from 'express';
import mongoose from 'mongoose';
import Booking from '../models/bookingModel.js'; // Do you have this model?
import Order from '../models/orderModel.js';
import Gardener from '../models/gardenerModel.js';
// If not, I can create a simple version for you

const router = express.Router();

// Route: POST /api/bookings
router.post('/', async (req, res) => {
  try {
    const { userId, gardenerId, date, timeSlot } = req.body;

    if (!gardenerId || !date || !timeSlot) {
      return res.status(400).json({ message: 'Missing booking fields' });
    }

    const newBooking = new Booking({
      userId,
      gardenerId,
      date,
      timeSlot,
      status: 'pending',
    });

    await newBooking.save();

    // Fetch gardener details for storing in order
    const gardener = await Gardener.findById(gardenerId);

    // Also create an order of type 'gardener'
    const order = new Order({
      orderId: 'GD' + Date.now(),
      userId,
      type: 'gardener',
      gardenerId,
      date,
      timeSlot,
      bookingStatus: 'pending',
      status: 'pending',
      specialization: gardener?.specialization,
      contactInfo: gardener?.contactInfo,
      location: gardener?.location,
      profileImage: gardener?.profileImage,
      name: gardener?.name
    });
    await order.save();

    res.status(201).json({ message: 'Booking request submitted', booking: newBooking });
  } catch (err) {
    console.error('Booking error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});
// Get all bookings (for admin)
router.get('/user/:userId', async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.params.userId }).populate('gardenerId');
    res.json({ success: true, bookings });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching user bookings' });
  }
});

// ✅ Approve a booking
router.put('/:id/approve', async (req, res) => {
  try {
    const updated = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: 'approved' },
      { new: true }
    );
    res.json({ success: true, message: 'Booking approved', booking: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ✅ Reject a booking
router.put('/:id/reject', async (req, res) => {
  try {
    const updated = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected' },
      { new: true }
    );
    res.json({ success: true, message: 'Booking rejected', booking: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});
export default router;

