
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import {Menu,X, Scissors, CalendarDays, User, ChevronDown, LogOut, UserCircle,} from "lucide-react";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();

  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const navLinkStyle = ({ isActive }) =>
    `flex items-center gap-1 transition duration-200 ${
      isActive
        ? "text-pink-600 font-semibold"
        : "text-gray-700 hover:text-pink-600"
    }`;

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    setMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 text-2xl font-bold text-pink-600"
        >
          <Scissors size={26} />
          <span>Dewani Boutique</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">

          {/* Home */}
          <NavLink to="/" className={navLinkStyle}>
            Home
          </NavLink>

          {/* Services */}
          <NavLink to="/services" className={navLinkStyle}>
            Services
          </NavLink>

          {/* Products */}
          <NavLink to="/products" className={navLinkStyle}>
            Products
          </NavLink>

          {/* Logged In */}
          {user ? (
            <>
              {/* My Bookings */}
              <NavLink to="/my-bookings" className={navLinkStyle}>
                <CalendarDays size={18} />
                My Bookings
              </NavLink>

              {/* Profile Dropdown */}
              <div className="relative">

                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 text-gray-700
                             hover:text-pink-600 transition duration-200"
                >
                  <User size={20} />

                  <span className="font-medium">
                    {user.name}
                  </span>

                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-200 ${
                      profileOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Dropdown */}
                {profileOpen && (
                  <div className="absolute right-0 mt-3 w-52 bg-white
                                  border border-gray-100 rounded-xl
                                  shadow-lg py-2">

                    <Link
                      to="/profile"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 px-4 py-3
                                 text-gray-700 hover:bg-pink-50
                                 hover:text-pink-600 transition"
                    >
                      <UserCircle size={18} />
                      My Profile
                    </Link>

                    <Link
                      to="/my-bookings"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 px-4 py-3
                                 text-gray-700 hover:bg-pink-50
                                 hover:text-pink-600 transition"
                    >
                      <CalendarDays size={18} />
                      My Bookings
                    </Link>

                    <div className="border-t my-1"></div>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3
                                 text-gray-700 hover:bg-red-50
                                 hover:text-red-600 transition"
                    >
                      <LogOut size={18} />
                      Logout
                    </button>

                  </div>
                )}
              </div>
            </>
        ) : (
  /* Logged Out */
  <div className="flex items-center gap-3">

    <Link
      to="/register"
      className="px-5 py-2.5 rounded-lg
                 border border-pink-600
                 text-pink-600
                 hover:bg-pink-50
                 transition duration-200
                 font-medium"
    >
      Register
    </Link>

  

  </div>
)}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-gray-700"
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {menuOpen && (
        <div className="md:hidden border-t bg-white px-6 py-5 space-y-4">

          {/* Home */}
          <NavLink
            to="/"
            onClick={() => setMenuOpen(false)}
            className={navLinkStyle}
          >
            Home
          </NavLink>

          {/* Services */}
          <NavLink
            to="/services"
            onClick={() => setMenuOpen(false)}
            className={navLinkStyle}
          >
            Services
          </NavLink>

          {/* Products */}
          <NavLink
            to="/products"
            onClick={() => setMenuOpen(false)}
            className={navLinkStyle}
          >
            Products
          </NavLink>

          {user ? (
            <>
              {/* My Bookings */}
              <NavLink
                to="/my-bookings"
                onClick={() => setMenuOpen(false)}
                className={navLinkStyle}
              >
                <CalendarDays size={18} />
                My Bookings
              </NavLink>

              {/* User Information */}
              <div className="border-t pt-4">

                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-pink-100
                                  flex items-center justify-center
                                  text-pink-600">
                    <User size={20} />
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">
                      Welcome
                    </p>

                    <p className="font-semibold text-gray-800">
                      {user.name}
                    </p>
                  </div>
                </div>

                {/* Profile */}
                <Link
                  to="/profile"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 py-2
                             text-gray-700 hover:text-pink-600"
                >
                  <UserCircle size={18} />
                  My Profile
                </Link>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="w-full mt-3 flex items-center justify-center
                             gap-2 bg-pink-600 text-white py-2.5
                             rounded-lg hover:bg-pink-700 transition"
                >
                  <LogOut size={18} />
                  Logout
                </button>

              </div>
            </>
          ) : (
            /* Mobile Login */
            <Link
              to="/login"
              onClick={() => setMenuOpen(false)}
              className="block text-center bg-pink-600 text-white
                         py-2.5 rounded-lg hover:bg-pink-700 transition"
            >
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;

