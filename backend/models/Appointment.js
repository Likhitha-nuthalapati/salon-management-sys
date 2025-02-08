const mongoose = require("mongoose");

const AppointmentSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },

  time: { type: String, required: true },
  status: { type: String, default: "pending" }, // e.g., 'pending', 'completed'
});

module.exports = mongoose.model("Appointment", AppointmentSchema);
