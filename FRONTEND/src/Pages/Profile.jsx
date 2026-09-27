import { useState, useEffect } from "react";
import { User, Phone, MapPin, Ruler, Save, CheckCircle, AlertCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";

function Profile() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    measurements: {
      bust: "",
      waist: "",
      hips: "",
      shoulder: "",
      sleeveLength: "",
      garmentLength: "",
      notes: "",
    },
  });

  const token = user?.token || localStorage.getItem("token");

  useEffect(() => {
    fetchProfile();
  }, [token]);

  const fetchProfile = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/users/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch profile");

      setProfile({
        name: data.name || "",
        email: data.email || "",
        phone: data.phone || "",
        address: data.address || "",
        measurements: {
          bust: data.measurements?.bust || "",
          waist: data.measurements?.waist || "",
          hips: data.measurements?.hips || "",
          shoulder: data.measurements?.shoulder || "",
          sleeveLength: data.measurements?.sleeveLength || "",
          garmentLength: data.measurements?.garmentLength || "",
          notes: data.measurements?.notes || "",
        },
      });
    } catch (err) {
      console.error("Failed to load profile:", err);
      setMessage({ type: "error", text: err.message || "Failed to load profile information" });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("m_")) {
      const field = name.replace("m_", "");
      setProfile((prev) => ({
        ...prev,
        measurements: {
          ...prev.measurements,
          [field]: value,
        },
      }));
    } else {
      setProfile((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await fetch("http://localhost:5000/api/users/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          phone: profile.phone,
          address: profile.address,
          measurements: profile.measurements,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update profile");

      setMessage({ type: "success", text: "Profile & body measurements updated successfully!" });
    } catch (err) {
      console.error("Failed to save profile:", err);
      setMessage({ type: "error", text: err.message || "Failed to update profile" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-6 text-center text-gray-500">
        <div className="animate-spin w-8 h-8 border-4 border-pink-600 border-t-transparent rounded-full mx-auto mb-4"></div>
        Loading profile details...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-pink-100 text-pink-600 rounded-xl">
          <User size={28} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Customer Measurement Profile</h1>
          <p className="text-gray-500 text-sm">
            Save your measurements once and use them for seamless custom tailoring & stitching orders.
          </p>
        </div>
      </div>

      {message.text && (
        <div
          className={`p-4 rounded-xl mb-6 flex items-center gap-3 ${
            message.type === "success"
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {message.type === "success" ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
          <span>{message.text}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Personal Details Section */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <User className="text-pink-600" size={20} />
            Personal & Contact Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                value={profile.name}
                disabled
                className="w-full px-4 py-2.5 bg-gray-100 text-gray-600 border border-gray-200 rounded-lg cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                value={profile.email}
                disabled
                className="w-full px-4 py-2.5 bg-gray-100 text-gray-600 border border-gray-200 rounded-lg cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                <Phone size={16} className="text-gray-400" /> Phone Number
              </label>
              <input
                type="text"
                name="phone"
                value={profile.phone}
                onChange={handleChange}
                placeholder="+91 98765 43210"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                <MapPin size={16} className="text-gray-400" /> Delivery / Fitting Address
              </label>
              <input
                type="text"
                name="address"
                value={profile.address}
                onChange={handleChange}
                placeholder="Street name, City, Pincode"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition"
              />
            </div>
          </div>
        </div>

        {/* Custom Measurements Section */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-2 flex items-center gap-2">
            <Ruler className="text-pink-600" size={20} />
            Body Measurement Specifications (inches)
          </h2>
          <p className="text-xs text-gray-500 mb-6">
            These measurements will automatically attach to your appointment bookings for custom designer stitching.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bust / Chest (in)</label>
              <input
                type="text"
                name="m_bust"
                value={profile.measurements.bust}
                onChange={handleChange}
                placeholder="e.g. 36"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Waist (in)</label>
              <input
                type="text"
                name="m_waist"
                value={profile.measurements.waist}
                onChange={handleChange}
                placeholder="e.g. 30"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hips (in)</label>
              <input
                type="text"
                name="m_hips"
                value={profile.measurements.hips}
                onChange={handleChange}
                placeholder="e.g. 38"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Shoulder Width (in)</label>
              <input
                type="text"
                name="m_shoulder"
                value={profile.measurements.shoulder}
                onChange={handleChange}
                placeholder="e.g. 14.5"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sleeve Length (in)</label>
              <input
                type="text"
                name="m_sleeveLength"
                value={profile.measurements.sleeveLength}
                onChange={handleChange}
                placeholder="e.g. 18"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Garment Length (in)</label>
              <input
                type="text"
                name="m_garmentLength"
                value={profile.measurements.garmentLength}
                onChange={handleChange}
                placeholder="e.g. 42"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition"
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Custom Styling Notes / Preferences
            </label>
            <textarea
              name="m_notes"
              rows={3}
              value={profile.measurements.notes}
              onChange={handleChange}
              placeholder="e.g. Prefer deep V-neckline, additional inner lining, padded blouse..."
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition"
            />
          </div>
        </div>

        {/* Submit button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-8 py-3 bg-pink-600 hover:bg-pink-700 text-white font-semibold rounded-xl shadow-md transition duration-200 disabled:opacity-50 cursor-pointer"
          >
            <Save size={18} />
            {saving ? "Saving Profile..." : "Save Profile & Measurements"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Profile;
