const mongoose = require("mongoose");

// Define Service Schema
const ServiceSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: String,
  image: String,
});

module.exports = mongoose.model("Service", ServiceSchema);
