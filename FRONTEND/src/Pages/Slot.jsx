import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { CalendarDays, Clock, Sparkles, Scissors, IndianRupee, ArrowLeft, RefreshCw, ShoppingBag } from "lucide-react";

function Slots() {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const productContext = location.state?.product || null;

  const [slots, setSlots] = useState([]);
  const [service, setService] = useState(location.state?.service || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [generating, setGenerating] = useState(false);

  const fetchSlotsAndService = async () => {
    setLoading(true);
    setError("");
    try {
      // 1. Fetch service details
      const serviceRes = await fetch(`http://localhost:5000/api/services/${serviceId}`);
      if (serviceRes.ok) {
        const serviceData = await serviceRes.json();
        setService(serviceData);
      }

      // 2. Fetch available slots for service
      const slotsRes = await fetch(`http://localhost:5000/api/slots/service/${serviceId}`);
      if (!slotsRes.ok) throw new Error("Failed to load appointment slots");

      const slotsData = await slotsRes.json();
      setSlots(slotsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlotsAndService();
  }, [serviceId]);

  // Handle Auto-generating slots if needed
  const handleGenerateSlots = async () => {
    setGenerating(true);
    try {
      const res = await fetch(`http://localhost:5000/api/slots/generate/${serviceId}`, {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate slots");

      fetchSlotsAndService();
    } catch (err) {
      alert(err.message);
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fffafc] flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-pink-200 border-t-pink-600 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-500 font-medium">Fetching available appointment slots...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fffafc] px-6 py-12">
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-pink-600 mb-6 uppercase tracking-wider transition"
        >
          <ArrowLeft size={16} /> Back to Services
        </button>

        {/* Selected Product Context Banner (if coming from Products page) */}
        {productContext && (
          <div className="bg-gradient-to-r from-[#321f2b] to-[#542943] text-white rounded-3xl p-6 shadow-lg mb-8 flex items-center gap-5">
            <img
              src={productContext.image}
              alt={productContext.name}
              className="w-16 h-16 rounded-2xl object-cover border border-white/20 shrink-0"
            />
            <div>
              <span className="bg-pink-500/30 text-pink-200 text-xs font-bold px-3 py-0.5 rounded-full uppercase tracking-wider">
                Product Fitting Trial
              </span>
              <h3 className="font-serif text-xl font-bold mt-1">Fitting For: {productContext.name}</h3>
              <p className="text-pink-100/70 text-xs mt-0.5">
                Category: {productContext.category} | Fabric: {productContext.fabric || "Silk"}
              </p>
            </div>
          </div>
        )}

        {/* Service Header Card */}
        {service && (
          <div className="bg-white rounded-3xl border border-pink-100 shadow-sm p-8 mb-8">
            <div className="flex items-center gap-2 text-pink-600 font-semibold text-xs uppercase tracking-wider mb-2">
              <Scissors size={16} /> Dewani Boutique Service
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="font-serif text-3xl md:text-4xl font-bold text-[#321f2b]">
                  {service.name}
                </h1>
                {service.description && (
                  <p className="text-gray-500 text-sm mt-2 max-w-2xl leading-relaxed">
                    {service.description}
                  </p>
                )}
              </div>

              <div className="text-left md:text-right bg-pink-50/60 p-4 rounded-2xl border border-pink-100 shrink-0">
                <p className="text-xs text-gray-400 font-semibold">Fitting Service Fee</p>
                <div className="flex items-center text-pink-600 font-bold text-2xl mt-0.5">
                  <IndianRupee size={22} />
                  <span>{service.price}</span>
                </div>
                <p className="text-xs font-semibold text-gray-600 mt-1">
                  Duration: {service.duration} mins
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Section Heading */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-serif text-2xl font-bold text-[#321f2b]">Select Appointment Slot</h2>
            <p className="text-gray-500 text-sm mt-0.5">Pick a convenient date & time for your fitting session.</p>
          </div>

          <button
            onClick={fetchSlotsAndService}
            className="flex items-center gap-1.5 text-xs text-pink-600 font-bold bg-pink-50 hover:bg-pink-100 px-3.5 py-2 rounded-xl transition"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Refresh Slots
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-2xl mb-6 text-sm font-semibold">
            {error}
          </div>
        )}

        {/* No Available Slots State */}
        {!loading && slots.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 border border-gray-100 shadow-sm text-center max-w-2xl mx-auto">
            <CalendarDays className="w-16 h-16 text-pink-300 mx-auto mb-4" />
            <h3 className="font-serif text-2xl font-bold text-[#321f2b]">No Slots Scheduled Yet</h3>
            <p className="text-gray-500 mt-2 text-sm max-w-md mx-auto leading-relaxed">
              No available appointment slots found in MongoDB for this service. Click the button below to auto-generate upcoming appointment slots!
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={handleGenerateSlots}
                disabled={generating}
                className="w-full sm:w-auto bg-pink-600 hover:bg-pink-700 text-white font-semibold px-6 py-3 rounded-xl transition text-sm shadow-md shadow-pink-200 disabled:opacity-50"
              >
                {generating ? "Generating..." : "Generate Appointment Slots Now"}
              </button>

              <button
                onClick={() => navigate("/services")}
                className="w-full sm:w-auto border border-gray-200 text-gray-700 font-semibold px-6 py-3 rounded-xl hover:bg-gray-50 text-sm"
              >
                Back to Services
              </button>
            </div>
          </div>
        ) : (
          /* Available Slots Grid */
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {slots.map((slot) => (
              <div
                key={slot._id}
                className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full border border-emerald-200">
                      Available Slot
                    </span>
                    <span className="text-xs text-gray-400 font-medium">Boutique Trial</span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center shrink-0">
                        <CalendarDays size={20} />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 font-medium">Appointment Date</p>
                        <p className="font-bold text-[#321f2b] text-sm">
                          {new Date(slot.date).toLocaleDateString("en-IN", {
                            weekday: "short",
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                        <Clock size={20} />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 font-medium">Time Window</p>
                        <p className="font-bold text-[#321f2b] text-sm">
                          {slot.startTime} - {slot.endTime}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() =>
                    navigate(`/book/${slot._id}`, {
                      state: { product: productContext, service },
                    })
                  }
                  className="mt-6 w-full bg-pink-600 hover:bg-pink-700 text-white font-semibold py-3 rounded-xl transition text-sm shadow-md shadow-pink-200"
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