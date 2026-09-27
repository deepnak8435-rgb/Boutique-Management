import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export function MyBookings() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoadingId, setActionLoadingId] = useState(null);

  // Feedback / Review Modal State
  const [selectedBookingForReview, setSelectedBookingForReview] = useState(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState("");

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
    if (!window.confirm("Are you sure you want to cancel this appointment?")) {
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

  const getStatusBadge = (status) => {
    switch (status) {
      case "confirmed":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle size={14} /> Confirmed
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
      { id: "approved", label: "Approved" },
      { id: "stitching", label: "Stitching" },
      { id: "ready_for_trial", label: "Ready for Trial" },
    ];

    const currentIdx = stages.findIndex((s) => s.id === garmentStatus);
    const activeIndex = currentIdx === -1 ? (garmentStatus === "completed" ? 3 : 0) : currentIdx;

    return (
      <div className="mt-6 pt-4 border-t border-gray-100">
        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-1.5">
          <Scissors size={14} className="text-pink-600" /> Garment Tailoring Live Progress
        </h4>

        <div className="relative flex items-center justify-between max-w-xl mx-auto">
          {/* Progress Bar Background */}
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2 z-0" />
          <div
            className="absolute top-1/2 left-0 h-1 bg-pink-600 -translate-y-1/2 z-0 transition-all duration-300"
            style={{ width: `${(activeIndex / (stages.length - 1)) * 100}%` }}
          />

          {stages.map((stage, idx) => {
            const isDone = idx <= activeIndex;
            return (
              <div key={stage.id} className="relative z-10 flex flex-col items-center">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    isDone
                      ? "bg-pink-600 text-white shadow-md ring-4 ring-pink-100"
                      : "bg-gray-100 text-gray-400 border border-gray-300"
                  }`}
                >
                  {idx + 1}
                </div>
                <span
                  className={`text-[11px] mt-2 font-medium ${
                    isDone ? "text-pink-700 font-semibold" : "text-gray-400"
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
          productName: selectedBookingForReview?.slot?.service?.name || "Boutique Service",
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
    <div className="min-h-screen bg-[#fffafc] py-12 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-3xl p-8 border border-pink-100 shadow-sm mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-pink-600 font-semibold text-xs tracking-wider uppercase mb-2">
              <Scissors size={16} /> Dewani Boutique Appointments
            </div>
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-[#321f2b]">
              My Appointments & Orders
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Track and manage all your scheduled boutique fittings and live garment progress.
            </p>
          </div>

          <button
            onClick={fetchMyBookings}
            className="flex items-center gap-2 text-sm text-pink-600 font-semibold bg-pink-50 hover:bg-pink-100 px-4 py-2.5 rounded-xl transition cursor-pointer"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} /> Refresh List
          </button>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="py-20 text-center">
            <div className="w-12 h-12 border-4 border-pink-200 border-t-pink-600 rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-500 font-medium">Fetching your appointments...</p>
          </div>
        )}

        {/* Error state */}
        {!loading && error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center text-red-600 mb-8">
            <AlertCircle size={32} className="mx-auto mb-2 text-red-500" />
            <p className="font-semibold">{error}</p>
            <button
              onClick={fetchMyBookings}
              className="mt-4 bg-red-600 text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && bookings.length === 0 && (
          <div className="bg-white rounded-3xl p-12 border border-gray-100 shadow-sm text-center">
            <CalendarDays size={48} className="mx-auto text-pink-300 mb-4" />
            <h3 className="font-serif text-2xl font-bold text-[#321f2b]">No Appointments Yet</h3>
            <p className="text-gray-500 mt-2 max-w-md mx-auto text-sm leading-relaxed">
              You haven't scheduled any boutique appointments yet. Browse our specialized services to book your slot.
            </p>
            <Link
              to="/services"
              className="mt-6 inline-flex items-center gap-2 bg-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-pink-700 transition"
            >
              Explore Services <ArrowRight size={18} />
            </Link>
          </div>
        )}

        {/* Bookings List */}
        {!loading && !error && bookings.length > 0 && (
          <div className="space-y-6">
            {bookings.map((item) => {
              const service = item.slot?.service;
              const slot = item.slot;

              return (
                <div
                  key={item._id}
                  className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 shadow-sm hover:shadow-md transition"
                >
                  <div className="flex flex-col md:flex-row justify-between gap-6 items-start md:items-center">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        {getStatusBadge(item.status)}
                        {getPaymentBadge(item.paymentMethod)}
                        <span className="text-xs text-gray-400">
                          Booked on {new Date(item.createAt || Date.now()).toLocaleDateString("en-IN")}
                        </span>
                      </div>

                      <h3 className="font-serif text-2xl font-bold text-[#321f2b]">
                        {service?.name || "Boutique Fitting"}
                      </h3>
                      <p className="text-gray-500 text-sm mt-1 line-clamp-2">
                        {service?.description || "Specialized custom tailoring and boutique fitting session."}
                      </p>

                      <div className="flex flex-wrap items-center gap-6 mt-4 pt-4 border-t border-gray-100 text-sm">
                        <div className="flex items-center gap-2 text-gray-700 font-medium">
                          <CalendarDays size={18} className="text-pink-600" />
                          <span>
                            {slot?.date
                              ? new Date(slot.date).toLocaleDateString("en-IN", {
                                  weekday: "short",
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                })
                              : "Date N/A"}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-gray-700 font-medium">
                          <Clock size={18} className="text-pink-600" />
                          <span>
                            {slot?.startTime && slot?.endTime
                              ? `${slot.startTime} - ${slot.endTime}`
                              : "Time N/A"}
                          </span>
                        </div>

                        {service?.price !== undefined && (
                          <div className="flex items-center gap-1 font-bold text-pink-600 text-lg">
                            <IndianRupee size={18} />
                            <span>{service.price}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="w-full md:w-auto flex md:flex-col gap-2 justify-end">
                      <button
                        onClick={() => setSelectedBookingForReview(item)}
                        className="px-4 py-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 hover:bg-amber-100 text-xs font-semibold transition flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Star size={14} className="fill-amber-500 text-amber-500" /> Leave Feedback
                      </button>

                      {item.status === "pending" && (
                        <button
                          onClick={() => handleCancelBooking(item._id)}
                          disabled={actionLoadingId === item._id}
                          className="w-full md:w-auto px-5 py-2 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold transition disabled:opacity-50 cursor-pointer"
                        >
                          {actionLoadingId === item._id ? "Cancelling..." : "Cancel Appointment"}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* 4-Stage Visual Progress Tracker */}
                  {item.status !== "cancelled" && renderGarmentTracker(item.garmentStatus)}
                </div>
              );
            })}
          </div>
        )}

        {/* Customer Feedback Submission Modal */}
        {selectedBookingForReview && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl relative border border-pink-100">
              <button
                onClick={() => setSelectedBookingForReview(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 cursor-pointer"
              >
                <X size={20} />
              </button>

              <div className="text-center mb-6">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-3">
                  <Star size={24} className="fill-amber-500" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-[#321f2b]">Customer Feedback</h3>
                <p className="text-xs text-gray-500 mt-1">
                  How was your fitting experience for{" "}
                  <span className="font-semibold text-pink-600">
                    {selectedBookingForReview.slot?.service?.name || "Boutique Service"}
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
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-pink-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={reviewSubmitting}
                    className="w-full bg-pink-600 hover:bg-pink-700 text-white font-semibold py-3 rounded-xl transition text-sm shadow-md shadow-pink-200 disabled:opacity-50 cursor-pointer"
                  >
                    {reviewSubmitting ? "Submitting Feedback..." : "Submit Review"}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MyBookings;
