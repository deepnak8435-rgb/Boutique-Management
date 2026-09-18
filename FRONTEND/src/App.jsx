import { Routes, Route } from "react-router-dom";

import Services from "./Pages/Services";
import Navbar from "./Components/Navbar";
import Login from "./Pages/Login";
import Home from "./Pages/Home";
import Register from "./Pages/Register";
import Booking from "./Pages/BookSlots";
import Slots from "./Pages/Slot";

function App() {
  return (
    <>
      <Navbar />

      <Routes>

        <Route path="/" element={<Home />} />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/services"
          element={<Services />}
        />

        {/* Select available slot */}
        <Route
          path="/slots/:serviceId"
          element={<Slots />}
        />

        {/* Confirm selected slot */}
        <Route
          path="/book/:slotId"
          element={<Booking />}
        />

      </Routes>
    </>
  );
}

export default App;
