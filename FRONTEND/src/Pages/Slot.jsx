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
      <div className="min-h-screen bg-[#FAF6F0] flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#E5D9CC] border-t-[#8B4513] rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-stone-500 font-medium text-sm">Fetching available atelier slots...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF6F0] text-[#38220F] px-6 py-12">
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-bold text-stone-500 hover:text-[#8B4513] mb-6 uppercase tracking-wider transition cursor-pointer"
        >
          <ArrowLeft size={16} /> Back to Services
        </button>

        {/* Selected Product Context Banner (if coming from Products page) */}
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
              <h3 className="font-serif text-xl font-bold mt-1">Fitting For: {productContext.name}</h3>
              <p className="text-white/70 text-xs mt-0.5">
                Category: {productContext.category} | Fabric: {productContext.fabric || "Silk"}
              </p>
            </div>
          </div>
        )}

        {/* Service Header Card */}
        {service && (
          <div className="bg-white rounded-3xl border border-[#E5D9CC] shadow-xs p-8 mb-8">
            <div className="flex items-center gap-2 text-[#8B4513] font-bold text-xs uppercase tracking-wider mb-2">
              <Scissors size={16} /> Dewani Atelier Fitting Service
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="font-serif text-3xl md:text-4xl font-bold text-[#38220F]">
                  {service.name}
                </h1>
                {service.description && (
                  <p className="text-stone-500 text-sm mt-2 max-w-2xl leading-relaxed">
                    {service.description}
                  </p>
                )}
              </div>

              <div className="text-left md:text-right bg-[#FAF6F0] p-5 rounded-2xl border border-[#E5D9CC] shrink-0">
                <p className="text-[11px] text-stone-400 font-bold uppercase">Fitting Service Fee</p>
                <div className="flex items-center text-[#8B4513] font-bold text-2xl mt-0.5">
                  <IndianRupee size={22} />
                  <span>{service.price}</span>
                </div>
                <p className="text-xs font-semibold text-stone-600 mt-1">
                  Duration: {service.duration} mins
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Section Heading */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-serif text-2xl font-bold text-[#38220F]">Select Available Slot</h2>
            <p className="text-stone-500 text-sm mt-0.5">Pick a convenient date & time for your master tailoring fitting session.</p>
          </div>

          <button
            onClick={fetchSlotsAndService}
            className="flex items-center gap-1.5 text-xs text-[#8B4513] font-bold bg-[#FAF6F0] hover:bg-[#E5D9CC] border border-[#E5D9CC] px-4 py-2.5 rounded-xl transition cursor-pointer"
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
          <div className="bg-white rounded-3xl p-12 border border-[#E5D9CC] shadow-sm text-center max-w-2xl mx-auto">
            <CalendarDays className="w-16 h-16 text-[#8B4513]/40 mx-auto mb-4" />
            <h3 className="font-serif text-2xl font-bold text-[#38220F]">No Slots Scheduled Yet</h3>
            <p className="text-stone-500 mt-2 text-sm max-w-md mx-auto leading-relaxed">
              No available appointment slots found in database for this service. Click below to generate upcoming slots!
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={handleGenerateSlots}
                disabled={generating}
                className="w-full sm:w-auto bg-[#8B4513] hover:bg-[#6D340D] text-[#FAF6F0] font-semibold px-6 py-3.5 rounded-2xl transition text-xs shadow-md cursor-pointer disabled:opacity-50"
              >
                {generating ? "Generating Slots..." : "Generate Appointment Slots Now"}
              </button>

              <button
                onClick={() => navigate("/services")}
                className="w-full sm:w-auto border border-stone-200 text-stone-700 font-semibold px-6 py-3.5 rounded-2xl hover:bg-stone-50 text-xs"
              >
                Back to Services
              </button>
            </div>
          </div>
        ) : (
          /* Available Slots Grid */
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {slots.map((slot) => {
              const isFull = slot.isDayFull || slot.isBooked;
              return (
                <div
                  key={slot._id}
                  className={`bg-white rounded-3xl border border-[#E5D9CC] p-6 shadow-xs transition flex flex-col justify-between ${
                    isFull ? "opacity-75 bg-stone-50" : "hover:shadow-md"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      {isFull ? (
                        <span className="bg-rose-100 text-rose-800 text-[11px] font-bold px-3 py-1 rounded-full border border-rose-200 uppercase">
                          Slot Filling / Day Full (10/10)
                        </span>
                      ) : (
                        <span className="bg-emerald-50 text-emerald-800 text-[11px] font-bold px-3 py-1 rounded-full border border-emerald-200 uppercase">
                          Available Slot
                        </span>
                      )}
                      <span className="bg-amber-50 text-amber-900 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-amber-200">
                        {slot.dailyBookedCount || 0}/10 Booked
                      </span>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#FAF6F0] text-[#8B4513] flex items-center justify-center shrink-0 border border-[#E5D9CC]">
                          <CalendarDays size={18} />
                        </div>
                        <div>
                          <p className="text-[11px] text-stone-400 font-bold uppercase">Appointment Date</p>
                          <p className="font-bold text-[#38220F] text-sm">
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
                        <div className="w-10 h-10 rounded-xl bg-[#FAF6F0] text-[#8B4513] flex items-center justify-center shrink-0 border border-[#E5D9CC]">
                          <Clock size={18} />
                        </div>
                        <div>
                          <p className="text-[11px] text-stone-400 font-bold uppercase">Time Window</p>
                          <p className="font-bold text-[#38220F] text-sm">
                            {slot.startTime} - {slot.endTime}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      !isFull &&
                      navigate(`/book/${slot._id}`, {
                        state: { product: productContext, service },
                      })
                    }
                    disabled={isFull}
                    className={`mt-6 w-full font-semibold py-3.5 rounded-2xl transition text-xs shadow-md ${
                      isFull
                        ? "bg-stone-300 text-stone-500 cursor-not-allowed shadow-none"
                        : "bg-[#8B4513] hover:bg-[#6D340D] text-[#FAF6F0] cursor-pointer"
                    }`}
                  >
                    {isFull ? "Day Fully Booked (10/10)" : "Book This Slot"}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Slots;