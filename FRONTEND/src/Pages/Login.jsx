import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Scissors,
} from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const nav = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const res = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }

      login(data.user, data.token);

      if (data.user?.role === "admin") {
        nav("/admin");
      } else {
        nav("/services");
      }

    } catch (err) {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white">

      {/* ================= LEFT SIDE ================= */}
      <div
        className="
          hidden lg:flex
          lg:w-1/2
          min-h-screen
          relative
          bg-cover
          bg-center
        "
        style={{
          backgroundImage: `
            linear-gradient(
              rgba(63, 25, 48, 0.35),
              rgba(63, 25, 48, 0.65)
            ),
            url("https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1200&q=80")
          `,
        }}
      >

        <div className="absolute inset-0 flex flex-col justify-between p-12 text-white">

          {/* Logo */}
          <div className="flex items-center gap-2 text-2xl font-semibold">
            <Scissors size={28} />
            <span>Dewani Boutique</span>
          </div>

          {/* Left Content */}
          <div className="mb-16 max-w-lg">

            <h1 className="font-serif text-6xl leading-tight font-medium">
              Elegance in
              <br />
              Every Stitch
            </h1>

            <p className="mt-6 max-w-md text-base leading-7 text-white/90">
              Manage your boutique with style,
              simplicity and confidence.
            </p>

          </div>

        </div>
      </div>

      {/* ================= RIGHT SIDE ================= */}
      <div className="w-full lg:w-1/2 min-h-screen flex items-center justify-center px-5 py-10 sm:px-10">

        <div className="w-full max-w-md">

          {/* Mobile Logo */}
          <div className="flex lg:hidden items-center justify-center gap-2 mb-12 text-2xl font-semibold text-pink-500">
            <Scissors size={25} />
            <span>Boutique</span>
          </div>

          {/* Heading */}
          <div className="mb-8">

            <h2 className="font-serif text-4xl font-medium text-[#321f2b]">
              Welcome Back
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Login to your boutique account
            </p>

          </div>

          {/* ================= FORM ================= */}
          <form onSubmit={handleSubmit}>

            {/* Email */}
            <div className="mb-5">

              <label
                htmlFor="email"
                className="block mb-2 text-sm font-semibold text-[#3c2a34]"
              >
                Email Address
              </label>

              <div
                className="
                  flex items-center gap-3
                  h-13
                  px-4
                  rounded-lg
                  border border-[#ddd5da]
                  bg-white
                  transition
                  focus-within:border-pink-500
                  focus-within:ring-4
                  focus-within:ring-pink-100
                "
              >

                <Mail
                  size={19}
                  className="text-[#a18d98] shrink-0"
                />

                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="
                    w-full
                    outline-none
                    bg-transparent
                    text-sm
                    text-gray-800
                    placeholder:text-gray-400
                  "
                />

              </div>

            </div>

            {/* Password */}
            <div className="mb-5">

              <label
                htmlFor="password"
                className="block mb-2 text-sm font-semibold text-[#3c2a34]"
              >
                Password
              </label>

              <div
                className="
                  flex items-center gap-3
                  h-13
                  px-4
                  rounded-lg
                  border border-[#ddd5da]
                  bg-white
                  transition
                  focus-within:border-pink-500
                  focus-within:ring-4
                  focus-within:ring-pink-100
                "
              >

                <Lock
                  size={19}
                  className="text-[#a18d98] shrink-0"
                />

                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="
                    w-full
                    outline-none
                    bg-transparent
                    text-sm
                    text-gray-800
                    placeholder:text-gray-400
                  "
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  className="
                    text-gray-400
                    hover:text-gray-600
                    transition
                  "
                >
                  {showPassword ? (
                    <EyeOff size={19} />
                  ) : (
                    <Eye size={19} />
                  )}
                </button>

              </div>

            </div>

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between mb-6 text-sm">

              <label className="flex items-center gap-2 text-gray-500 cursor-pointer">

                <input
                  type="checkbox"
                  className="
                    w-4 h-4
                    accent-pink-500
                  "
                />

                <span>Remember me</span>

              </label>

              <a
                href="/forgot-password"
                className="
                  text-pink-500
                  font-semibold
                  hover:text-pink-600
                  transition
                "
              >
                Forgot Password?
              </a>

            </div>

            {/* Error */}
            {error && (
              <div className="mb-4 rounded-lg bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="
                w-full
                h-13
                rounded-lg
                bg-pink-500
                hover:bg-pink-600
                active:bg-pink-700
                text-white
                text-sm
                font-semibold
                transition
                duration-200
                shadow-sm
                hover:shadow-md
                disabled:opacity-60
                disabled:cursor-not-allowed
              "
            >
              {loading ? "Logging in..." : "Log In"}
            </button>

          </form>

          {/* Register */}
          <p className="mt-7 text-center text-sm text-gray-500">

            Don't have an account?{" "}

            <a
              href="/register"
              className="
                font-semibold
                text-pink-500
                hover:text-pink-600
              "
            >
              Create Account
            </a>

          </p>

        </div>

      </div>

    </div>
  );
};

export default Login;