import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  CalendarDays,
  Clock,
  IndianRupee,
  Scissors,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowRight,
  RefreshCw,
  Star,
  X,
  Clock3,
  Sparkles,
  ShieldCheck,
  CreditCard,
  Users,
  UserCheck,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export function MyBookings() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [confirmingHoldId, setConfirmingHoldId] = useState(null);
  const [successBanner, setSuccessBanner] = useState(location.state?.successMessage || "");

  // Feedback / Review Modal State
  const [selectedBookingForReview, setSelectedBookingForReview] = useState(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState("");

  // Reschedule Modal State
  const [rescheduleBookingItem, setRescheduleBookingItem] = useState(null);
  const [availableSlotsForReschedule, setAvailableSlotsForReschedule] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedRescheduleSlotId, setSelectedRescheduleSlotId] = useState("");
  const [reschedulingLoading, setReschedulingLoading] = useState(false);
  const [rescheduleError, setRescheduleError] = useState("");

  // Confirm Hold Order Modal State
  const [selectedHoldBookingItem, setSelectedHoldBookingItem] = useState(null);
  const [holdPaymentMethod, setHoldPaymentMethod] = useState("upi");
  const [confirmingHoldLoading, setConfirmingHoldLoading] = useState(false);

  const handleOpenConfirmHoldModal = (item) => {
    setSelectedHoldBookingItem(item);
    setHoldPaymentMethod("upi");
  };

  const handleExecuteConfirmHoldOrder = async () => {
    if (!selectedHoldBookingItem) return;
    setConfirmingHoldLoading(true);
    try {
      const token = user?.token || localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/bookings/confirm-hold/${selectedHoldBookingItem._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          paymentMethod: holdPaymentMethod,
          advanceAmount: 500,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to confirm hold order");

      setSuccessBanner(`7-Day Hold successfully converted to Confirmed Order via ${holdPaymentMethod.toUpperCase()} with ₹500 Advance Payment!`);
      setSelectedHoldBookingItem(null);
      fetchMyBookings();
    } catch (err) {
      alert(err.message);
    } finally {
      setConfirmingHoldLoading(false);
    }
  };

  const handleOpenRescheduleModal = async (item) => {
    setRescheduleBookingItem(item);
    setSelectedRescheduleSlotId("");
    setRescheduleError("");
    setLoadingSlots(true);

    try {
      const serviceId = item.slot?.service?._id || item.slot?.service;
      let url = "http://localhost:5000/api/slots/all";
      if (serviceId && typeof serviceId === "string") {
        url = `http://localhost:5000/api/slots/service/${serviceId}`;
      }

      const res = await fetch(url);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch available slots");

      setAvailableSlotsForReschedule(data);
    } catch (err) {
      setRescheduleError(err.message);
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleConfirmReschedule = async () => {
    if (!selectedRescheduleSlotId) {
      setRescheduleError("Please select a new appointment slot to reschedule.");
      return;
    }

    setReschedulingLoading(true);
    setRescheduleError("");

    try {
      const token = user?.token || localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/bookings/reschedule/${rescheduleBookingItem._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ newSlotId: selectedRescheduleSlotId }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to reschedule booking");

      setSuccessBanner("Appointment slot rescheduled successfully! Your estimated delivery date has been updated.");
      setRescheduleBookingItem(null);
      fetchMyBookings();
    } catch (err) {
      setRescheduleError(err.message);
    } finally {
      setReschedulingLoading(false);
    }
  };

  const fetchMyBookings = async () => {
    if (!user) return;
    setLoading(true);
    setError("");

    try {
      const token = user?.token || localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/bookings/my-bookings", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch bookings");
      }

      setBookings(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchMyBookings();
  }, [user]);

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this appointment / hold?")) {
      return;
    }

    setActionLoadingId(bookingId);
    try {
      const token = user?.token || localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/bookings/cancel/${bookingId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to cancel booking");
      }

      fetchMyBookings();
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoadingId(null);
    }
  };

  // Convert 7-Day Hold into Confirmed Order
  const handleConfirmHoldOrder = async (bookingId) => {
    setConfirmingHoldId(bookingId);
    try {
      const token = user?.token || localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/bookings/confirm-hold/${bookingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          paymentMethod: "upi",
          advanceAmount: 500,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to confirm hold order");

      setSuccessBanner("7-Day Hold successfully converted to Confirmed Order with ₹500 Advance Payment!");
      fetchMyBookings();
    } catch (err) {
      alert(err.message);
    } finally {
      setConfirmingHoldId(null);
    }
  };

  const getPaymentBadge = (paymentMethod = "cod") => {
    switch (paymentMethod) {
      case "upi":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
            UPI / GPay
          </span>
        );
      case "card":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            Card Online
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
            Cash on Delivery
          </span>
        );
    }
  };

  const getStatusBadge = (item) => {
    if (item.orderType === "7_day_hold" || item.status === "on_hold") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
          <Clock3 size={14} /> 7-Day Hold Order
        </span>
      );
    }

    switch (item.status) {
      case "confirmed":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle size={14} /> Confirmed Order
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle size={14} /> Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <AlertCircle size={14} /> Pending Approval
          </span>
        );
    }
  };

  const renderGarmentTracker = (garmentStatus = "pending") => {
    const stages = [
      { id: "pending", label: "Requested" },
      { id: "approved", label: "Pattern Approved" },
      { id: "stitching", label: "Stitching & Embroidery" },
      { id: "ready_for_trial", label: "Ready for Fitting Trial" },
      { id: "completed", label: "Ready for Delivery" },
    ];

    const currentIdx = stages.findIndex((s) => s.id === garmentStatus);
    const activeIndex = currentIdx === -1 ? (garmentStatus === "completed" ? 4 : 0) : currentIdx;

    return (
      <div className="mt-6 pt-4 border-t border-[#E5D9CC]/50">
        <h4 className="text-xs font-bold text-[#8B4513] uppercase tracking-wider mb-4 flex items-center gap-1.5">
          <Scissors size={14} className="text-[#8B4513]" /> Garment Tailoring Live Progress Tracker
        </h4>

        <div className="relative flex items-center justify-between max-w-2xl mx-auto">
          {/* Progress Bar Background */}
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-[#E5D9CC] -translate-y-1/2 z-0" />
          <div
            className="absolute top-1/2 left-0 h-1 bg-[#8B4513] -translate-y-1/2 z-0 transition-all duration-300"
            style={{ width: `${(activeIndex / (stages.length - 1)) * 100}%` }}
          />

          {stages.map((stage, idx) => {
            const isDone = idx <= activeIndex;
            return (
              <div key={stage.id} className="relative z-10 flex flex-col items-center">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    isDone
                      ? "bg-[#8B4513] text-white shadow-md ring-4 ring-[#FAF6F0]"
                      : "bg-[#FAF6F0] text-gray-400 border border-[#E5D9CC]"
                  }`}
                >
                  {idx + 1}
                </div>
                <span
                  className={`text-[10px] mt-2 font-medium text-center max-w-[80px] ${
                    isDone ? "text-[#8B4513] font-bold" : "text-gray-400"
                  }`}
                >
                  {stage.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewSubmitting(true);
    setReviewSuccess("");

    try {
      const token = user?.token || localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          rating: reviewRating,
          comment: reviewComment,
          productName: selectedBookingForReview?.slot?.service?.name || selectedBookingForReview?.fabricName || "Boutique Service",
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to submit feedback");

      setReviewSuccess("Thank you! Your rating & review have been posted.");
      setTimeout(() => {
        setSelectedBookingForReview(null);
        setReviewComment("");
        setReviewSuccess("");
      }, 2000);
    } catch (err) {
      alert(err.message);
    } finally {
      setReviewSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF6F0] py-12 px-4 sm:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-3xl p-8 border border-[#E5D9CC] shadow-xs mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-[#8B4513] font-semibold text-xs tracking-wider uppercase mb-2">
              <Scissors size={16} /> Dewani Boutique Private Customer Portal
            </div>
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-[#38220F]">
              My Appointments & Custom Orders
            </h1>
            <p className="text-gray-600 text-sm mt-1">
              Logged in as: <strong className="text-[#8B4513]">{user?.name || "Boutique Customer"}</strong> ({user?.email || "Customer Account"}) &bull; Showing strictly your individual appointment confirmations & live tailoring progress.
            </p>
          </div>

          <button
            onClick={fetchMyBookings}
            className="flex items-center gap-2 text-sm text-[#8B4513] font-semibold bg-[#FAF6F0] hover:bg-[#E5D9CC] border border-[#E5D9CC] px-4 py-2.5 rounded-xl transition cursor-pointer"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} /> Refresh List
          </button>
        </div>

        {/* Success Banner */}
        {successBanner && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-2xl mb-8 flex items-center justify-between text-sm font-semibold">
            <span>{successBanner}</span>
            <button onClick={() => setSuccessBanner("")} className="text-emerald-600 font-bold hover:underline cursor-pointer">
              &times;
            </button>
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div className="py-20 text-center">
            <div className="w-12 h-12 border-4 border-[#E5D9CC] border-t-[#8B4513] rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-500 font-medium">Fetching your custom appointments...</p>
          </div>
        )}

        {/* Error state */}
        {!loading && error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center text-red-600 mb-8">
            <AlertCircle size={32} className="mx-auto mb-2 text-red-500" />
            <p className="font-semibold">{error}</p>
            <button
              onClick={fetchMyBookings}
              className="mt-4 bg-red-600 text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-red-700 cursor-pointer"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && bookings.length === 0 && (
          <div className="bg-white rounded-3xl p-12 border border-[#E5D9CC] shadow-xs text-center">
            <CalendarDays size={48} className="mx-auto text-[#8B4513]/40 mb-4" />
            <h3 className="font-serif text-2xl font-bold text-[#38220F]">No Appointments or Custom Orders Yet</h3>
            <p className="text-gray-600 mt-2 max-w-md mx-auto text-sm leading-relaxed">
              You haven't scheduled any boutique appointments or custom tailoring orders yet. Use our Custom Studio to select fabric specs, upload reference designs, or reserve a fitting slot.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <Link
                to="/custom-designer"
                className="bg-[#8B4513] hover:bg-[#6D340D] text-white px-6 py-3 rounded-xl font-semibold text-sm transition"
              >
                Open Custom Studio <Sparkles size={16} className="inline ml-1" />
              </Link>
              <Link
                to="/services"
                className="border border-[#E5D9CC] text-stone-800 hover:bg-[#FAF6F0] px-6 py-3 rounded-xl font-semibold text-sm transition"
              >
                Browse Services <ArrowRight size={16} className="inline ml-1" />
              </Link>
            </div>
          </div>
        )}

        {/* Bookings List */}
        {!loading && !error && bookings.length > 0 && (
          <div className="space-y-6">
            {bookings.map((item) => {
              const service = item.slot?.service;
              const slot = item.slot;
              const isHold = item.orderType === "7_day_hold" || item.status === "on_hold";

              const estimatedDeliveryStr = item.estimatedDeliveryDate
                ? new Date(item.estimatedDeliveryDate).toLocaleDateString("en-IN", {
                    weekday: "long",
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })
                : "5-7 Days from Fitting";

              return (
                <div
                  key={item._id}
                  className="bg-white rounded-3xl border border-[#E5D9CC] p-6 md:p-8 shadow-xs hover:shadow-md transition space-y-6"
                >
                  <div className="flex flex-col md:flex-row justify-between gap-6 items-start">
                    {/* Thumbnail Image if Custom Reference */}
                    {item.referenceImage && (
                      <img
                        src={item.referenceImage}
                        alt="Dress Reference"
                        className="w-24 h-24 md:w-32 md:h-32 object-cover rounded-2xl border border-[#E5D9CC] shrink-0"
                      />
                    )}

                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3 mb-3">
                        {getStatusBadge(item)}
                        {getPaymentBadge(item.paymentMethod)}
                        <span className="text-xs text-gray-400">
                          Booked on {new Date(item.createAt || Date.now()).toLocaleDateString("en-IN")}
                        </span>
                      </div>

                      <h3 className="font-serif text-2xl font-bold text-[#38220F]">
                        {service?.name || item.fabricName || "Boutique Custom Fitting"}
                      </h3>
                      <p className="text-gray-600 text-sm mt-1">
                        {service?.description || `Custom tailored outfit using ${item.fabricName || "Boutique Fabric"}.`}
                      </p>

                      {/* Fabric Specs Snapshot */}
                      {item.fabricDetails && (
                        <div className="mt-3 p-3 bg-[#FAF6F0] rounded-2xl border border-[#E5D9CC]/70 text-xs space-y-1 text-gray-700">
                          <div className="font-bold text-[#8B4513] uppercase tracking-wider text-[11px]">
                            Fabric Specifications: {item.fabricName}
                          </div>
                          <div>
                            <strong>Flow:</strong> {item.fabricDetails.flow} | <strong>Texture:</strong> {item.fabricDetails.texture} |{" "}
                            <strong>Care:</strong> {item.fabricDetails.careInstructions}
                          </div>
                        </div>
                      )}

                      {/* Selected Services Tags */}
                      {item.selectedServices && item.selectedServices.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {item.selectedServices.map((svc, i) => (
                            <span key={i} className="bg-white border border-[#E5D9CC] text-[#8B4513] text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                              + {svc.name}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Schedule & Delivery Dates */}
                      <div className="flex flex-wrap items-center gap-4 sm:gap-6 mt-4 pt-4 border-t border-[#E5D9CC]/50 text-sm">
                        <div className="flex items-center gap-2 text-gray-700 font-medium">
                          <CalendarDays size={18} className="text-[#8B4513]" />
                          <span>
                            Slot:{" "}
                            {slot?.date
                              ? new Date(slot.date).toLocaleDateString("en-IN", {
                                  weekday: "short",
                                  day: "2-digit",
                                  month: "short",
                                })
                              : "Date N/A"}
                          </span>
                        </div>

                        {/* Same Day Booked Customer Count Indicator */}
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200 text-amber-900 rounded-full text-xs font-bold">
                          <Users size={14} className="text-[#8B4513]" />
                          <span>Same Day Booked: {item.sameDayBookedCount || 1} Customers</span>
                        </div>

                        <div className="flex items-center gap-2 text-gray-700 font-medium">
                          <Clock size={18} className="text-[#8B4513]" />
                          <span>{slot?.startTime && slot?.endTime ? `${slot.startTime} - ${slot.endTime}` : "Time N/A"}</span>
                        </div>

                        <div className="flex items-center gap-2 text-[#8B4513] font-bold">
                          <Sparkles size={18} />
                          <span>Est. Delivery: {estimatedDeliveryStr}</span>
                        </div>
                      </div>

                      {/* Financial Breakdown */}
                      <div className="mt-3 pt-3 border-t border-[#E5D9CC]/50 flex flex-wrap items-center gap-6 text-xs text-gray-700">
                        <div>
                          <strong>Total Price:</strong> <span className="font-bold text-[#8B4513] text-sm">₹{item.totalAmount || service?.price || 1500}</span>
                        </div>
                        <div>
                          <strong>Advance Paid:</strong>{" "}
                          <span className={`font-bold ${item.advancePaid ? "text-emerald-700" : "text-amber-700"}`}>
                            {item.advancePaid ? `₹${item.advanceAmount || 500} (Advance Payment Paid)` : "₹0 (Pending)"}
                          </span>
                        </div>
                        <div>
                          <strong>Balance Due at Trial:</strong> <span className="font-bold text-gray-800 text-sm">₹{item.remainingBalance || 0}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="w-full md:w-auto flex md:flex-col gap-2 justify-end shrink-0">
                      <button
                        onClick={() => setSelectedBookingForReview(item)}
                        className="px-4 py-2.5 rounded-xl bg-[#FAF6F0] border border-[#E5D9CC] text-[#8B4513] hover:bg-[#E5D9CC]/50 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Star size={14} className="fill-amber-500 text-amber-500" /> Leave Feedback
                      </button>

                      {item.status !== "cancelled" && (
                        <button
                          onClick={() => handleOpenRescheduleModal(item)}
                          className="px-4 py-2.5 rounded-xl bg-white border border-[#8B4513] text-[#8B4513] hover:bg-[#FAF6F0] text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <CalendarDays size={14} /> Reschedule Slot
                        </button>
                      )}

                      {isHold && (
                        <button
                          onClick={() => handleOpenConfirmHoldModal(item)}
                          className="px-4 py-2.5 rounded-xl bg-[#8B4513] hover:bg-[#6D340D] text-white text-xs font-bold transition shadow-xs cursor-pointer flex items-center justify-center gap-1"
                        >
                          <CreditCard size={14} /> Confirm & Pay Advance (₹500)
                        </button>
                      )}

                      {item.status !== "cancelled" && item.garmentStatus === "pending" && (
                        <button
                          onClick={() => handleCancelBooking(item._id)}
                          disabled={actionLoadingId === item._id}
                          className="px-4 py-2 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-semibold transition disabled:opacity-50 cursor-pointer"
                        >
                          {actionLoadingId === item._id ? "Cancelling..." : "Cancel Order"}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* 7-Day Hold Notice Banner if applicable */}
                  {isHold && (
                    <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                      <div className="flex items-center gap-2">
                        <Clock3 size={18} className="text-amber-700 shrink-0" />
                        <span>
                          This order & slot are on a <strong>7-Day Hold</strong> (expires in 7 days). Click "Confirm & Pay Advance" to begin custom tailoring!
                        </span>
                      </div>
                      <button
                        onClick={() => handleOpenConfirmHoldModal(item)}
                        className="bg-amber-800 hover:bg-amber-900 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold transition shrink-0 cursor-pointer"
                      >
                        Confirm Now
                      </button>
                    </div>
                  )}

                  {/* 5-Stage Visual Progress Tracker */}
                  {item.status !== "cancelled" && renderGarmentTracker(item.garmentStatus)}
                </div>
              );
            })}
          </div>
        )}

        {/* Customer Feedback Submission Modal */}
        {selectedBookingForReview && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl relative border border-[#E5D9CC]">
              <button
                onClick={() => setSelectedBookingForReview(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 cursor-pointer"
              >
                <X size={20} />
              </button>

              <div className="text-center mb-6">
                <div className="w-12 h-12 rounded-2xl bg-[#FAF6F0] text-[#8B4513] border border-[#E5D9CC] flex items-center justify-center mx-auto mb-3">
                  <Star size={24} className="fill-amber-500 text-amber-500" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-[#38220F]">Customer Feedback</h3>
                <p className="text-xs text-gray-500 mt-1">
                  How was your fitting experience for{" "}
                  <span className="font-semibold text-[#8B4513]">
                    {selectedBookingForReview.slot?.service?.name || selectedBookingForReview.fabricName || "Boutique Service"}
                  </span>
                  ?
                </p>
              </div>

              {reviewSuccess ? (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-4 rounded-2xl text-center text-sm font-semibold">
                  {reviewSuccess}
                </div>
              ) : (
                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-2 uppercase text-center">
                      Select Rating Star
                    </label>
                    <div className="flex items-center justify-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewRating(star)}
                          className="p-1 cursor-pointer"
                        >
                          <Star
                            size={28}
                            className={
                              star <= reviewRating
                                ? "fill-amber-400 text-amber-400"
                                : "text-gray-300"
                            }
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">
                      Your Comments & Review *
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="Share your experience with fitting quality, master tailor responsiveness, fabric finish..."
                      className="w-full px-4 py-2.5 rounded-xl border border-[#E5D9CC] text-sm outline-none focus:border-[#8B4513]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={reviewSubmitting}
                    className="w-full bg-[#8B4513] hover:bg-[#6D340D] text-white font-semibold py-3 rounded-xl transition text-sm shadow-md shadow-[#8B4513]/20 disabled:opacity-50 cursor-pointer"
                  >
                    {reviewSubmitting ? "Submitting Feedback..." : "Submit Review"}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        {/* Slot Reschedule Modal */}
        {rescheduleBookingItem && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl relative border border-[#E5D9CC] max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setRescheduleBookingItem(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 cursor-pointer"
              >
                <X size={20} />
              </button>

              <div className="mb-6">
                <div className="w-12 h-12 rounded-2xl bg-[#FAF6F0] text-[#8B4513] border border-[#E5D9CC] flex items-center justify-center mb-3">
                  <CalendarDays size={24} />
                </div>
                <h3 className="font-serif text-2xl font-bold text-[#38220F]">Reschedule Appointment Slot</h3>
                <p className="text-xs text-gray-500 mt-1">
                  Select a new date and time slot. Daily capacity limit is max 10 customers/day.
                </p>
              </div>

              {rescheduleError && (
                <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3.5 rounded-2xl mb-4 text-xs font-semibold">
                  {rescheduleError}
                </div>
              )}

              {loadingSlots ? (
                <div className="py-12 text-center text-stone-500">
                  <div className="w-8 h-8 border-4 border-[#E5D9CC] border-t-[#8B4513] rounded-full animate-spin mx-auto mb-2"></div>
                  Fetching available slots...
                </div>
              ) : availableSlotsForReschedule.length === 0 ? (
                <div className="p-4 bg-amber-50 border border-amber-200 text-amber-900 rounded-2xl text-xs font-semibold text-center">
                  No other upcoming slots available currently.
                </div>
              ) : (
                <div className="space-y-3 mb-6">
                  {availableSlotsForReschedule.map((s) => {
                    const isSelected = selectedRescheduleSlotId === s._id;
                    const isFull = s.isDayFull || s.isBooked;
                    const isCurrent = String(s._id) === String(rescheduleBookingItem.slot?._id);

                    return (
                      <div
                        key={s._id}
                        onClick={() => {
                          if (!isFull && !isCurrent) setSelectedRescheduleSlotId(s._id);
                        }}
                        className={`p-4 rounded-2xl border transition ${
                          isCurrent
                            ? "border-emerald-300 bg-emerald-50 text-emerald-900 cursor-default"
                            : isFull
                            ? "border-stone-200 bg-stone-100 opacity-60 cursor-not-allowed"
                            : isSelected
                            ? "border-[#8B4513] bg-[#FAF6F0] ring-2 ring-[#8B4513]/30 cursor-pointer"
                            : "border-[#E5D9CC] bg-white hover:border-[#8B4513] cursor-pointer"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 font-bold text-sm text-[#38220F]">
                            <CalendarDays size={16} className="text-[#8B4513]" />
                            <span>
                              {new Date(s.date).toLocaleDateString("en-IN", {
                                weekday: "short",
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })}
                            </span>
                          </div>
                          <div>
                            {isCurrent ? (
                              <span className="bg-emerald-200 text-emerald-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                                Current Slot
                              </span>
                            ) : isFull ? (
                              <span className="bg-rose-100 text-rose-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border border-rose-200">
                                Day Full (10/10)
                              </span>
                            ) : (
                              <span className="bg-amber-50 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-200 uppercase">
                                {s.dailyBookedCount || 0}/10 Filled
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-stone-600 mt-1">
                          <Clock size={14} className="text-[#8B4513]" />
                          <span>
                            {s.startTime} - {s.endTime}
                          </span>
                        </div>
                        {/* Daily Slot Counter Breakdown */}
                        <div className="mt-2 pt-2 border-t border-[#E5D9CC]/50 text-[11px] flex justify-between items-center text-stone-600 font-medium">
                          <span>
                            Slots Taken: <strong className="text-amber-900">{s.dailyBookedCount || 0} Filled</strong>
                          </span>
                          <span>
                            Remaining: <strong className={isFull ? "text-rose-700" : "text-emerald-700"}>
                              {Math.max(0, 10 - (s.dailyBookedCount || 0))} Available
                            </strong>
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setRescheduleBookingItem(null)}
                  className="w-1/2 py-3 border border-stone-200 rounded-xl text-stone-700 font-semibold text-xs hover:bg-stone-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmReschedule}
                  disabled={reschedulingLoading || !selectedRescheduleSlotId}
                  className="w-1/2 bg-[#8B4513] hover:bg-[#6D340D] text-white font-semibold py-3 rounded-xl transition text-xs shadow-md disabled:opacity-50 cursor-pointer"
                >
                  {reschedulingLoading ? "Rescheduling..." : "Confirm New Slot"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Confirm Hold Order Payment Modal */}
        {selectedHoldBookingItem && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl relative border border-[#E5D9CC]">
              <button
                onClick={() => setSelectedHoldBookingItem(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 cursor-pointer"
              >
                <X size={20} />
              </button>

              <div className="text-center mb-6">
                <div className="w-12 h-12 rounded-2xl bg-[#FAF6F0] text-[#8B4513] border border-[#E5D9CC] flex items-center justify-center mx-auto mb-3">
                  <CreditCard size={24} />
                </div>
                <h3 className="font-serif text-2xl font-bold text-[#38220F]">Confirm Order & Pay Advance</h3>
                <p className="text-xs text-gray-500 mt-1">
                  Convert your 7-Day Hold into a Confirmed Atelier Order with ₹500 advance payment.
                </p>
              </div>

              <div className="space-y-4 mb-6">
                <div className="p-4 bg-[#FAF6F0] rounded-2xl border border-[#E5D9CC] text-xs space-y-1 text-gray-700">
                  <div><strong>Fabric:</strong> {selectedHoldBookingItem.fabricName || "Royal Chiffon Silk"}</div>
                  <div><strong>Advance Amount:</strong> <span className="font-bold text-[#8B4513] text-sm">₹500</span></div>
                  <div><strong>Remaining Balance:</strong> ₹{Math.max(0, (selectedHoldBookingItem.totalAmount || 1500) - 500)}</div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-2">
                    Select Payment Method *
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "upi", label: "UPI / GPay" },
                      { id: "card", label: "Debit/Credit Card" },
                      { id: "cod", label: "Cash at Boutique" },
                    ].map((pm) => (
                      <button
                        key={pm.id}
                        type="button"
                        onClick={() => setHoldPaymentMethod(pm.id)}
                        className={`py-2 px-2 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                          holdPaymentMethod === pm.id
                            ? "bg-[#8B4513] text-white border-[#8B4513]"
                            : "bg-white text-gray-700 border-[#E5D9CC]"
                        }`}
                      >
                        {pm.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedHoldBookingItem(null)}
                  className="w-1/2 py-3 border border-stone-200 rounded-xl text-stone-700 font-semibold text-xs hover:bg-stone-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleExecuteConfirmHoldOrder}
                  disabled={confirmingHoldLoading}
                  className="w-1/2 bg-[#8B4513] hover:bg-[#6D340D] text-white font-semibold py-3 rounded-xl transition text-xs shadow-md disabled:opacity-50 cursor-pointer"
                >
                  {confirmingHoldLoading ? "Confirming..." : "Confirm & Pay ₹500"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MyBookings;
