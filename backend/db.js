const mongoose = require("mongoose");

// MongoDB Atlas connection
const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://admin:2015@manicluster.qeges.mongodb.net/?retryWrites=true&w=majority&appName=ManiCluster",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log("MongoDB connected...");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;
