import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CalendarDays, Clock } from "lucide-react";

function Slots() {
  const { serviceId } = useParams();
  const [slots, setSlots] = useState([]);
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();


  useEffect(() => {
    fetch("http://localhost:5000/api/slots")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to load slots");
        }
        return res.json();
      })
      .then((data) => {
        // Find slots belonging to selected service
        const filtered = data.filter(
          (slot) =>
            slot.service &&
            slot.service._id === serviceId
        );
        setSlots(filtered);
        // Get service information
        if (filtered.length > 0) {
          setService(filtered[0].service);
        }})
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });

  }, [serviceId]);
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">
          Loading available slots...
        </p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600">{error} </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pink-50 px-6 py-12">

      <div className="max-w-5xl mx-auto">

        {/* Service heading */}
        {service && (
          <div className="bg-white rounded-2xl shadow-md p-8 mb-8">

            <p className="text-pink-600 uppercase tracking-wider text-sm">
              Dewani Boutique
            </p>

            <h1 className="text-4xl font-bold text-gray-800 mt-2">
              {service.name}
            </h1>

            {service.description && (
              <p className="text-gray-600 mt-3">
                {service.description}
              </p>
            )}

            <p className="text-pink-600 font-semibold mt-4">
              ₹{service.price}
            </p>

          </div>
        )}


        {/* Page heading */}
        <div className="mb-6">

          <h2 className="text-2xl font-bold text-gray-800">
            Available Appointment Slots
          </h2>

          <p className="text-gray-600 mt-1">
            Choose a convenient date and time.
          </p>

        </div>


        {/* No slots */}
        {slots.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-md p-10 text-center">

            <CalendarDays className="w-12 h-12 text-gray-400 mx-auto mb-4" />

            <h3 className="text-xl font-semibold text-gray-700">
              No Available Slots
            </h3>

            <p className="text-gray-500 mt-2">
              There are currently no available appointments
              for this service.
            </p>

            <button
              onClick={() => navigate("/services")}
              className="mt-6 bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700"
            >
              Back to Services
            </button>

          </div>
        ) : (

          <div className="grid md:grid-cols-2 gap-5">

            {slots.map((slot) => (

              <div
                key={slot._id}
                className="bg-white rounded-2xl shadow-md p-6"
              >

                {/* Date */}
                <div className="flex items-center gap-3 mb-4">

                  <CalendarDays className="w-6 h-6 text-pink-600" />

                  <div>
                    <p className="text-sm text-gray-500">
                      Date
                    </p>

                    <p className="font-semibold text-gray-800">
                      {new Date(slot.date).toLocaleDateString(
                        "en-IN",
                        {
                          weekday: "short",
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        }
                      )}
                    </p>
                  </div>

                </div>


                {/* Time */}
                <div className="flex items-center gap-3 mb-6">

                  <Clock className="w-6 h-6 text-pink-600" />

                  <div>
                    <p className="text-sm text-gray-500">
                      Time
                    </p>

                    <p className="font-semibold text-gray-800">
                      {slot.startTime} - {slot.endTime}
                    </p>
                  </div>

                </div>


                {/* Book */}
                <button
                  onClick={() =>
                    navigate(`/book/${slot._id}`)
                  }
                  className="w-full bg-pink-600 text-white py-3 rounded-lg font-semibold hover:bg-pink-700 transition"
                >
                  Book This Slot
                </button>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
}

export default Slots;