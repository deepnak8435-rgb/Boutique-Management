import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  CalendarDays,
  Clock,
  CheckCircle,
  AlertCircle,
  CreditCard,
  QrCode,
  Banknote,
  Smartphone,
  Check,
  ArrowLeft,
  Scissors,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

function BookSlots() {
  const { slotId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const productContext = location.state?.product || null;

  const { user } = useAuth();

  const [slot, setSlot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [paying, setPaying] = useState(false);

  const [selectedMethod, setSelectedMethod] = useState("upi"); // "upi" | "card" | "cod"
  const [upiId, setUpiId] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Get selected slot
  useEffect(() => {
    fetch(`http://localhost:5000/api/slots/${slotId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load slot");
        return res.json();
      })
      .then((data) => setSlot(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [slotId]);

  // Cash on Delivery / Pay at Boutique Booking Handler
  const handleBookingCOD = async () => {
    setError("");
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      setBooking(true);
      const token = user?.token || localStorage.getItem("token");

      const response = await fetch("http://localhost:5000/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ slotId, paymentMethod: "cod" }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Booking failed");

      setSuccess("Your appointment has been booked with Cash on Delivery! Status: Pending Approval.");
      setTimeout(() => navigate("/my-bookings"), 1800);
    } catch (err) {
      setError(err.message);
    } finally {
      setBooking(false);
    }
  };

  // Digital Payment Checkout & Instant Confirmation (UPI / Card)
  const handlePaymentCheckout = async (methodType) => {
    setError("");
    if (!user) {
      navigate("/login");
      return;
    }

    if (methodType === "upi" && !upiId.trim()) {
      setError("Please enter a valid UPI ID (e.g., yourname@okaxis or 9876543210@paytm)");
      return;
    }

    setPaying(true);
    try {
      const token = user?.token || localStorage.getItem("token");
      const amount = slot.service?.price || 500;

      // 1. Create order
      const orderRes = await fetch("http://localhost:5000/api/payments/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount, slotId }),
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok) throw new Error(orderData.error || "Failed to initiate payment");

      // 2. Verify payment & confirm booking
      const verifyRes = await fetch("http://localhost:5000/api/payments/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          razorpay_order_id: orderData.order.id,
          razorpay_payment_id: `pay_${methodType}_${Date.now()}`,
          razorpay_signature: "sig_demo_12345",
          slotId,
          paymentMethod: methodType,
        }),
      });

      const verifyData = await verifyRes.json();
      if (!verifyRes.ok) throw new Error(verifyData.error || "Payment verification failed");

      setSuccess(
        `Payment via ${methodType.toUpperCase()} Verified & Appointment Confirmed! Confirmation email sent.`
      );
      setTimeout(() => navigate("/my-bookings"), 1800);
    } catch (err) {
      setError(err.message);
    } finally {
      setPaying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fffafc] flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-pink-200 border-t-pink-600 rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-gray-500 font-medium text-sm">Loading appointment details...</p>
        </div>
      </div>
    );
  }

  if (error && !slot) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 bg-[#fffafc]">
        <div className="text-center max-w-md bg-white p-8 rounded-3xl border border-pink-100 shadow-sm">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-3 text-[#321f2b]">Unable to Load Appointment</h2>
          <p className="text-gray-500 text-sm mb-6">{error}</p>
          <button
            onClick={() => navigate("/services")}
            className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-xl font-semibold text-sm transition"
          >
            Back to Services
          </button>
        </div>
      </div>
    );
  }

  if (!slot) return null;

  return (
    <div className="min-h-screen bg-[#fffafc] py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Back link */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-pink-600 mb-6 uppercase tracking-wider transition cursor-pointer"
        >
          <ArrowLeft size={16} /> Choose Another Slot
        </button>

        {/* Selected Product Context Banner */}
        {productContext && (
          <div className="bg-gradient-to-r from-[#321f2b] to-[#542943] text-white rounded-3xl p-6 shadow-lg mb-8 flex items-center gap-5">
            <img
              src={productContext.image}
              alt={productContext.name}
              className="w-16 h-16 rounded-2xl object-cover border border-white/20 shrink-0"
            />
            <div>
              <span className="bg-pink-500/30 text-pink-200 text-[10px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider">
                Product Fitting Trial Item
              </span>
              <h3 className="font-serif text-xl font-bold mt-1">{productContext.name}</h3>
              <p className="text-pink-100/70 text-xs mt-0.5">
                Category: {productContext.category} | Fabric: {productContext.fabric || "Silk"}
              </p>
            </div>
          </div>
        )}

        <div className="bg-white rounded-3xl border border-pink-100 shadow-xl p-6 sm:p-8">
          {/* Header */}
          <div className="border-b border-gray-100 pb-6 mb-6">
            <div className="flex items-center gap-2 text-pink-600 font-semibold text-xs uppercase tracking-wider mb-1">
              <Scissors size={16} /> Dewani Boutique Fitting Confirmation
            </div>
            <h1 className="font-serif text-3xl font-bold text-[#321f2b]">Confirm Slot & Payment</h1>
          </div>

          {/* Service & Slot Specs */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-pink-50/60 rounded-2xl p-5 border border-pink-100">
              <span className="text-[11px] font-bold text-pink-700 uppercase tracking-wider">Selected Service</span>
              <h3 className="font-serif text-2xl font-bold text-[#321f2b] mt-1">
                {slot.service?.name || "Boutique Service"}
              </h3>
              <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                {slot.service?.description || "Specialized custom tailoring & fitting session."}
              </p>
              <p className="text-pink-600 font-bold text-xl mt-3">
                Fee: ₹{slot.service?.price || 0}
              </p>
            </div>

            <div className="bg-purple-50/60 rounded-2xl p-5 border border-purple-100 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold text-purple-700 uppercase tracking-wider">Schedule Details</span>
                <div className="flex items-center gap-2 mt-2 text-gray-800 font-semibold text-sm">
                  <CalendarDays size={16} className="text-purple-600" />
                  <span>
                    {new Date(slot.date).toLocaleDateString("en-IN", {
                      weekday: "short",
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1.5 text-gray-800 font-semibold text-sm">
                  <Clock size={16} className="text-purple-600" />
                  <span>{slot.startTime} - {slot.endTime}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="mb-8">
            <h2 className="font-serif text-xl font-bold text-[#321f2b] mb-1">Select Payment Method</h2>
            <p className="text-xs text-gray-500 mb-4">Choose how you would like to pay for your fitting appointment.</p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Option 1: UPI / Google Pay / PhonePe / Paytm */}
              <div
                onClick={() => setSelectedMethod("upi")}
                className={`p-5 rounded-2xl border-2 transition cursor-pointer relative ${
                  selectedMethod === "upi"
                    ? "border-pink-600 bg-pink-50/40 shadow-sm"
                    : "border-gray-200 bg-white hover:border-pink-200"
                }`}
              >
                {selectedMethod === "upi" && (
                  <div className="absolute top-3 right-3 w-5 h-5 bg-pink-600 text-white rounded-full flex items-center justify-center">
                    <Check size={12} />
                  </div>
                )}
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
                  <Smartphone size={22} />
                </div>
                <h4 className="font-bold text-gray-900 text-sm">UPI / Google Pay</h4>
                <p className="text-[11px] text-gray-500 mt-1">GPay, PhonePe, Paytm, BHIM UPI</p>

                <div className="flex items-center gap-1.5 mt-3 flex-wrap">
                  <span className="text-[9px] font-bold px-2 py-0.5 bg-blue-100 text-blue-800 rounded">GPay</span>
                  <span className="text-[9px] font-bold px-2 py-0.5 bg-purple-100 text-purple-800 rounded">PhonePe</span>
                  <span className="text-[9px] font-bold px-2 py-0.5 bg-sky-100 text-sky-800 rounded">Paytm</span>
                </div>
              </div>

              {/* Option 2: Debit / Credit Card */}
              <div
                onClick={() => setSelectedMethod("card")}
                className={`p-5 rounded-2xl border-2 transition cursor-pointer relative ${
                  selectedMethod === "card"
                    ? "border-pink-600 bg-pink-50/40 shadow-sm"
                    : "border-gray-200 bg-white hover:border-pink-200"
                }`}
              >
                {selectedMethod === "card" && (
                  <div className="absolute top-3 right-3 w-5 h-5 bg-pink-600 text-white rounded-full flex items-center justify-center">
                    <Check size={12} />
                  </div>
                )}
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                  <CreditCard size={22} />
                </div>
                <h4 className="font-bold text-gray-900 text-sm">Cards & Netbanking</h4>
                <p className="text-[11px] text-gray-500 mt-1">Visa, Mastercard, RuPay Cards</p>

                <div className="flex items-center gap-1.5 mt-3 flex-wrap">
                  <span className="text-[9px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded">Visa</span>
                  <span className="text-[9px] font-bold px-2 py-0.5 bg-amber-100 text-amber-800 rounded">Mastercard</span>
                </div>
              </div>

              {/* Option 3: Cash on Delivery / Pay at Fitting */}
              <div
                onClick={() => setSelectedMethod("cod")}
                className={`p-5 rounded-2xl border-2 transition cursor-pointer relative ${
                  selectedMethod === "cod"
                    ? "border-pink-600 bg-pink-50/40 shadow-sm"
                    : "border-gray-200 bg-white hover:border-pink-200"
                }`}
              >
                {selectedMethod === "cod" && (
                  <div className="absolute top-3 right-3 w-5 h-5 bg-pink-600 text-white rounded-full flex items-center justify-center">
                    <Check size={12} />
                  </div>
                )}
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
                  <Banknote size={22} />
                </div>
                <h4 className="font-bold text-gray-900 text-sm">Cash on Delivery</h4>
                <p className="text-[11px] text-gray-500 mt-1">Pay Cash at Boutique fitting session</p>

                <div className="flex items-center gap-1.5 mt-3">
                  <span className="text-[9px] font-bold px-2 py-0.5 bg-amber-100 text-amber-800 rounded">Cash / Offline</span>
                </div>
              </div>
            </div>

            {/* Sub-inputs based on selected method */}
            {selectedMethod === "upi" && (
              <div className="mt-5 p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100">
                <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase">
                  Enter VPA / UPI ID *
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="e.g. 9876543210@paytm or yourname@okaxis"
                    className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 text-sm outline-none focus:border-indigo-500 bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setUpiId("demo@upi")}
                    className="px-3 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700 transition"
                  >
                    Use Test ID
                  </button>
                </div>
                <p className="text-[11px] text-gray-500 mt-1.5 flex items-center gap-1">
                  <QrCode size={13} className="text-indigo-600" /> Instant UPI payment request will be sent to your GPay / PhonePe app.
                </p>
              </div>
            )}
          </div>

          {/* Feedback Messages */}
          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-xl mb-6 flex gap-3 text-sm font-semibold">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-4 rounded-xl mb-6 flex gap-3 text-sm font-semibold">
              <CheckCircle className="w-5 h-5 shrink-0" />
              <span>{success}</span>
            </div>
          )}

          {/* Confirm Action Button */}
          <div>
            {selectedMethod === "upi" && (
              <button
                onClick={() => handlePaymentCheckout("upi")}
                disabled={paying || !!success}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-xl font-semibold transition text-sm flex items-center justify-center gap-2 shadow-md shadow-indigo-200 disabled:opacity-50 cursor-pointer"
              >
                <Smartphone size={18} />
                {paying ? "Processing UPI Payment..." : `Pay ₹${slot.service?.price || 0} via UPI / Google Pay & Confirm`}
              </button>
            )}

            {selectedMethod === "card" && (
              <button
                onClick={() => handlePaymentCheckout("card")}
                disabled={paying || !!success}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-xl font-semibold transition text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-200 disabled:opacity-50 cursor-pointer"
              >
                <CreditCard size={18} />
                {paying ? "Processing Card Checkout..." : `Pay ₹${slot.service?.price || 0} via Card / Netbanking & Confirm`}
              </button>
            )}

            {selectedMethod === "cod" && (
              <button
                onClick={handleBookingCOD}
                disabled={booking || !!success}
                className="w-full bg-pink-600 hover:bg-pink-700 text-white py-4 rounded-xl font-semibold transition text-sm flex items-center justify-center gap-2 shadow-md shadow-pink-200 disabled:opacity-50 cursor-pointer"
              >
                <Banknote size={18} />
                {booking ? "Booking Appointment..." : "Confirm Booking with Cash on Delivery (Pay at Fitting)"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookSlots;