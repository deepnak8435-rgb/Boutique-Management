import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav style={{ display: "flex", gap: "16px", padding: "16px", borderBottom: "1px solid #ccc" }}>
      <Link to="/">Home</Link>
      <Link to="/services">Services</Link>
      <Link to="/my-bookings">My Bookings</Link>
      <Link to="/login">Login</Link>
      <Link to="/admin">Admin</Link>
    </nav>
  );
}

export default Navbar;