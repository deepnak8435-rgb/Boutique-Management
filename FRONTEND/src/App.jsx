import { Routes, Route } from "react-router-dom";

import Services from "./Pages/Services";
import Products from "./Pages/Products";
import Navbar from "./Components/Navbar";
import Login from "./Pages/Login";
import Home from "./Pages/Home";
import Register from "./Pages/Register";
import Booking from "./Pages/BookSlots";
import Slots from "./Pages/Slot";
import MyBookings from "./Pages/MyBookings";
import AdminDashboard from "./Pages/AdminDashboard";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/services" element={<Services />} />
        <Route path="/products" element={<Products />} />

        {/* Select available slot */}
        <Route path="/slots/:serviceId" element={<Slots />} />

        {/* Confirm selected slot */}
        <Route path="/book/:slotId" element={<Booking />} />
        <Route path="/booking" element={<Services />} />

        {/* Customer Bookings */}
        <Route path="/my-bookings" element={<MyBookings />} />

        {/* Admin Dashboard */}
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </>
  );
}

export default App;
