// 1.bring in the express library
const express = require("express");
const mongoose=require('mongoose');
const cors=require('cors')
// loads the .env file into process.env
require("dotenv").config();

const serviceRouter=require("./Routes/serviceRoutes")
const slotRoutes=require('./Routes/slotRoutes')
const bookingRoutes=require("./Routes/BookingRoute")
const authRoutes = require("./Routes/authRoutes");

// 2 create an app -this represent your whole server
const app = express();
app.use(express.json())
app.use(cors())
// Connect to mongodb
mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log('mongodb is connected successfully'))
.catch((err)=>console.log('mongodb connection error',err))


app.use("/api/services",serviceRouter)
app.use("/api/slots",slotRoutes)
app.use("/api/booking",bookingRoutes);
app.use("/api/auth",authRoutes);

// 3.define a route :when someone visit "/" (the homepage),send back a message
app.get("/", (req, res) => {
  res.send("boutique backend is running!");
});

// 4.tell the server to start listening for request on port 5000
const PORT = process.env.PORT||5000;
app.listen(PORT, () => {
  console.log(`server is running on http://localhost:${PORT}`);

});
