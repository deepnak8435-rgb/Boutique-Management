import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, User, Eye, EyeOff, Scissors } from "lucide-react";

const Register = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [role, setRole] = useState("customer");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

const handleSubmit = async (e) => {
  e.preventDefault();

  setError("");

  // Check passwords
  if (password !== confirmPassword) {
    setError("Passwords do not match");
    return;
  }

  setLoading(true);

  try {
    const res = await fetch(
      "http://localhost:5000/api/auth/signup",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          role,
        }),
      }
    );

    const data = await res.json();

    // If email already exists
    if (!res.ok) {
      if (data.error === "Email already registered") {
        navigate("/login", {
          state: {
            email: email,
            message: "This email is already registered. Please login.",
          },
        });

        return;
      }

      setError(data.error || "Registration failed");
      return;
    }

    // New user registered successfully
    alert("Account created successfully!");

    // Go to login page
    navigate("/login", {
      state: {
        email: email,
        message: "Registration successful. Please login.",
      },
    });

  } catch (err) {
    console.error(err);
    setError("Something went wrong. Please try again.");
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="min-h-screen flex bg-white">

      {/* LEFT SIDE */}
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

          <div className="flex items-center gap-2 text-2xl font-semibold">
            <Scissors size={28} />
            <span>Dewani Boutique</span>
          </div>

          <div className="mb-16 max-w-lg">
            <h1 className="font-serif text-6xl leading-tight font-medium">
              Create your
              <br />
              Account
            </h1>

            <p className="mt-6 max-w-md text-base leading-7 text-white/90">
              Join Dewani Boutique and manage your boutique
              with style, simplicity and confidence.
            </p>
          </div>

        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="w-full lg:w-1/2 min-h-screen flex items-center justify-center px-5 py-10 sm:px-10">

        <div className="w-full max-w-md">

          {/* Mobile Logo */}
          <div className="flex lg:hidden items-center justify-center gap-2 mb-12 text-2xl font-semibold text-pink-500">
            <Scissors size={25} />
            <span>Dewani Boutique</span>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h2 className="font-serif text-4xl font-medium text-[#321f2b]">
              Create Account
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Register your boutique account
            </p>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit}>

            {/* Name */}
            <div className="mb-5">
              <label
                htmlFor="name"
                className="block mb-2 text-sm font-semibold text-[#3c2a34]"
              >
                Full Name
              </label>

              <div className="flex items-center gap-3 h-13 px-4 rounded-lg border border-[#ddd5da] bg-white focus-within:border-pink-500 focus-within:ring-4 focus-within:ring-pink-100">
                <User
                  size={19}
                  className="text-[#a18d98] shrink-0"
                />

                <input
                  id="name"
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full outline-none bg-transparent text-sm text-gray-800 placeholder:text-gray-400"
                />
              </div>
            </div>

            {/* Account Role */}
            <div className="mb-5">
              <label
                htmlFor="role"
                className="block mb-2 text-sm font-semibold text-[#3c2a34]"
              >
                Register As
              </label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full h-13 px-4 rounded-lg border border-[#ddd5da] bg-white outline-none text-sm text-gray-800 focus:border-pink-500 focus:ring-4 focus:ring-pink-100"
              >
                <option value="customer">Customer / Client</option>
                <option value="admin">Admin / Store Manager</option>
              </select>
            </div>

            {/* Email */}
            <div className="mb-5">
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-semibold text-[#3c2a34]"
              >
                Email Address
              </label>

              <div className="flex items-center gap-3 h-13 px-4 rounded-lg border border-[#ddd5da] bg-white focus-within:border-pink-500 focus-within:ring-4 focus-within:ring-pink-100">
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
                  className="w-full outline-none bg-transparent text-sm text-gray-800 placeholder:text-gray-400"
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

              <div className="flex items-center gap-3 h-13 px-4 rounded-lg border border-[#ddd5da] bg-white focus-within:border-pink-500 focus-within:ring-4 focus-within:ring-pink-100">

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
                  className="w-full outline-none bg-transparent text-sm text-gray-800 placeholder:text-gray-400"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff size={19} />
                  ) : (
                    <Eye size={19} />
                  )}
                </button>

              </div>
            </div>

            {/* Confirm Password */}
            <div className="mb-5">
              <label
                htmlFor="confirmPassword"
                className="block mb-2 text-sm font-semibold text-[#3c2a34]"
              >
                Confirm Password
              </label>

              <div className="flex items-center gap-3 h-13 px-4 rounded-lg border border-[#ddd5da] bg-white focus-within:border-pink-500 focus-within:ring-4 focus-within:ring-pink-100">

                <Lock
                  size={19}
                  className="text-[#a18d98] shrink-0"
                />

                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full outline-none bg-transparent text-sm text-gray-800 placeholder:text-gray-400"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  className="text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={19} />
                  ) : (
                    <Eye size={19} />
                  )}
                </button>

              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-4 rounded-lg bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            {/* Register Button */}
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
              {loading ? "Creating Account..." : "Create Account"}
            </button>

          </form>

          {/* Login */}
          <p className="mt-7 text-center text-sm text-gray-500">

            Already have an account?{" "}

            <button
              onClick={() => navigate("/login")}
              className="font-semibold text-pink-500 hover:text-pink-600"
            >
              Login
            </button>

          </p>

        </div>
      </div>
    </div>
  );
};

export default Register;