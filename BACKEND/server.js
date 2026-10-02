// 1.bring in the express library
const express = require("express");
const mongoose=require('mongoose');
const cors=require('cors')
// loads the .env file into process.env
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const serviceRouter=require("./Routes/serviceRoutes")
const slotRoutes=require('./Routes/slotRoutes')
const bookingRoutes=require("./Routes/BookingRoute")
const authRoutes = require("./Routes/authRoutes");
const productRoutes = require("./Routes/productRoutes");
const adminRoutes = require("./Routes/adminRoutes");
const paymentRoutes = require("./Routes/paymentRoutes");
const userRoutes = require("./Routes/userRoutes");
const reviewRoutes = require("./Routes/reviewRoutes");

// 2 create an app -this represent your whole server
const app = express();
app.use(express.json())
app.use(cors())

// Serve static uploaded files directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Connect to mongodb
const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/boutique_management";
mongoose.connect(mongoUri)
.then(()=>console.log('mongodb is connected successfully'))
.catch((err)=>console.log('mongodb connection error',err))


app.use("/api/services", serviceRouter);
app.use("/api/slots", slotRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/booking", bookingRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/users", userRoutes);
app.use("/api/reviews", reviewRoutes);

// 3.define a route :when someone visit "/" (the homepage),send back a message
app.get("/", (req, res) => {
  res.send("boutique backend is running!");
});

// 4.tell the server to start listening for request on port 5000
const PORT = process.env.PORT||5000;
app.listen(PORT, () => {
  console.log(`server is running on http://localhost:${PORT}`);

});
