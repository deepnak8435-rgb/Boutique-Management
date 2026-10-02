import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X, Scissors, CalendarDays, User, ChevronDown, LogOut, UserCircle, Shield, Sparkles } from "lucide-react";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();

  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const navLinkStyle = ({ isActive }) =>
    `flex items-center gap-1.5 text-sm font-medium transition duration-200 ${
      isActive
        ? "text-[#8B4513] font-bold border-b-2 border-[#8B4513] pb-0.5"
        : "text-stone-700 hover:text-[#8B4513]"
    }`;

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    setMenuOpen(false);
  };

  return (
    <nav className="bg-[#FAF6F0] border-b border-[#E5D9CC] sticky top-0 z-50 shadow-xs">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2.5 text-2xl font-serif font-bold text-[#38220F] tracking-wide"
        >
          <div className="w-10 h-10 rounded-full bg-[#8B4513] text-[#FAF6F0] flex items-center justify-center shadow-xs">
            <Scissors size={20} />
          </div>
          <span>Dewani Atelier</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">

          {/* Home */}
          <NavLink to="/" className={navLinkStyle}>
            Home
          </NavLink>

          {/* Custom Studio */}
          <NavLink to="/custom-designer" className={navLinkStyle}>
            <Sparkles size={16} className="text-[#8B4513]" />
            Custom Studio
          </NavLink>

          {/* Services */}
          <NavLink to="/services" className={navLinkStyle}>
            Services
          </NavLink>

          {/* Products */}
          <NavLink to="/products" className={navLinkStyle}>
            Couture Products
          </NavLink>

          {/* Logged In */}
          {user ? (
            <>
              {/* Admin Dashboard link if user is admin */}
              {user.role === "admin" && (
                <NavLink to="/admin" className={navLinkStyle}>
                  <Shield size={16} />
                  Admin Control
                </NavLink>
              )}

              {/* My Bookings */}
              <NavLink to="/my-bookings" className={navLinkStyle}>
                <CalendarDays size={16} />
                My Bookings
              </NavLink>

              {/* Profile Dropdown */}
              <div className="relative">

                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 text-stone-800
                             hover:text-[#8B4513] transition duration-200 bg-white/70 px-3 py-1.5 rounded-full border border-[#E5D9CC] cursor-pointer"
                >
                  <User size={18} className="text-[#8B4513]" />

                  <span className="font-semibold text-xs">
                    {user.name} {user.role === "admin" ? "(Admin)" : ""}
                  </span>

                  <ChevronDown
                    size={14}
                    className={`transition-transform duration-200 ${
                      profileOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Dropdown */}
                {profileOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-white
                                  border border-[#E5D9CC] rounded-2xl
                                  shadow-xl py-2 z-50">

                    {user.role === "admin" && (
                      <Link
                        to="/admin"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-3
                                   text-[#38220F] font-semibold hover:bg-[#FAF6F0]
                                   hover:text-[#8B4513] transition text-sm"
                      >
                        <Shield size={16} />
                        Admin Dashboard
                      </Link>
                    )}

                    <Link
                      to="/my-bookings"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 px-4 py-3
                                 text-stone-700 hover:bg-[#FAF6F0]
                                 hover:text-[#8B4513] transition text-sm"
                    >
                      <CalendarDays size={16} />
                      My Bookings & Slots
                    </Link>

                    <Link
                      to="/profile"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 px-4 py-3
                                 text-stone-700 hover:bg-[#FAF6F0]
                                 hover:text-[#8B4513] transition text-sm"
                    >
                      <UserCircle size={16} />
                      Fitting Specs Profile
                    </Link>

                    <div className="border-t border-[#E5D9CC] my-1"></div>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3
                                 text-stone-700 hover:bg-rose-50
                                 hover:text-rose-700 transition text-sm cursor-pointer"
                    >
                      <LogOut size={16} />
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
                to="/login"
                className="px-5 py-2.5 rounded-xl
                           bg-[#8B4513] text-[#FAF6F0]
                           hover:bg-[#6D340D]
                           transition duration-200
                           font-semibold text-xs shadow-xs"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="px-5 py-2.5 rounded-xl
                           border border-[#8B4513]
                           text-[#8B4513]
                           hover:bg-[#FAF6F0]
                           transition duration-200
                           font-semibold text-xs"
              >
                Register
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-stone-800"
        >
          {menuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {menuOpen && (
        <div className="md:hidden border-t border-[#E5D9CC] bg-[#FAF6F0] px-6 py-5 space-y-4">

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
            Couture Products
          </NavLink>

          {user ? (
            <>
              {/* My Bookings */}
              <NavLink
                to="/my-bookings"
                onClick={() => setMenuOpen(false)}
                className={navLinkStyle}
              >
                <CalendarDays size={16} />
                My Bookings & Slots
              </NavLink>

              {/* User Information */}
              <div className="border-t border-[#E5D9CC] pt-4">

                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-[#E5D9CC]
                                  flex items-center justify-center
                                  text-[#8B4513]">
                    <User size={18} />
                  </div>

                  <div>
                    <p className="text-xs text-stone-500">
                      Welcome
                    </p>

                    <p className="font-semibold text-stone-800 text-sm">
                      {user.name}
                    </p>
                  </div>
                </div>

                {/* Profile */}
                <Link
                  to="/profile"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 py-2
                             text-stone-700 hover:text-[#8B4513]"
                >
                  <UserCircle size={16} />
                  Fitting Specs Profile
                </Link>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="w-full mt-3 flex items-center justify-center
                             gap-2 bg-[#8B4513] text-[#FAF6F0] py-2.5
                             rounded-xl hover:bg-[#6D340D] transition text-xs font-semibold"
                >
                  <LogOut size={16} />
                  Logout
                </button>

              </div>
            </>
          ) : (
            /* Mobile Login */
            <Link
              to="/login"
              onClick={() => setMenuOpen(false)}
              className="block text-center bg-[#8B4513] text-[#FAF6F0]
                         py-2.5 rounded-xl hover:bg-[#6D340D] transition text-xs font-semibold"
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
