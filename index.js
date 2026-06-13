const express = require('express');
const mongoose = require('mongoose');
const cors = require('./config/cors');
require('dotenv').config();

const userRoutes = require('./routes/user');
const serviceRoues = require('./routes/services');
const contactRoutes = require('./routes/contact');
const bookingRoutes = require('./routes/booking');
const availabilityRoutes = require('./routes/availability');
const stripeRoutes = require('./routes/stripe');
const uploadRoutes = require('./routes/upload');
const heroRoutes = require('./routes/hero');

const app = express();

app.use('/api/webhook', express.raw({ type: 'application/json' }), stripeRoutes);

app.set('trust proxy', 'loopback');
app.use(cors);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', userRoutes);
app.use('/api', serviceRoues);
app.use('/api', contactRoutes);
app.use('/api', bookingRoutes);
app.use('/api', availabilityRoutes);
app.use('/api', stripeRoutes);
app.use('/api', uploadRoutes);
app.use('/api', heroRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});

async function start() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    app.listen(process.env.PORT || 3000, () => {
      console.log(`Server running on port ${process.env.PORT || 3000}`);
    });
  } catch (err) {
    console.error('Failed to start:', err);
    process.exit(1);
  } 
}

start();  