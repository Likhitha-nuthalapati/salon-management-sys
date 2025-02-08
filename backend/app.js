const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./db");
const admin = require("./firebase");
const User = require("./models/User");
const Appointment = require("./models/Appointment");
const Booking = require("./models/Booking");
const Service = require("./models/Service");

const app = express();
const port = 5000;
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB Atlas
connectDB();

// Middleware to authenticate users using Firebase UID token
const authenticateUser = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token provided" });

  try {
    const decodedUser = await admin.auth().verifyIdToken(token);
    req.user = decodedUser; // Store user info
    next();
  } catch (error) {
    return res.status(401).json({ error: "Unauthorized" });
  }
};

// **1. Appointment Endpoint**
app.post("/api/appointment", authenticateUser, async (req, res) => {
  const { time, name, email, phone } = req.body;
  const userId = req.user.uid;

  try {
    const appointment = new Appointment({ userId, time, name, email, phone });
    await appointment.save();
    res
      .status(201)
      .json({ message: "Appointment created successfully", appointment });
  } catch (error) {
    res.status(500).json({ error: "Error creating appointment" });
  }
});

// **2. Book Slot Endpoint**
app.post("/api/bookslot", authenticateUser, async (req, res) => {
  const { time, name, email, phone, date } = req.body;
  const userId = req.user.uid;

  try {
    const booking = new Booking({ userId, time, name, email, phone, date });
    await booking.save();
    res.status(201).json({ message: "Slot booked successfully", booking });
  } catch (error) {
    res.status(500).json({ error: "Error booking slot" });
  }
});

//  POST new service
app.post("/api/services", async (req, res) => {
  try {
    const { title, description, price, image } = req.body;
    if (!title || !description || !price || !image) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newService = new Service({ title, description, price, image });
    await newService.save();

    res
      .status(201)
      .json({ message: "Service added successfully", service: newService });
  } catch (error) {
    res.status(500).json({ message: "Error adding service", error });
  }
});

// **3. Services Endpoint**
// app.get("/api/status", async (req, res) => {
//   // Dummy services, replace this with real database logic if required
//   const services = ["Haircut", "Massage", "Facial", "Pedicure", "Manicure"];
//   res.json({ services });
// });

//GET all services in the required format
app.get("/api/services", async (req, res) => {
  try {
    const services = await Service.find();
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: "Error fetching services", error });
  }
});

// **4. Current Waiting List Endpoint**
app.get("/api/currentwaitinglist", async (req, res) => {
  try {
    const appointments = await Appointment.countDocuments({
      status: "pending",
    });
    res.json({ currentWaitingList: appointments });
  } catch (error) {
    res.status(500).json({ error: "Error fetching waiting list" });
  }
});

// **5. My Orders Endpoint**
app.get("/api/myorders", authenticateUser, async (req, res) => {
  const userId = req.user.uid;

  try {
    const appointments = await Appointment.find({ userId });
    const bookings = await Booking.find({ userId });
    res.json({ appointments, bookings });
  } catch (error) {
    res.status(500).json({ error: "Error fetching your orders" });
  }
});

app.listen(port, () => console.log(`Server running on port ${port}`));
