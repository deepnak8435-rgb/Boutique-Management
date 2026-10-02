import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Scissors,Upload,CheckCircle2,CalendarDays,Clock,IndianRupee,Sparkles, ArrowRight,ArrowLeft,Info,ShieldCheck,Check,AlertCircle,Clock3,FileText,UserCheck,} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export function CustomOrderWizard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Wizard Step State (1: Fabric & Specs, 2: Services & Model, 3: Manual Slot Date, 4: Order Booking Slip & Confirm)
  const [currentStep, setCurrentStep] = useState(1);

  // Data states from backend
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Step 1: Fabrics & Material Catalog (100+ material specifications)
  const fabricCatalog = [
    {
      id: "fab_1",
      name: "Royal Banarasi Pure Silk",
      type: "Pure Silk",
      flow: "Heavy Royal Fall & Structure",
      texture: "Rich Textured Gold Zari Weave",
      dyeable: false,
      care: "Dry Clean Only",
      suitability: "Bridal & Wedding Heavy Wear",
      pricePerMeter: 1450,
      image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: "fab_2",
      name: "Pure Chiffon Crepe (Dyeable)",
      type: "Chiffon",
      flow: "Fluid & Ultra Soft Floating Drape",
      texture: "Silky Smooth Grain",
      dyeable: true,
      care: "Dry Wash or Gentle Handwash",
      suitability: "Daily & Evening Luxury Wear",
      pricePerMeter: 680,
      image: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: "fab_3",
      name: "Organza Tissue Sheer",
      type: "Organza",
      flow: "Crisp & Elegant Volume",
      texture: "Lightweight Sheer Shimmer",
      dyeable: true,
      care: "Dry Clean Only",
      suitability: "Festive & Designer Dupattas",
      pricePerMeter: 850,
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: "fab_4",
      name: "Raw Silk Matt Texture",
      type: "Raw Silk",
      flow: "Structured & Tailored Contour",
      texture: "Natural Slub Grain",
      dyeable: true,
      care: "Dry Clean Preferred",
      suitability: "Blouse, Suits & Jackets",
      pricePerMeter: 920,
      image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: "fab_5",
      name: "Micro Velvet Plush",
      type: "Velvet",
      flow: "Heavy Royal Fall",
      texture: "Ultra Plush Velvet Finish",
      dyeable: false,
      care: "Dry Clean Only",
      suitability: "Winter Bridal & Lehengas",
      pricePerMeter: 1200,
      image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=600&q=80",
    },
  ];

  const [selectedFabric, setSelectedFabric] = useState(fabricCatalog[0]);

  // Step 2: Service Toggles (Dyeing, Embroidery, Handwork, Stitching)
  const [needDyeing, setNeedDyeing] = useState(false);
  const [needEmbroidery, setNeedEmbroidery] = useState(true);
  const [needHandwork, setNeedHandwork] = useState(false);
  const [needStitching, setNeedStitching] = useState(true);

  // Model Reference State (Curated Model or Upload Photo from Phone Gallery)
  const presetReferences = [
    {
      id: "ref_1",
      title: "Royal Bridal Lehenga with Heavy Zari",
      category: "Lehengas",
      image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: "ref_2",
      title: "Hand-Woven Pure Kanjivaram Silk Saree",
      category: "Sarees",
      image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: "ref_3",
      title: "Designer Backless Blouse with Maggam Work",
      category: "Blouse Designs",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: "ref_4",
      title: "Custom Indo-Western Flare Gown",
      category: "Custom Gowns",
      image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=800&q=80",
    },
  ];

  const [selectedReference, setSelectedReference] = useState(presetReferences[0].image);
  const [customFile, setCustomFile] = useState(null);
  const [customFilePreview, setCustomFilePreview] = useState(null);

  // Step 3: Manual Slot Date Selector & 10/day Capacity Auto Next-Day Check
  const [manualDate, setManualDate] = useState(() => {
    const today = new Date();
    today.setDate(today.getDate() + 1);
    return today.toISOString().split("T")[0];
  });
  const [dateAlert, setDateAlert] = useState("");
  const [selectedSlotId, setSelectedSlotId] = useState("");

  // Step 4: Order Confirmation Mode & Payment Options
  const [orderType, setOrderType] = useState("confirmed"); // "confirmed" (Advance Payment) vs "7_day_hold" (7-Day Hold)
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [advanceAmount, setAdvanceAmount] = useState(500);

  const [dateBookedCount, setDateBookedCount] = useState(0);
  const [nextSuggestedDate, setNextSuggestedDate] = useState("");

  useEffect(() => {
    if (manualDate) {
      fetchSlotsForDate(manualDate);
    }
  }, [manualDate]);

  const calculateNextOpenDate = (currentDateStr) => {
    let d = new Date(currentDateStr);
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  };

  const fetchSlotsForDate = async (targetDateStr) => {
    setLoadingSlots(true);
    try {
      const res = await fetch(`http://localhost:5000/api/slots/date/${targetDateStr}`);
      if (res.ok) {
        const data = await res.json();
        setAvailableSlots(data.slots || []);
        setDateBookedCount(data.dailyBookedCount || 0);

        if (data.slots && data.slots.length > 0) {
          const firstOpenSlot = data.slots.find((s) => !s.isBooked) || data.slots[0];
          setSelectedSlotId(firstOpenSlot._id);
        }

        if (data.isDayFull || (data.dailyBookedCount || 0) >= 10) {
          const nextD = calculateNextOpenDate(targetDateStr);
          setNextSuggestedDate(nextD);
          setDateAlert(`Notice: Selected date (${targetDateStr}) has reached full capacity (10/10 customers booked). Please choose another date.`);
        } else {
          setDateAlert("");
          setNextSuggestedDate("");
        }
      }
    } catch (err) {
      console.error("Failed to fetch slots for date", err);
    } finally {
      setLoadingSlots(false);
    }
  };

  // Handle Manual Date Selection with 10/Day Capacity Check
  const handleManualDateChange = (e) => {
    const chosenDateStr = e.target.value;
    setManualDate(chosenDateStr);
  };

  // Active services checklist construction
  const selectedServicesList = [];
  if (needDyeing) selectedServicesList.push({ name: "Custom Fabric Dyeing & Color Matching", price: 600 });
  if (needEmbroidery) selectedServicesList.push({ name: "Hand Zardosi Embroidery Work", price: 1500 });
  if (needHandwork) selectedServicesList.push({ name: "Heavy Handwork & Bead Detailing", price: 1200 });
  if (needStitching) selectedServicesList.push({ name: "Master Stitching & Scalloping Edging", price: 1200 });

  const servicesTotalPrice = selectedServicesList.reduce((sum, s) => sum + s.price, 0);
  const totalPrice = servicesTotalPrice + selectedFabric.pricePerMeter;
  const remainingBalance = Math.max(0, totalPrice - (orderType === "7_day_hold" ? 0 : advanceAmount));

  // Selected slot details snapshot
  const selectedSlot = availableSlots.find((s) => s._id === selectedSlotId);

  // Handle Form Submission
  const handleSubmitCustomOrder = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate("/login", { state: { message: "Please login to submit your custom boutique order." } });
      return;
    }

    if (!selectedSlotId && !manualDate) {
      setError("Please select an available fitting slot date.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const token = user?.token || localStorage.getItem("token");
      const activeImage = customFilePreview || selectedReference;

      const res = await fetch("http://localhost:5000/api/bookings/custom-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          slotId: selectedSlotId || null,
          manualDate: manualDate || null,
          referenceImage: activeImage,
          fabricName: selectedFabric.name,
          fabricDetails: {
            flow: selectedFabric.flow,
            texture: selectedFabric.texture,
            dyeable: selectedFabric.dyeable,
            careInstructions: selectedFabric.care,
            suitableFor: selectedFabric.suitability,
          },
          selectedServices: selectedServicesList,
          orderType: orderType,
          paymentMethod: paymentMethod,
          advanceAmount: orderType === "7_day_hold" ? 0 : advanceAmount,
          totalAmount: totalPrice,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to submit custom order");

      navigate("/my-bookings", {
        state: {
          successMessage:
            orderType === "7_day_hold"
              ? "Your appointment slot & fabric spec are placed on 7-Day Hold! You have 7 days to finalize design doubts."
              : "Custom Boutique Order & Slot confirmed with advance payment!",
        },
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF6F0] py-10 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Top Banner Header */}
        <div className="bg-gradient-to-r from-[#2A1810] to-[#38220F] text-white rounded-3xl p-8 border border-[#E5D9CC]/30 shadow-xl mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-2 text-[#E5D9CC] font-semibold text-xs uppercase tracking-widest mb-2">
              <Scissors size={16} /> Dewani Custom Atelier Studio
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold">Custom Tailoring & Scratch Design Studio</h1>
            <p className="text-[#FAF6F0]/80 text-sm mt-1 max-w-2xl">
              Design your outfit from scratch! Select fabric specs, toggle dyeing, embroidery, handwork & stitching services, enter your slot date, and generate your custom order booking slip.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-[#FAF6F0]/10 border border-[#E5D9CC]/30 px-4 py-2.5 rounded-2xl text-xs font-semibold backdrop-blur-md">
            <Sparkles size={18} className="text-[#E5D9CC]" /> Live Capacity: Max 10 Customers / Day
          </div>
        </div>

        {/* Wizard Stepper Tabs */}
        <div className="bg-white rounded-3xl p-4 border border-[#E5D9CC] shadow-xs mb-8 flex items-center justify-between overflow-x-auto gap-2">
          {[
            { step: 1, title: "1. Fabric & Specs", icon: Sparkles },
            { step: 2, title: "2. Services & Model", icon: Scissors },
            { step: 3, title: "3. Slot Date & Day", icon: CalendarDays },
            { step: 4, title: "4. Order Slip & Confirm", icon: FileText },
          ].map((s) => {
            const Icon = s.icon;
            const isActive = currentStep === s.step;
            const isDone = currentStep > s.step;
            return (
              <button
                key={s.step}
                onClick={() => setCurrentStep(s.step)}
                className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm transition shrink-0 cursor-pointer ${
                  isActive
                    ? "bg-[#8B4513] text-white shadow-md shadow-[#8B4513]/20"
                    : isDone
                    ? "bg-[#FAF6F0] text-[#8B4513] border border-[#E5D9CC]"
                    : "bg-white text-gray-500 border border-gray-100 hover:bg-[#FAF6F0]"
                }`}
              >
                <Icon size={16} />
                <span>{s.title}</span>
                {isDone && <CheckCircle2 size={14} className="text-[#8B4513]" />}
              </button>
            );
          })}
        </div>

        {/* STEP 1: FABRIC & MATERIAL SELECTION (100+ CATALOG) */}
        {currentStep === 1 && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5D9CC] shadow-xs space-y-6">
            <div className="border-b border-[#E5D9CC]/50 pb-4">
              <h2 className="font-serif text-2xl font-bold text-[#38220F] flex items-center gap-2">
                <Sparkles className="text-[#8B4513]" size={22} /> Step 1: Select Fabric Material & Inspect Specs
              </h2>
              <p className="text-gray-600 text-sm mt-1">
                Select your fabric from 100+ materials. Inspect flow, texture, dyeable status, care instructions, and suitability.
              </p>
            </div>

            {/* Fabrics Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {fabricCatalog.map((fab) => (
                <div
                  key={fab.id}
                  onClick={() => setSelectedFabric(fab)}
                  className={`rounded-3xl border p-5 transition cursor-pointer flex flex-col justify-between ${
                    selectedFabric.id === fab.id
                      ? "border-[#8B4513] bg-[#FAF6F0] ring-2 ring-[#8B4513]/30 shadow-md"
                      : "border-[#E5D9CC] bg-white hover:border-[#8B4513]"
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <img src={fab.image} alt={fab.name} className="w-16 h-16 object-cover rounded-2xl border border-[#E5D9CC] shrink-0" />
                      <div>
                        <h4 className="font-bold text-[#38220F] text-base">{fab.name}</h4>
                        <span className="text-[10px] font-bold px-2.5 py-0.5 bg-amber-50 text-amber-900 border border-amber-200 rounded-full uppercase">
                          ₹{fab.pricePerMeter} / meter
                        </span>
                      </div>
                    </div>

                    {/* Rich Specifications */}
                    <div className="space-y-2 text-xs text-gray-700 bg-white p-3 rounded-2xl border border-[#E5D9CC]/70">
                      <div><strong className="text-[#8B4513]">Flow & Fall:</strong> {fab.flow}</div>
                      <div><strong className="text-[#8B4513]">Texture & Feel:</strong> {fab.texture}</div>
                      <div className="flex items-center gap-2">
                        <strong className="text-[#8B4513]">Dyeable:</strong>
                        <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] uppercase ${fab.dyeable ? "bg-emerald-100 text-emerald-800" : "bg-gray-100 text-gray-600"}`}>
                          {fab.dyeable ? "Yes (Dyeable to Any Color)" : "No (Fixed Color)"}
                        </span>
                      </div>
                      <div><strong className="text-[#8B4513]">Care:</strong> {fab.care}</div>
                      <div><strong className="text-[#8B4513]">Suitability:</strong> {fab.suitability}</div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#E5D9CC]/50 flex items-center justify-between text-xs">
                    <span className="text-[#8B4513] font-bold">
                      {selectedFabric.id === fab.id ? "✓ Selected Fabric" : "Click to Select"}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-4">
              <button
                onClick={() => setCurrentStep(2)}
                className="flex items-center gap-2 bg-[#8B4513] hover:bg-[#6D340D] text-white px-8 py-3 rounded-xl font-semibold text-sm transition cursor-pointer"
              >
                Proceed to Custom Services & Model <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: SERVICE TOGGLES (DYEING, EMBROIDERY, HANDWORK, STITCHING) & MODEL REFERENCE */}
        {currentStep === 2 && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5D9CC] shadow-xs space-y-8">
            <div className="border-b border-[#E5D9CC]/50 pb-4">
              <h2 className="font-serif text-2xl font-bold text-[#38220F] flex items-center gap-2">
                <Scissors className="text-[#8B4513]" size={22} /> Step 2: Customization Services & Outfit Model
              </h2>
              <p className="text-gray-600 text-sm mt-1">
                Toggle exact services needed for your fabric (Dyeing, Embroidery, Handwork, Stitching) and select your dress model.
              </p>
            </div>

            {/* Customization Service Toggles Grid */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-[#8B4513] uppercase tracking-wider">
                A. Service Requirements Checklist (Yes / No Toggles)
              </h3>

              <div className="grid sm:grid-cols-2 gap-4">
                {/* Toggle 1: Dyeing Service */}
                <div
                  onClick={() => setNeedDyeing(!needDyeing)}
                  className={`p-5 rounded-2xl border transition cursor-pointer flex items-center justify-between ${
                    needDyeing ? "border-[#8B4513] bg-[#FAF6F0]" : "border-stone-200 bg-white hover:border-[#8B4513]/40"
                  }`}
                >
                  <div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase bg-indigo-50 text-indigo-700">
                      Color Customization
                    </span>
                    <h4 className="font-bold text-[#38220F] text-sm mt-1">Fabric Dyeing & Color Matching</h4>
                    <p className="text-xs text-stone-500 mt-0.5">Dye chosen fabric to your custom shade</p>
                  </div>
                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${needDyeing ? "bg-emerald-100 text-emerald-800" : "bg-stone-100 text-stone-600"}`}>
                      {needDyeing ? "YES (Needed +₹600)" : "NO"}
                    </span>
                  </div>
                </div>

                {/* Toggle 2: Embroidery Work */}
                <div
                  onClick={() => setNeedEmbroidery(!needEmbroidery)}
                  className={`p-5 rounded-2xl border transition cursor-pointer flex items-center justify-between ${
                    needEmbroidery ? "border-[#8B4513] bg-[#FAF6F0]" : "border-stone-200 bg-white hover:border-[#8B4513]/40"
                  }`}
                >
                  <div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase bg-amber-50 text-amber-700">
                      Artisan Embroidery
                    </span>
                    <h4 className="font-bold text-[#38220F] text-sm mt-1">Hand Zardosi Embroidery Work</h4>
                    <p className="text-xs text-stone-500 mt-0.5">Neckline & border thread embroidery</p>
                  </div>
                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${needEmbroidery ? "bg-emerald-100 text-emerald-800" : "bg-stone-100 text-stone-600"}`}>
                      {needEmbroidery ? "YES (Needed +₹1500)" : "NO"}
                    </span>
                  </div>
                </div>

                {/* Toggle 3: Handwork & Beads */}
                <div
                  onClick={() => setNeedHandwork(!needHandwork)}
                  className={`p-5 rounded-2xl border transition cursor-pointer flex items-center justify-between ${
                    needHandwork ? "border-[#8B4513] bg-[#FAF6F0]" : "border-stone-200 bg-white hover:border-[#8B4513]/40"
                  }`}
                >
                  <div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase bg-purple-50 text-purple-700">
                      Heavy Crafting
                    </span>
                    <h4 className="font-bold text-[#38220F] text-sm mt-1">Heavy Handwork & Bead Detailing</h4>
                    <p className="text-xs text-stone-500 mt-0.5">Custom stone & bead work accents</p>
                  </div>
                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${needHandwork ? "bg-emerald-100 text-emerald-800" : "bg-stone-100 text-stone-600"}`}>
                      {needHandwork ? "YES (Needed +₹1200)" : "NO"}
                    </span>
                  </div>
                </div>

                {/* Toggle 4: Stitching & Scalloping */}
                <div
                  onClick={() => setNeedStitching(!needStitching)}
                  className={`p-5 rounded-2xl border transition cursor-pointer flex items-center justify-between ${
                    needStitching ? "border-[#8B4513] bg-[#FAF6F0]" : "border-stone-200 bg-white hover:border-[#8B4513]/40"
                  }`}
                >
                  <div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase bg-emerald-50 text-emerald-700">
                      Master Tailoring
                    </span>
                    <h4 className="font-bold text-[#38220F] text-sm mt-1">Master Stitching & Scalloping Edging</h4>
                    <p className="text-xs text-stone-500 mt-0.5">Boutique fitting stitching & cutwork scalloping</p>
                  </div>
                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${needStitching ? "bg-emerald-100 text-emerald-800" : "bg-stone-100 text-stone-600"}`}>
                      {needStitching ? "YES (Needed +₹1200)" : "NO"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Dress Reference Selection / Upload Option */}
            <div className="pt-4 border-t border-[#E5D9CC]/50 space-y-4">
              <h3 className="text-xs font-bold text-[#8B4513] uppercase tracking-wider">
                B. Outfit Model Reference or Phone Gallery Photo Upload
              </h3>

              {/* Upload custom reference image */}
              <div className="p-5 rounded-2xl bg-[#FAF6F0] border border-[#E5D9CC] space-y-3">
                <label className="text-xs font-bold text-gray-700 uppercase flex items-center gap-2">
                  <Upload size={16} /> Upload Custom Reference Photo (From Device Gallery)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setCustomFile(file);
                      setCustomFilePreview(URL.createObjectURL(file));
                    }
                  }}
                  className="w-full text-xs text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#8B4513] file:text-white hover:file:bg-[#6D340D] cursor-pointer"
                />

                {customFilePreview && (
                  <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-[#E5D9CC]">
                    <img src={customFilePreview} alt="Custom Preview" className="w-16 h-16 object-cover rounded-lg border" />
                    <div>
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                        Gallery Photo Selected
                      </span>
                      <p className="text-xs font-bold text-[#38220F] mt-1">{customFile?.name}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Preset Model References */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {presetReferences.map((ref) => (
                  <div
                    key={ref.id}
                    onClick={() => {
                      setSelectedReference(ref.image);
                      setCustomFile(null);
                      setCustomFilePreview(null);
                    }}
                    className={`rounded-2xl border p-3 transition cursor-pointer flex flex-col justify-between ${
                      selectedReference === ref.image && !customFilePreview
                        ? "border-[#8B4513] bg-[#FAF6F0] ring-2 ring-[#8B4513]/30 shadow-md"
                        : "border-[#E5D9CC] bg-white hover:border-[#8B4513]"
                    }`}
                  >
                    <img src={ref.image} alt={ref.title} className="w-full h-36 object-cover rounded-xl mb-2 border" />
                    <div>
                      <span className="text-[9px] font-bold px-2 py-0.5 bg-[#FAF6F0] text-[#8B4513] border border-[#E5D9CC] rounded-full uppercase">
                        {ref.category}
                      </span>
                      <h4 className="font-bold text-[#38220F] text-xs mt-1">{ref.title}</h4>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <button
                onClick={() => setCurrentStep(1)}
                className="flex items-center gap-2 border border-[#E5D9CC] text-gray-700 hover:bg-[#FAF6F0] px-6 py-3 rounded-xl font-semibold text-sm transition cursor-pointer"
              >
                <ArrowLeft size={18} /> Back
              </button>
              <button
                onClick={() => setCurrentStep(3)}
                className="flex items-center gap-2 bg-[#8B4513] hover:bg-[#6D340D] text-white px-8 py-3 rounded-xl font-semibold text-sm transition cursor-pointer"
              >
                Proceed to Manual Slot Date <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: MANUAL SLOT DATE SELECTOR & LIVE CAPACITY 10/DAY CHECK */}
        {currentStep === 3 && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5D9CC] shadow-xs space-y-6">
            <div className="border-b border-[#E5D9CC]/50 pb-4">
              <h2 className="font-serif text-2xl font-bold text-[#38220F] flex items-center gap-2">
                <CalendarDays className="text-[#8B4513]" size={22} /> Step 3: Pick Appointment Slot Date & Day
              </h2>
              <p className="text-gray-600 text-sm mt-1">
                Enter your preferred date manually. Daily boutique capacity limit is max 10 customers/day.
              </p>
            </div>

            {/* Manual Date Input Picker */}
            <div className="p-6 rounded-2xl bg-[#FAF6F0] border border-[#E5D9CC] space-y-3">
              <label className="block text-xs font-bold text-[#8B4513] uppercase">
                A. Enter Preferred Date & Day Manually *
              </label>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <input
                  type="date"
                  value={manualDate}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={handleManualDateChange}
                  className="px-4 py-3 rounded-xl border border-[#E5D9CC] text-sm outline-none focus:border-[#8B4513] bg-white font-semibold text-[#38220F] shadow-xs cursor-pointer"
                />
                <span className="text-xs text-stone-500">
                  Select any day to inspect live customer booking capacity & open slots.
                </span>
              </div>
            </div>

            {/* Daily Visitor & Pending Slots Indicator Banner */}
            <div className="p-4 rounded-2xl bg-white border border-[#E5D9CC] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-900 border border-amber-200 flex items-center justify-center font-bold shrink-0">
                  <UserCheck size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-[#38220F] uppercase tracking-wider">Daily Boutique Visitor & Slot Status</h4>
                  <p className="text-xs text-stone-600 mt-0.5">
                    <strong className="text-amber-900">{dateBookedCount} Customers Booked for {manualDate}</strong> &bull;{" "}
                    <span className="text-emerald-700 font-bold">{Math.max(0, 10 - dateBookedCount)} Pending Slots Available</span>
                  </p>
                </div>
              </div>
              <div className="text-right text-[11px] text-stone-500 font-semibold bg-[#FAF6F0] px-3 py-1.5 rounded-xl border border-[#E5D9CC]">
                🔒 Privacy Secured: Customer Order Details are kept 1-on-1 Confidential
              </div>
            </div>

            {/* Available Appointment Slots Grid */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-stone-700 uppercase">
                B. Select Specific Fitting Time Slot Window *
              </label>

              {loadingSlots ? (
                <div className="py-8 text-center text-stone-500">
                  <div className="animate-spin w-8 h-8 border-4 border-[#E5D9CC] border-t-[#8B4513] rounded-full mx-auto mb-2"></div>
                  Fetching upcoming slots...
                </div>
              ) : availableSlots.length === 0 ? (
                <div className="p-4 bg-amber-50 border border-amber-200 text-amber-900 rounded-2xl text-xs font-semibold text-center">
                  No slots currently scheduled. Admin will add upcoming slots shortly.
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {availableSlots.map((slot) => {
                    const isSelected = selectedSlotId === slot._id;
                    const isFull = slot.isDayFull || slot.isBooked;

                    return (
                      <div
                        key={slot._id}
                        onClick={() => {
                          if (!isFull) setSelectedSlotId(slot._id);
                        }}
                        className={`p-4 rounded-2xl border transition flex flex-col justify-between ${
                          isFull
                            ? "border-stone-200 bg-stone-100 opacity-60 cursor-not-allowed"
                            : isSelected
                            ? "border-[#8B4513] bg-[#FAF6F0] ring-2 ring-[#8B4513]/30 shadow-xs cursor-pointer"
                            : "border-[#E5D9CC] bg-white hover:border-[#8B4513] cursor-pointer"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2 text-[#38220F] font-bold text-sm">
                            <Clock size={16} className="text-[#8B4513]" />
                            <span>{slot.startTime} - {slot.endTime}</span>
                          </div>
                          {isFull ? (
                            <span className="bg-rose-100 text-rose-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase border border-rose-200">
                              Booked / Full
                            </span>
                          ) : isSelected ? (
                            <span className="bg-[#8B4513] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                              Selected Window
                            </span>
                          ) : (
                            <span className="bg-emerald-50 text-emerald-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-200 uppercase">
                              Open Window
                            </span>
                          )}
                        </div>

                        <div className="text-[11px] text-stone-500 font-medium">
                          {isFull ? (
                            <span className="text-rose-700 font-semibold">Boutique Capacity Full for this Window</span>
                          ) : (
                            <span>Master Tailor Available for Fitting Session</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Full Capacity Alert & Next Day Suggestion Card */}
            {dateBookedCount >= 10 && (
              <div className="p-6 rounded-3xl bg-rose-50 border-2 border-rose-300 text-rose-950 space-y-4 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-rose-200 text-rose-800 flex items-center justify-center shrink-0 font-bold">
                    <AlertCircle size={22} />
                  </div>
                  <div>
                    <h4 className="font-serif text-lg font-bold text-rose-900">
                      Selected Date ({manualDate}) is 100% Fully Booked!
                    </h4>
                    <p className="text-xs text-rose-800 mt-1 leading-relaxed">
                      Daily boutique capacity limit (10 customers/day) has been reached for <strong>{manualDate}</strong>. No further fitting slots can be taken on this date.
                    </p>
                  </div>
                </div>

                {nextSuggestedDate && (
                  <div className="p-4 rounded-2xl bg-white border border-rose-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-200 px-2.5 py-0.5 rounded-full uppercase">
                        Recommended Next Open Date
                      </span>
                      <p className="text-sm font-bold text-[#38220F] mt-1">
                        {new Date(nextSuggestedDate).toLocaleDateString("en-IN", {
                          weekday: "long",
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleManualDateChange({ target: { value: nextSuggestedDate } })}
                      className="bg-[#8B4513] hover:bg-[#6D340D] text-white px-5 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer flex items-center gap-2 shadow-xs"
                    >
                      <span>Switch to {nextSuggestedDate}</span>
                      <ArrowRight size={16} />
                    </button>
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="flex items-center gap-2 border border-[#E5D9CC] text-gray-700 hover:bg-[#FAF6F0] px-6 py-3 rounded-xl font-semibold text-sm transition cursor-pointer"
              >
                <ArrowLeft size={18} /> Back
              </button>
              <button
                type="button"
                onClick={() => {
                  if (dateBookedCount < 10) setCurrentStep(4);
                }}
                disabled={dateBookedCount >= 10}
                className={`flex items-center gap-2 px-8 py-3 rounded-xl font-semibold text-sm transition ${
                  dateBookedCount >= 10
                    ? "bg-stone-300 text-stone-500 cursor-not-allowed"
                    : "bg-[#8B4513] hover:bg-[#6D340D] text-white cursor-pointer"
                }`}
              >
                <span>{dateBookedCount >= 10 ? "Select an Open Date to Proceed" : "Review Order Booking Slip"}</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: CUSTOMER ORDER BOOKING SLIP & FINAL CONCEPT REVIEW */}
        {currentStep === 4 && (
          <form onSubmit={handleSubmitCustomOrder} className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5D9CC] shadow-xl space-y-6">
            <div className="border-b border-[#E5D9CC]/50 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="font-serif text-2xl font-bold text-[#38220F] flex items-center gap-2">
                  <FileText className="text-[#8B4513]" size={22} /> Customer Atelier Booking Slip
                </h2>
                <p className="text-gray-600 text-sm mt-0.5">
                  Inspect your final custom dress concept, chosen fabric specs, tailoring checklist, appointment slot date & advance payment options.
                </p>
              </div>

              <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold px-3 py-1.5 rounded-full uppercase">
                Official Booking Slip Summary
              </span>
            </div>

            {error && (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-2xl flex items-center gap-2 text-sm font-semibold">
                <AlertCircle size={18} /> {error}
              </div>
            )}

            {/* Formatted Customer Order Slip Card */}
            <div className="p-6 md:p-8 rounded-3xl bg-[#FAF6F0] border-2 border-[#E5D9CC] space-y-6 shadow-sm">
              <div className="flex flex-col sm:flex-row justify-between gap-6 pb-6 border-b border-[#E5D9CC]">
                {/* Outfit Reference Image */}
                <div className="flex gap-4">
                  <img
                    src={customFilePreview || selectedReference}
                    alt="Dress Concept Reference"
                    className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-2xl border-2 border-[#E5D9CC] shrink-0"
                  />
                  <div>
                    <span className="bg-[#8B4513] text-[#FAF6F0] text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                      Outfit Concept
                    </span>
                    <h3 className="font-serif text-xl font-bold text-[#38220F] mt-1">
                      {customFile ? customFile.name : "Custom Atelier Dress Concept"}
                    </h3>
                    <p className="text-xs text-stone-600 mt-1">
                      Fabric: <strong>{selectedFabric.name}</strong> (₹{selectedFabric.pricePerMeter}/m)
                    </p>
                  </div>
                </div>

                {/* Customer Snapshot */}
                <div className="text-right sm:text-right text-xs space-y-1 text-stone-700">
                  <p className="font-bold text-[#38220F] text-sm">{user?.name || "Boutique Customer"}</p>
                  <p className="text-stone-500">{user?.email || "Customer Account"}</p>
                  <div className="inline-flex items-center gap-1 text-[#8B4513] font-bold bg-white px-2.5 py-1 rounded-full border border-[#E5D9CC] mt-1">
                    <UserCheck size={14} /> Profile Measurements Applied
                  </div>
                </div>
              </div>

              {/* Specs & Services Roster */}
              <div className="grid md:grid-cols-2 gap-6 text-xs text-stone-800">
                <div className="bg-white p-4 rounded-2xl border border-[#E5D9CC]">
                  <h4 className="font-bold text-[#8B4513] uppercase tracking-wider mb-2">
                    Fabric Material Specifications
                  </h4>
                  <ul className="space-y-1 leading-relaxed">
                    <li><strong>Material:</strong> {selectedFabric.name} ({selectedFabric.type})</li>
                    <li><strong>Flow & Fall:</strong> {selectedFabric.flow}</li>
                    <li><strong>Texture:</strong> {selectedFabric.texture}</li>
                    <li><strong>Dyeable:</strong> {selectedFabric.dyeable ? "Yes (Custom Shades)" : "Fixed Color"}</li>
                    <li><strong>Care:</strong> {selectedFabric.care}</li>
                  </ul>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-[#E5D9CC]">
                  <h4 className="font-bold text-[#8B4513] uppercase tracking-wider mb-2">
                    Tailoring & Crafting Checklist
                  </h4>
                  <ul className="space-y-1.5 font-medium">
                    <li className="flex items-center justify-between">
                      <span>Dyeing & Color Matching:</span>
                      <span className={`font-bold px-2 py-0.5 rounded ${needDyeing ? "bg-emerald-100 text-emerald-800" : "bg-stone-100 text-stone-600"}`}>
                        {needDyeing ? "YES (₹600)" : "NO"}
                      </span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span>Hand Zardosi Embroidery:</span>
                      <span className={`font-bold px-2 py-0.5 rounded ${needEmbroidery ? "bg-emerald-100 text-emerald-800" : "bg-stone-100 text-stone-600"}`}>
                        {needEmbroidery ? "YES (₹1500)" : "NO"}
                      </span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span>Heavy Handwork & Beads:</span>
                      <span className={`font-bold px-2 py-0.5 rounded ${needHandwork ? "bg-emerald-100 text-emerald-800" : "bg-stone-100 text-stone-600"}`}>
                        {needHandwork ? "YES (₹1200)" : "NO"}
                      </span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span>Stitching & Scalloping Edging:</span>
                      <span className={`font-bold px-2 py-0.5 rounded ${needStitching ? "bg-emerald-100 text-emerald-800" : "bg-stone-100 text-stone-600"}`}>
                        {needStitching ? "YES (₹1200)" : "NO"}
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Slot Schedule & Price Summary */}
              <div className="bg-white p-5 rounded-2xl border border-[#E5D9CC] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <span className="text-[11px] font-bold text-[#8B4513] uppercase tracking-wider">Appointment Schedule Window</span>
                  <div className="flex items-center gap-2 text-stone-900 font-bold text-sm mt-1">
                    <CalendarDays size={16} className="text-[#8B4513]" />
                    <span>
                      {selectedSlot?.date
                        ? new Date(selectedSlot.date).toLocaleDateString("en-IN", { weekday: "short", day: "2-digit", month: "short", year: "numeric" })
                        : manualDate}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-stone-600 mt-0.5">
                    <Clock size={14} className="text-[#8B4513]" />
                    <span>{selectedSlot ? `${selectedSlot.startTime} - ${selectedSlot.endTime}` : "Time Window Reserved"}</span>
                  </div>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-xs text-stone-500 uppercase font-bold">Total Estimated Outfit Price:</span>
                  <div className="text-3xl font-bold text-[#8B4513] flex items-center justify-start sm:justify-end gap-1">
                    <IndianRupee size={24} /> {totalPrice}
                  </div>
                </div>
              </div>
            </div>

            {/* Order Confirmation Mode: Advance Payment vs 7-Day Hold */}
            <div className="pt-4 border-t border-[#E5D9CC]/50">
              <label className="block text-xs font-bold text-gray-700 uppercase mb-3">
                Choose Booking Confirmation Option *
              </label>

              <div className="grid sm:grid-cols-2 gap-6">
                {/* Option 1: Confirm with Advance Payment */}
                <div
                  onClick={() => setOrderType("confirmed")}
                  className={`p-6 rounded-3xl border transition cursor-pointer flex flex-col justify-between ${
                    orderType === "confirmed"
                      ? "border-[#8B4513] bg-[#FAF6F0] ring-2 ring-[#8B4513]/30 shadow-sm"
                      : "border-[#E5D9CC] bg-white hover:border-[#8B4513]"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                        Recommended Option
                      </span>
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${orderType === "confirmed" ? "border-[#8B4513] bg-[#8B4513] text-white" : "border-gray-300"}`}>
                        {orderType === "confirmed" && <Check size={12} />}
                      </div>
                    </div>
                    <h4 className="font-serif text-lg font-bold text-[#38220F]">Confirm Order & Pay Advance</h4>
                    <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                      Pay a nominal advance (₹500) to confirm your fitting slot & start fabric cut immediately. Balance paid at trial.
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#E5D9CC]/50 text-xs font-bold text-[#8B4513]">
                    Advance Due Now: ₹{advanceAmount} | Balance at Fitting: ₹{remainingBalance}
                  </div>
                </div>

                {/* Option 2: 7-Day Hold (Pending Order) */}
                <div
                  onClick={() => setOrderType("7_day_hold")}
                  className={`p-6 rounded-3xl border transition cursor-pointer flex flex-col justify-between ${
                    orderType === "7_day_hold"
                      ? "border-[#8B4513] bg-[#FAF6F0] ring-2 ring-[#8B4513]/30 shadow-sm"
                      : "border-[#E5D9CC] bg-white hover:border-[#8B4513]"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="bg-amber-100 text-amber-900 border border-amber-200 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                        Pending Decision Hold
                      </span>
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${orderType === "7_day_hold" ? "border-[#8B4513] bg-[#8B4513] text-white" : "border-gray-300"}`}>
                        {orderType === "7_day_hold" && <Check size={12} />}
                      </div>
                    </div>
                    <h4 className="font-serif text-lg font-bold text-[#38220F]">Place 7-Day Hold (Zero Advance)</h4>
                    <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                      Have doubts or need 7 days to decide? Place your slot and fabric choice on a 7-day temporary hold without paying now.
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#E5D9CC]/50 text-xs font-bold text-amber-800 flex items-center gap-1">
                    <Clock3 size={14} /> Holds Slot & Specs Reserved for 7 Days
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method Selector (If Confirmed) */}
            {orderType === "confirmed" && (
              <div className="p-6 rounded-2xl bg-[#FAF6F0] border border-[#E5D9CC] space-y-3">
                <label className="block text-xs font-bold text-[#8B4513] uppercase">
                  Select Advance Payment Gateway
                </label>

                <div className="grid sm:grid-cols-3 gap-3">
                  {[
                    { id: "upi", label: "UPI / Google Pay" },
                    { id: "card", label: "Debit / Credit Card" },
                    { id: "cod", label: "Cash at Boutique" },
                  ].map((pm) => (
                    <button
                      key={pm.id}
                      type="button"
                      onClick={() => setPaymentMethod(pm.id)}
                      className={`py-2.5 px-4 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                        paymentMethod === pm.id
                          ? "bg-[#8B4513] text-white border-[#8B4513]"
                          : "bg-white text-gray-700 border-[#E5D9CC]"
                      }`}>
                      {pm.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="flex items-center gap-2 border border-[#E5D9CC] text-gray-700 hover:bg-[#FAF6F0] px-6 py-3 rounded-xl font-semibold text-sm transition cursor-pointer">
                <ArrowLeft size={18} /> Back
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center gap-2 bg-[#8B4513] hover:bg-[#6D340D] text-white px-8 py-3.5 rounded-xl font-semibold text-sm shadow-md shadow-[#8B4513]/20 disabled:opacity-50 transition cursor-pointer" >
                {submitting
                  ? "Submitting Custom Order..."
                  : orderType === "7_day_hold"
                  ? "Place 7-Day Hold Order"
                  : `Pay Advance (₹${advanceAmount}) & Confirm Slot`}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default CustomOrderWizard;
