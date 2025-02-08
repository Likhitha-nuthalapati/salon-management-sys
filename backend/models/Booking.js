const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },

  time: { type: String, required: true },
  date: { type: String, required: true },
});

module.exports = mongoose.model("Booking", BookingSchema);
