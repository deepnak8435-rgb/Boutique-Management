import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  CalendarDays,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

function BookSlots() {
  const { slotId } = useParams();
  const navigate = useNavigate();

  const { user } = useAuth();

  const [slot, setSlot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // -----------------------------------
  // Get selected slot
  // -----------------------------------
  useEffect(() => {
    fetch(`http://localhost:5000/api/slots/${slotId}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to load slot");
        }

        return res.json();
      })
      .then((data) => {
        setSlot(data);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [slotId]);

  // -----------------------------------
  // Confirm booking
  // -----------------------------------
  const handleBooking = async () => {
    setError("");

    if (!user) {
      navigate("/login");
      return;
    }

    try {
      setBooking(true);

      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5000/api/bookings",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            slotId: slotId,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Booking failed"
        );
      }

      setSuccess(
        "Your appointment has been booked successfully!"
      );

      // After successful booking
      setTimeout(() => {
        navigate("/my-bookings");
      }, 1500);

    } catch (err) {
      setError(err.message);
    } finally {
      setBooking(false);
    }
  };

  // -----------------------------------
  // Loading
  // -----------------------------------
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading appointment...</p>
      </div>
    );
  }

  // -----------------------------------
  // Error
  // -----------------------------------
  if (error && !slot) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center">

          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />

          <h2 className="text-2xl font-bold mb-3">
            Unable to load appointment
          </h2>

          <p className="text-gray-600 mb-5">
            {error}
          </p>

          <button
            onClick={() => navigate("/services")}
            className="bg-pink-600 text-white px-6 py-3 rounded-lg"
          >
            Back to Services
          </button>

        </div>
      </div>
    );
  }

  if (!slot) {
    return null;
  }

  return (
    <div className="min-h-screen bg-pink-50">

      {/* Header */}
      <section className="bg-gradient-to-r from-pink-600 to-purple-700 text-white py-14 px-6">

        <div className="max-w-5xl mx-auto">

          <p className="uppercase tracking-widest text-sm text-pink-100">
            Dewani Boutique
          </p>

          <h1 className="text-4xl font-bold mt-3">
            Confirm Your Appointment
          </h1>

          <p className="mt-3 text-pink-100">
            Review your appointment details before confirming.
          </p>

        </div>

      </section>

      {/* Main */}
      <section className="max-w-4xl mx-auto px-6 py-12">

        <div className="bg-white rounded-2xl shadow-lg p-8">

          <h2 className="text-2xl font-bold text-gray-800 mb-8">
            Appointment Details
          </h2>

          {/* Service */}
          <div className="bg-pink-50 rounded-xl p-6 mb-5">

            <h3 className="text-xl font-bold text-pink-700 mb-4">
              {slot.service?.name || "Boutique Service"}
            </h3>

            {slot.service?.description && (
              <p className="text-gray-600 mb-5">
                {slot.service.description}
              </p>
            )}

            {slot.service?.price !== undefined && (
              <p className="font-semibold text-gray-800">
                Price: ₹{slot.service.price}
              </p>
            )}

          </div>

          {/* Date */}
          <div className="flex items-center gap-4 border-b pb-5 mb-5">

            <CalendarDays className="w-7 h-7 text-pink-600" />

            <div>
              <p className="text-sm text-gray-500">
                Appointment Date
              </p>

              <p className="font-semibold text-gray-800">
                {new Date(slot.date).toLocaleDateString(
                  "en-IN",
                  {
                    weekday: "long",
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  }
                )}
              </p>
            </div>

          </div>

          {/* Time */}
          <div className="flex items-center gap-4 border-b pb-5 mb-6">

            <Clock className="w-7 h-7 text-pink-600" />

            <div>
              <p className="text-sm text-gray-500">
                Appointment Time
              </p>

              <p className="font-semibold text-gray-800">
                {slot.startTime} - {slot.endTime}
              </p>
            </div>

          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-5 flex gap-3">

              <AlertCircle className="w-5 h-5" />

              <span>{error}</span>

            </div>
          )}

          {/* Success */}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg mb-5 flex gap-3">

              <CheckCircle className="w-5 h-5" />

              <span>{success}</span>

            </div>
          )}

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">

            <button
              onClick={() => navigate(-1)}
              className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50"
            >
              Choose Another Slot
            </button>

            <button
              onClick={handleBooking}
              disabled={booking || !!success}
              className="flex-1 bg-pink-600 text-white py-3 rounded-lg font-semibold hover:bg-pink-700 disabled:bg-gray-400"
            >
              {booking
                ? "Confirming..."
                : "Confirm Appointment"}
            </button>

          </div>

        </div>

      </section>
    </div>
  );
}

export default BookSlots;