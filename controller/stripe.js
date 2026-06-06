const stripe  = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Booking = require('../models/Booking');

exports.createCheckoutSession = async (req, res, next) => {
  try {
    const { bookingId } = req.body;

    if (!bookingId) {
      return res.status(400).json({ message: 'bookingId is required' });
    }

    const booking = await Booking.findById(bookingId).populate('service_id');
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            unit_amount: booking.total_amount * 100, 
            product_data: {
              name: booking.service_id?.name || 'Photography Session',
              description: `${booking.booking_date} at ${booking.start_time}`,
            },
          },
          quantity: 1,
        },
      ],
      customer_email: booking.client_email,
      metadata: {
        bookingId: booking._id.toString(), 
      },
      success_url: `${process.env.NEXT_PUBLIC_CLIENT_URL}/booking/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:  `${process.env.NEXT_PUBLIC_CLIENT_URL}/booking/cancelled`,
    });

    res.status(200).json({ url: session.url });
  } catch (error) {
    next(error);
  }
};

exports.handleWebhook = async (req, res) => {
  const sig    = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,                         
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session   = event.data.object;
    const bookingId = session.metadata.bookingId;

    try {
      await Booking.findByIdAndUpdate(bookingId, {
        payment_status: 'paid',
        booking_status: 'confirmed',
      });
      console.log(`Booking ${bookingId} confirmed`);
    } catch (err) {
      console.error('Failed to update booking:', err.message);
    }
  }

  if (event.type === 'checkout.session.expired') {
    const session   = event.data.object;
    const bookingId = session.metadata.bookingId;

    try {
      await Booking.findByIdAndUpdate(bookingId, {
        payment_status: 'cancelled',
        booking_status: 'cancelled',
      });
      console.log(`Booking ${bookingId} cancelled`);
    } catch (err) {
      console.error('Failed to cancel booking:', err.message);
    }
  }

  res.status(200).json({ received: true });
};