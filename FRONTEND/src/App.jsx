import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Services from "./pages/Services";
import { BookSlots } from "./Pages/BookSlots";
import { MyBookings } from "./Pages/MyBookings";
import { Login } from "./Pages/Login";
import { AdminDashboard } from "./Pages/AdminDashboard";
// import Slot from "./Pages/Slot"

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/services" element={<Services />} />
        <Route path="/book/:slotd" element={<BookSlots />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminDashboard />} />
        {/* <Route path="/slots/:serviceId" element={<Slot/>}></Route> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
