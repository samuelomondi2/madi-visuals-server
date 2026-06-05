const express = require('express');
const router = express.Router();
const bookingController = require('../controller/booking');

router.post('/booking',              bookingController.createBooking);
router.get('/booking',               bookingController.getAllBookings);
router.get('/booking/:id',            bookingController.getBookingById);
router.patch('/booking/:id/status',   bookingController.updateBookingStatus);
router.patch('/booking/:id/payment',  bookingController.updatePaymentStatus);
router.delete('/booking/:id',         bookingController.deleteBooking);

module.exports = router;