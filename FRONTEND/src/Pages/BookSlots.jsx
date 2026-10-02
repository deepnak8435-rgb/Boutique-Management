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

  const [orderMode, setOrderMode] = useState("confirm"); // "confirm" | "hold"
  const [selectedMethod, setSelectedMethod] = useState("upi"); // "upi" | "card" | "cod"
  const [upiId, setUpiId] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // 7-Day Hold Booking Handler
  const handlePlaceHoldBooking = async () => {
    setError("");
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      setBooking(true);
      const token = user?.token || localStorage.getItem("token");

      const response = await fetch("http://localhost:5000/api/bookings/custom-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          slotId,
          orderType: "7_day_hold",
          paymentMethod: "cod",
          advanceAmount: 0,
          totalAmount: slot.service?.price || 1500,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to place 7-day hold");

      setSuccess("Your appointment slot has been placed on 7-Day Hold! Reserved for 7 days.");
      setTimeout(() => navigate("/my-bookings"), 1800);
    } catch (err) {
      setError(err.message);
    } finally {
      setBooking(false);
    }
  };

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

      setSuccess("Your appointment slot has been booked with Cash on Delivery! Status: Pending Approval.");
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
      <div className="min-h-screen bg-[#FAF6F0] flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#E5D9CC] border-t-[#8B4513] rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-stone-500 font-medium text-sm">Loading appointment details...</p>
        </div>
      </div>
    );
  }

  if (error && !slot) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 bg-[#FAF6F0]">
        <div className="text-center max-w-md bg-white p-8 rounded-3xl border border-[#E5D9CC] shadow-sm">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-3 text-[#38220F]">Unable to Load Appointment</h2>
          <p className="text-stone-500 text-sm mb-6">{error}</p>
          <button
            onClick={() => navigate("/services")}
            className="bg-[#8B4513] hover:bg-[#6D340D] text-[#FAF6F0] px-6 py-3 rounded-xl font-semibold text-xs transition"
          >
            Back to Services
          </button>
        </div>
      </div>
    );
  }

  if (!slot) return null;

  return (
    <div className="min-h-screen bg-[#FAF6F0] text-[#38220F] py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Back link */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-bold text-stone-500 hover:text-[#8B4513] mb-6 uppercase tracking-wider transition cursor-pointer"
        >
          <ArrowLeft size={16} /> Choose Another Slot
        </button>

        {/* Selected Product Context Banner */}
        {productContext && (
          <div className="bg-gradient-to-r from-[#2A1810] to-[#38220F] text-white rounded-3xl p-6 shadow-lg mb-8 flex items-center gap-5 border border-[#E5D9CC]/30">
            <img
              src={productContext.image}
              alt={productContext.name}
              className="w-16 h-16 rounded-2xl object-cover border border-white/20 shrink-0"
            />
            <div>
              <span className="bg-[#8B4513] text-[#FAF6F0] text-[10px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider">
                Product Fitting Trial Item
              </span>
              <h3 className="font-serif text-xl font-bold mt-1">{productContext.name}</h3>
              <p className="text-white/70 text-xs mt-0.5">
                Category: {productContext.category} | Fabric: {productContext.fabric || "Silk"}
              </p>
            </div>
          </div>
        )}

        <div className="bg-white rounded-3xl border border-[#E5D9CC] shadow-xl p-6 sm:p-8">
          {/* Header */}
          <div className="border-b border-[#E5D9CC] pb-6 mb-6">
            <div className="flex items-center gap-2 text-[#8B4513] font-bold text-xs uppercase tracking-wider mb-1">
              <Scissors size={16} /> Dewani Atelier Slot Confirmation
            </div>
            <h1 className="font-serif text-3xl font-bold text-[#38220F]">Confirm Slot & Payment Method</h1>
          </div>

          {/* Service & Slot Specs */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-[#FAF6F0] rounded-2xl p-5 border border-[#E5D9CC]">
              <span className="text-[11px] font-bold text-[#8B4513] uppercase tracking-wider">Selected Service</span>
              <h3 className="font-serif text-2xl font-bold text-[#38220F] mt-1">
                {slot.service?.name || "Boutique Service"}
              </h3>
              <p className="text-xs text-stone-500 mt-1 line-clamp-2">
                {slot.service?.description || "Specialized custom tailoring & fitting session."}
              </p>
              <p className="text-[#8B4513] font-bold text-xl mt-3">
                Fee: ₹{slot.service?.price || 0}
              </p>
            </div>

            <div className="bg-[#FAF6F0] rounded-2xl p-5 border border-[#E5D9CC] flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold text-[#8B4513] uppercase tracking-wider">Schedule Window</span>
                <div className="flex items-center gap-2 mt-2 text-stone-800 font-semibold text-sm">
                  <CalendarDays size={16} className="text-[#8B4513]" />
                  <span>
                    {new Date(slot.date).toLocaleDateString("en-IN", {
                      weekday: "short",
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1.5 text-stone-800 font-semibold text-sm">
                  <Clock size={16} className="text-[#8B4513]" />
                  <span>{slot.startTime} - {slot.endTime}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Order Confirmation Option: Instant Confirm vs 7-Day Hold */}
          <div className="mb-8 p-6 bg-[#FAF6F0] rounded-3xl border border-[#E5D9CC]">
            <h2 className="font-serif text-xl font-bold text-[#38220F] mb-1">Choose Order Booking Option</h2>
            <p className="text-xs text-stone-500 mb-4">
              Directly confirm your appointment slot with payment or place a 7-Day Hold if you need time to decide.
            </p>

            <div className="grid sm:grid-cols-2 gap-4">
              {/* Option A: Confirm Order */}
              <div
                onClick={() => setOrderMode("confirm")}
                className={`p-5 rounded-2xl border-2 transition cursor-pointer flex flex-col justify-between ${
                  orderMode === "confirm"
                    ? "border-[#8B4513] bg-white shadow-xs"
                    : "border-stone-200 bg-white/60 hover:border-[#8B4513]/40"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                      Confirm & Reserve Slot
                    </span>
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${orderMode === "confirm" ? "border-[#8B4513] bg-[#8B4513] text-white" : "border-stone-300"}`}>
                      {orderMode === "confirm" && <Check size={12} />}
                    </div>
                  </div>
                  <h4 className="font-bold text-[#38220F] text-sm">Instant Confirmation</h4>
                  <p className="text-xs text-stone-500 mt-1">Pay fee / advance now to lock in your appointment slot.</p>
                </div>
              </div>

              {/* Option B: 7-Day Hold */}
              <div
                onClick={() => setOrderMode("hold")}
                className={`p-5 rounded-2xl border-2 transition cursor-pointer flex flex-col justify-between ${
                  orderMode === "hold"
                    ? "border-[#8B4513] bg-white shadow-xs"
                    : "border-stone-200 bg-white/60 hover:border-[#8B4513]/40"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase border border-amber-200">
                      Pending Decision Hold
                    </span>
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${orderMode === "hold" ? "border-[#8B4513] bg-[#8B4513] text-white" : "border-stone-300"}`}>
                      {orderMode === "hold" && <Check size={12} />}
                    </div>
                  </div>
                  <h4 className="font-bold text-[#38220F] text-sm">Place 7-Day Hold (Zero Advance)</h4>
                  <p className="text-xs text-stone-500 mt-1">Reserve this slot for 7 days with ₹0 payment today.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method Selector (If Confirm Order mode selected) */}
          {orderMode === "confirm" ? (
            <div className="mb-8">
              <h2 className="font-serif text-xl font-bold text-[#38220F] mb-1">Select Payment Method</h2>
              <p className="text-xs text-stone-500 mb-4">Choose how you would like to pay for your fitting appointment slot.</p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Option 1: UPI / Google Pay / PhonePe / Paytm */}
              <div
                onClick={() => setSelectedMethod("upi")}
                className={`p-5 rounded-2xl border-2 transition cursor-pointer relative ${
                  selectedMethod === "upi"
                    ? "border-[#8B4513] bg-[#FAF6F0] shadow-xs"
                    : "border-stone-200 bg-white hover:border-[#8B4513]/40"
                }`}
              >
                {selectedMethod === "upi" && (
                  <div className="absolute top-3 right-3 w-5 h-5 bg-[#8B4513] text-white rounded-full flex items-center justify-center">
                    <Check size={12} />
                  </div>
                )}
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center mb-3">
                  <Smartphone size={22} />
                </div>
                <h4 className="font-bold text-stone-900 text-sm">UPI / Google Pay</h4>
                <p className="text-[11px] text-stone-500 mt-1">GPay, PhonePe, Paytm, BHIM UPI</p>

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
                    ? "border-[#8B4513] bg-[#FAF6F0] shadow-xs"
                    : "border-stone-200 bg-white hover:border-[#8B4513]/40"
                }`}
              >
                {selectedMethod === "card" && (
                  <div className="absolute top-3 right-3 w-5 h-5 bg-[#8B4513] text-white rounded-full flex items-center justify-center">
                    <Check size={12} />
                  </div>
                )}
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3">
                  <CreditCard size={22} />
                </div>
                <h4 className="font-bold text-stone-900 text-sm">Cards & Netbanking</h4>
                <p className="text-[11px] text-stone-500 mt-1">Visa, Mastercard, RuPay Cards</p>

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
                    ? "border-[#8B4513] bg-[#FAF6F0] shadow-xs"
                    : "border-stone-200 bg-white hover:border-[#8B4513]/40"
                }`}
              >
                {selectedMethod === "cod" && (
                  <div className="absolute top-3 right-3 w-5 h-5 bg-[#8B4513] text-white rounded-full flex items-center justify-center">
                    <Check size={12} />
                  </div>
                )}
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-3">
                  <Banknote size={22} />
                </div>
                <h4 className="font-bold text-stone-900 text-sm">Cash on Delivery</h4>
                <p className="text-[11px] text-stone-500 mt-1">Pay Cash at Boutique fitting session</p>

                <div className="flex items-center gap-1.5 mt-3">
                  <span className="text-[9px] font-bold px-2 py-0.5 bg-amber-100 text-amber-800 rounded">Cash / Offline</span>
                </div>
              </div>
            </div>

            {/* Sub-inputs based on selected method */}
            {selectedMethod === "upi" && (
              <div className="mt-5 p-4 rounded-2xl bg-[#FAF6F0] border border-[#E5D9CC]">
                <label className="block text-xs font-bold text-stone-700 mb-1.5 uppercase">
                  Enter VPA / UPI ID *
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="e.g. 9876543210@paytm or yourname@okaxis"
                    className="flex-1 px-4 py-2.5 rounded-xl border border-stone-300 text-sm outline-none focus:border-[#8B4513] bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setUpiId("demo@upi")}
                    className="px-4 py-2.5 bg-[#8B4513] text-[#FAF6F0] rounded-xl text-xs font-semibold hover:bg-[#6D340D] transition cursor-pointer"
                  >
                    Use Test ID
                  </button>
                </div>
                <p className="text-[11px] text-stone-500 mt-1.5 flex items-center gap-1">
                  <QrCode size={13} className="text-[#8B4513]" /> Instant UPI payment request will be sent to your GPay / PhonePe app.
                </p>
              </div>
            )}
            </div>
          ) : (
            /* 7-Day Hold Notice Card */
            <div className="mb-8 p-6 bg-amber-50 rounded-2xl border border-amber-200 text-amber-900 space-y-2">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <Clock size={16} className="text-amber-800" /> 7-Day Decision Hold Guarantee
              </h3>
              <p className="text-xs leading-relaxed">
                Your selected appointment slot will be reserved for <strong>7 days</strong> with zero advance payment today. You can log into <strong>My Bookings</strong> anytime within 7 days to convert into a confirmed order.
              </p>
            </div>
          )}

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
            {orderMode === "hold" ? (
              <button
                onClick={handlePlaceHoldBooking}
                disabled={booking || !!success}
                className="w-full bg-[#8B4513] hover:bg-[#6D340D] text-[#FAF6F0] py-4 rounded-2xl font-semibold transition text-sm flex items-center justify-center gap-2 shadow-md disabled:opacity-50 cursor-pointer"
              >
                <Clock size={18} />
                {booking ? "Placing 7-Day Hold..." : "Place 7-Day Hold Order (Reserve Slot for 7 Days)"}
              </button>
            ) : (
              <>
                {selectedMethod === "upi" && (
                  <button
                    onClick={() => handlePaymentCheckout("upi")}
                    disabled={paying || !!success}
                    className="w-full bg-[#8B4513] hover:bg-[#6D340D] text-[#FAF6F0] py-4 rounded-2xl font-semibold transition text-sm flex items-center justify-center gap-2 shadow-md disabled:opacity-50 cursor-pointer"
                  >
                    <Smartphone size={18} />
                    {paying ? "Processing UPI Payment..." : `Pay ₹${slot.service?.price || 0} via UPI / Google Pay & Confirm Slot`}
                  </button>
                )}

                {selectedMethod === "card" && (
                  <button
                    onClick={() => handlePaymentCheckout("card")}
                    disabled={paying || !!success}
                    className="w-full bg-[#8B4513] hover:bg-[#6D340D] text-[#FAF6F0] py-4 rounded-2xl font-semibold transition text-sm flex items-center justify-center gap-2 shadow-md disabled:opacity-50 cursor-pointer"
                  >
                    <CreditCard size={18} />
                    {paying ? "Processing Card Checkout..." : `Pay ₹${slot.service?.price || 0} via Card / Netbanking & Confirm Slot`}
                  </button>
                )}

                {selectedMethod === "cod" && (
                  <button
                    onClick={handleBookingCOD}
                    disabled={booking || !!success}
                    className="w-full bg-[#8B4513] hover:bg-[#6D340D] text-[#FAF6F0] py-4 rounded-2xl font-semibold transition text-sm flex items-center justify-center gap-2 shadow-md disabled:opacity-50 cursor-pointer"
                  >
                    <Banknote size={18} />
                    {booking ? "Reserving Slot..." : "Confirm Booking Slot with Cash on Delivery (Pay at Fitting)"}
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookSlots;