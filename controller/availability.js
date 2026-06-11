const Availability = require('../models/Availability');
const Booking      = require('../models/Booking');

function generateSlots(start, end, durationMins) {
  const slots = [];
  const [startH, startM] = start.split(':').map(Number);
  const [endH,   endM]   = end.split(':').map(Number);

  let current = startH * 60 + startM;
  const endTotal = endH * 60 + endM;

  while (current + durationMins <= endTotal) {
    const h = Math.floor(current / 60).toString().padStart(2, '0');
    const m = (current % 60).toString().padStart(2, '0');
    slots.push(`${h}:${m}`);
    current += durationMins;
  }

  return slots;
}

// GET /availability?date=2026-12-05
// exports.getAvailability = async (req, res, next) => {
//   try {
//     const { date } = req.query;

//     if (!date) {
//       return res.status(400).json({ message: 'date query param is required' });
//     }

//     const dayOfWeek = new Date(date).getDay(); // 0 = Sunday, 6 = Saturday

//     const availability = await Availability.findOne({
//       day_of_week:  dayOfWeek,
//       is_available: true,
//     });

//     if (!availability) {
//       return res.status(200).json({ date, available: false, slots: [] });
//     }

//     // Get all bookings on that date
//     const bookings = await Booking.find({
//       booking_date:   date,
//       booking_status: { $nin: ['cancelled'] }, // exclude cancelled bookings
//     });

//     const bookedTimes = bookings.map((b) => b.start_time);

//     // Generate all slots then filter out booked ones
//     const allSlots       = generateSlots(availability.start_time, availability.end_time, availability.slot_duration_mins);
//     const availableSlots = allSlots.filter((slot) => !bookedTimes.includes(slot));

//     res.status(200).json({
//       date,
//       day_of_week:   dayOfWeek,
//       available:     true,
//       all_slots:     allSlots,
//       booked_slots:  bookedTimes,
//       available_slots: availableSlots,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// controller/availability.js — getAvailability
exports.getAvailability = async (req, res, next) => {
    try {
      const { date, duration } = req.query;
  
      if (!date) {
        return res.status(400).json({ message: 'date query param is required' });
      }
  
      const dayOfWeek = new Date(date).getDay();
  
      const availability = await Availability.findOne({
        day_of_week:  dayOfWeek,
        is_available: true,
      });
  
      if (!availability) {
        return res.status(200).json({ date, available: false, slots: [] });
      }
  
      const bookings = await Booking.find({
        booking_date:   date,
        booking_status: { $nin: ['cancelled'] },
      });
  
      const bookedTimes = bookings.map((b) => b.start_time);
  
      // ✅ Use duration from query if provided, otherwise fall back to schema default
      const slotDuration = duration ? Number(duration) : availability.slot_duration_mins;
  
      const allSlots       = generateSlots(availability.start_time, availability.end_time, slotDuration);
      const availableSlots = allSlots.filter((slot) => !bookedTimes.includes(slot));
  
      res.status(200).json({
        date,
        day_of_week:     dayOfWeek,
        available:       true,
        slot_duration:   slotDuration,
        all_slots:       allSlots,
        booked_slots:    bookedTimes,
        available_slots: availableSlots,
      });
    } catch (error) {
      next(error);
    }
  };

exports.getAllAvailability = async (req, res, next) => {
  try {
    const availability = await Availability.find().sort({ day_of_week: 1 });
    res.status(200).json(availability);
  } catch (error) {
    next(error);
  }
};

exports.createAvailability = async (req, res, next) => {
  try {
    const { day_of_week, start_time, end_time, slot_duration_mins } = req.body;

    if (day_of_week === undefined || !start_time || !end_time) {
      return res.status(400).json({ message: 'day_of_week, start_time and end_time are required' });
    }

    const existing = await Availability.findOne({ day_of_week });
    if (existing) {
      return res.status(409).json({ message: 'Availability for this day already exists' });
    }

    const availability = await Availability.create({
      day_of_week,
      start_time,
      end_time,
      slot_duration_mins,
    });

    res.status(201).json({ message: 'Availability created', availability });
  } catch (error) {
    next(error);
  }
};

exports.updateAvailability = async (req, res, next) => {
  try {
    const { start_time, end_time, is_available, slot_duration_mins } = req.body;

    const availability = await Availability.findByIdAndUpdate(
      req.params.id,
      { start_time, end_time, is_available, slot_duration_mins },
      { new: true, runValidators: true }
    );

    if (!availability) {
      return res.status(404).json({ message: 'Availability not found' });
    }

    res.status(200).json({ message: 'Availability updated', availability });
  } catch (error) {
    next(error);
  }
};

exports.toggleAvailability = async (req, res, next) => {
  try {
    const availability = await Availability.findById(req.params.id);
    if (!availability) {
      return res.status(404).json({ message: 'Availability not found' });
    }

    availability.is_available = !availability.is_available;
    await availability.save();

    res.status(200).json({
      message: `Day marked as ${availability.is_available ? 'available' : 'unavailable'}`,
      availability,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteAvailability = async (req, res, next) => {
  try {
    const availability = await Availability.findByIdAndDelete(req.params.id);
    if (!availability) {
      return res.status(404).json({ message: 'Availability not found' });
    }
    res.status(200).json({ message: 'Availability deleted' });
  } catch (error) {
    next(error);
  }
};