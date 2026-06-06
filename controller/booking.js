const Booking = require('../models/Booking');
const emailRender = require('../middleware/email');

exports.createBooking = async (req, res, next) => {
  try {
    const {
      service_id,
      booking_date,
      start_time,
      client_name,
      client_email,
      client_phone,
      location,
      notes,
      total_amount,
      agreed_to_terms,
    } = req.body;

    if (!agreed_to_terms) {
      return res.status(400).json({ message: 'You must agree to the terms' });
    }

    const booking = await Booking.create({
      service_id,
      booking_date,
      start_time,
      client_name,
      client_email,
      client_phone,
      location,
      notes,
      total_amount,
      agreed_to_terms,
      payment_status: 'pending',  
      booking_status: 'pending',  
    });

    res.status(201).json({ message: 'Booking created successfully', booking });
  } catch (error) {
    next(error);
  }
};

exports.getAllBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find()
      .populate('service_id', 'name base_price duration category') 
      .sort({ createdAt: -1 });
    res.status(200).json(bookings);
  } catch (error) {
    next(error);
  }
};

exports.getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('service_id', 'name base_price duration category');
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.status(200).json(booking);
  } catch (error) {
    next(error);
  }
};


exports.updateBookingStatus = async (req, res, next) => {
  try {
    const { booking_status } = req.body;
    const allowed = ['pending', 'confirmed', 'completed', 'cancelled'];

    if (!allowed.includes(booking_status)) {
      return res.status(400).json({ message: `Status must be one of: ${allowed.join(', ')}` });
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { booking_status },
      { new: true }
    );
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.status(200).json({ message: 'Booking status updated', booking });
  } catch (error) {
    next(error);
  }
};


exports.updatePaymentStatus = async (req, res, next) => {
  try {
    const { payment_status } = req.body;
    const allowed = ['pending', 'paid', 'cancelled', 'refunded'];

    if (!allowed.includes(payment_status)) {
      return res.status(400).json({ message: `Status must be one of: ${allowed.join(', ')}` });
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { payment_status },
      { new: true }
    );
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.status(200).json({ message: 'Payment status updated', booking });
  } catch (error) {
    next(error);
  }
};

exports.deleteBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.status(200).json({ message: 'Booking deleted successfully' });
  } catch (error) {
    next(error);
  }
};