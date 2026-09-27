import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Scissors,
  CalendarDays,
  Clock,
  IndianRupee,
  Plus,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle,
  Users,
  Layers,
  ShoppingBag,
  RefreshCw,
  Sparkles,
  ShieldAlert,
  Tag,
  Image as ImageIcon,
  Check,
  Upload,
  PieChart,
  UserCheck,
  UserX,
  Ruler,
  Eye,
  Star,
} from "lucide-react";

export function AdminDashboard() {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("overview"); // overview | products | services | slots | bookings | users | reviews

  // Data states
  const [analytics, setAnalytics] = useState(null);
  const [products, setProducts] = useState([]);
  const [services, setServices] = useState([]);
  const [slots, setSlots] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [reviewsList, setReviewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [selectedMeasurementBooking, setSelectedMeasurementBooking] = useState(null);

  const [promoting, setPromoting] = useState(false);

  // Preset Boutique Image Samples
  const imagePresets = [
    {
      label: "Silk Saree",
      url: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80",
    },
    {
      label: "Bridal Lehenga",
      url: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=800&q=80",
    },
    {
      label: "Custom Gown",
      url: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=800&q=80",
    },
    {
      label: "Designer Blouse",
      url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80",
    },
    {
      label: "Boutique Fabric",
      url: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=800&q=80",
    },
  ];

  // Forms states
  const [productForm, setProductForm] = useState({
    name: "",
    category: "Sarees",
    price: "",
    fabric: "Silk",
    description: "",
    image: imagePresets[0].url,
    stock: 10,
  });
  const [productFile, setProductFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);

  const [serviceForm, setServiceForm] = useState({
    name: "",
    description: "",
    duration: 60,
    price: "",
  });

  const [slotForm, setSlotForm] = useState({
    service: "",
    date: "",
    startTime: "10:00 AM",
    endTime: "11:00 AM",
  });

  const [submittingProduct, setSubmittingProduct] = useState(false);
  const [submittingService, setSubmittingService] = useState(false);
  const [submittingSlot, setSubmittingSlot] = useState(false);

  const token = user?.token || localStorage.getItem("token");

  // Fetch all admin data & MongoDB Aggregation stats
  const fetchAllAdminData = async () => {
    setLoading(true);
    setError("");
    try {
      // 1. Fetch Admin Aggregation Dashboard Stats
      const statsRes = await fetch("http://localhost:5000/api/admin/stats", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setAnalytics(statsData);
      }

      // 2. Fetch Products
      const productsRes = await fetch("http://localhost:5000/api/products");
      if (productsRes.ok) setProducts(await productsRes.json());

      // 3. Fetch Services
      const servicesRes = await fetch("http://localhost:5000/api/services");
      if (servicesRes.ok) setServices(await servicesRes.json());

      // 4. Fetch Admin Slots
      const slotsRes = await fetch("http://localhost:5000/api/slots/admin/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (slotsRes.ok) setSlots(await slotsRes.json());

      // 5. Fetch Admin Bookings
      const bookingsRes = await fetch("http://localhost:5000/api/bookings/admin/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (bookingsRes.ok) setBookings(await bookingsRes.json());

      // 6. Fetch Users List
      const usersRes = await fetch("http://localhost:5000/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (usersRes.ok) setUsersList(await usersRes.json());

      // 7. Fetch Reviews List
      const reviewsRes = await fetch("http://localhost:5000/api/reviews");
      if (reviewsRes.ok) setReviewsList(await reviewsRes.json());
    } catch (err) {
      setError("Failed to load dashboard data. Ensure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Delete Review
  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("Are you sure you want to delete this customer feedback?")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/reviews/${reviewId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete review");

      setMessage("Customer feedback deleted!");
      fetchAllAdminData();
    } catch (err) {
      alert(err.message);
    }
  };

  useEffect(() => {
    if (user && user.role === "admin") {
      fetchAllAdminData();
    }
  }, [user]);

  // Handle Promote Account to Admin
  const handlePromoteToAdmin = async () => {
    setPromoting(true);
    setError("");
    try {
      const res = await fetch("http://localhost:5000/api/auth/make-admin", {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to switch role");

      login(data.user, data.token);
      setMessage("Success! Account updated to Admin.");
      fetchAllAdminData();
    } catch (err) {
      setError(err.message);
    } finally {
      setPromoting(false);
    }
  };

  // Handle Create Product with Multer multipart/form-data or Image URL
  const handleCreateProduct = async (e) => {
    e.preventDefault();
    setSubmittingProduct(true);
    setMessage("");
    setError("");

    try {
      let res;
      if (productFile) {
        // Upload image file via FormData (Multer)
        const formData = new FormData();
        formData.append("name", productForm.name);
        formData.append("category", productForm.category);
        formData.append("price", productForm.price);
        formData.append("fabric", productForm.fabric);
        formData.append("description", productForm.description);
        formData.append("stock", productForm.stock);
        formData.append("image", productFile);

        res = await fetch("http://localhost:5000/api/products", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
      } else {
        // Send JSON with Image URL
        res = await fetch("http://localhost:5000/api/products", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(productForm),
        });
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create product");

      setMessage(`Product "${productForm.name}" added to MongoDB!`);
      setProductForm({
        name: "",
        category: "Sarees",
        price: "",
        fabric: "Silk",
        description: "",
        image: imagePresets[0].url,
        stock: 10,
      });
      setProductFile(null);
      setFilePreview(null);
      fetchAllAdminData();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmittingProduct(false);
    }
  };

  // Handle Delete Product
  const handleDeleteProduct = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/products/${productId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete product");

      setMessage("Product deleted from MongoDB!");
      fetchAllAdminData();
    } catch (err) {
      alert(err.message);
    }
  };

  // Handle Create Service
  const handleCreateService = async (e) => {
    e.preventDefault();
    setSubmittingService(true);
    setMessage("");
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/services", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: serviceForm.name,
          description: serviceForm.description,
          duration: Number(serviceForm.duration),
          price: Number(serviceForm.price),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create service");

      setMessage("Service added successfully!");
      setServiceForm({ name: "", description: "", duration: 60, price: "" });
      fetchAllAdminData();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmittingService(false);
    }
  };

  // Handle Delete Service
  const handleDeleteService = async (serviceId) => {
    if (!window.confirm("Are you sure you want to delete this service?")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/services/${serviceId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete service");

      setMessage("Service deleted!");
      fetchAllAdminData();
    } catch (err) {
      alert(err.message);
    }
  };

  // Handle Create Slot
  const handleCreateSlot = async (e) => {
    e.preventDefault();
    setSubmittingSlot(true);
    setMessage("");
    setError("");

    if (!slotForm.service) {
      setError("Please select a service for the slot.");
      setSubmittingSlot(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/slots", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          service: slotForm.service,
          date: slotForm.date,
          startTime: slotForm.startTime,
          endTime: slotForm.endTime,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create slot");

      setMessage("Slot created successfully!");
      setSlotForm({ ...slotForm, date: "" });
      fetchAllAdminData();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmittingSlot(false);
    }
  };

  // Handle Delete Slot
  const handleDeleteSlot = async (slotId) => {
    if (!window.confirm("Delete this appointment slot?")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/slots/${slotId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete slot");

      setMessage("Slot removed!");
      fetchAllAdminData();
    } catch (err) {
      alert(err.message);
    }
  };

  // Handle Update Booking Status
  const handleUpdateBookingStatus = async (bookingId, status) => {
    try {
      const res = await fetch(`http://localhost:5000/api/bookings/admin/${bookingId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update status");

      setMessage(`Booking marked as ${status}`);
      fetchAllAdminData();
    } catch (err) {
      alert(err.message);
    }
  };

  // Handle Update Garment Tailoring Status
  const handleUpdateGarmentStatus = async (bookingId, garmentStatus) => {
    try {
      const res = await fetch(`http://localhost:5000/api/bookings/admin/${bookingId}/garment-status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ garmentStatus }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update garment status");

      setMessage(`Garment progress updated to: ${garmentStatus}`);
      fetchAllAdminData();
    } catch (err) {
      alert(err.message);
    }
  };

  // Handle Update User Role
  const handleUpdateUserRole = async (targetUserId, role) => {
    try {
      const res = await fetch(`http://localhost:5000/api/admin/users/${targetUserId}/role`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update user role");

      setMessage(`User role updated to ${role}`);
      fetchAllAdminData();
    } catch (err) {
      alert(err.message);
    }
  };

  // Handle Delete User
  const handleDeleteUser = async (targetUserId) => {
    if (!window.confirm("Are you sure you want to delete this user account?")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/admin/users/${targetUserId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete user");

      setMessage("User account deleted!");
      fetchAllAdminData();
    } catch (err) {
      alert(err.message);
    }
  };

  const totalRevenue = analytics?.totalRevenue || 0;
  const pendingBookings = analytics?.pendingBookings || 0;
  const confirmedBookings = analytics?.confirmedBookings || 0;

  // Non-Admin Banner
  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen bg-[#fffafc] py-20 px-6 flex items-center justify-center">
        <div className="bg-white rounded-3xl p-8 md:p-12 border border-pink-100 shadow-xl max-w-xl text-center">
          <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-6">
            <ShieldAlert size={36} />
          </div>

          <h2 className="font-serif text-3xl font-bold text-[#321f2b]">Admin Access Required</h2>
          <p className="text-gray-500 text-sm mt-3 leading-relaxed">
            You are currently logged in as <strong className="text-pink-600">{user?.name || "Guest"}</strong> with role{" "}
            <span className="bg-pink-100 text-pink-700 px-2 py-0.5 rounded-full font-bold text-xs">
              {user?.role || "Customer"}
            </span>.
          </p>

          <p className="text-gray-600 text-xs mt-2 bg-pink-50 p-3 rounded-xl border border-pink-100">
            Click the button below to update your account role to <strong>Admin</strong> in MongoDB so you can manage products, file uploads, services, and appointment analytics!
          </p>

          {error && <p className="mt-4 text-xs font-bold text-rose-600">{error}</p>}

          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <button
              onClick={handlePromoteToAdmin}
              disabled={promoting}
              className="flex-1 bg-pink-600 hover:bg-pink-700 text-white font-semibold py-3 px-6 rounded-xl transition shadow-md shadow-pink-200 text-sm disabled:opacity-50"
            >
              {promoting ? "Updating Role..." : "Promote My Account to Admin"}
            </button>

            <button
              onClick={() => navigate("/login")}
              className="px-6 py-3 border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 text-sm"
            >
              Login as Admin
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcf8fa] py-8 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#321f2b] to-[#542943] text-white rounded-3xl p-8 shadow-xl mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-2 text-pink-300 font-semibold text-xs uppercase tracking-widest mb-2">
              <Sparkles size={16} /> Dewani Boutique Enterprise Admin
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold">Admin Control Center</h1>
            <p className="text-pink-100/80 text-sm mt-1">
              Manage products, local image uploads, fitting services, appointment slots, customer orders, and users.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchAllAdminData}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition backdrop-blur-md"
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} /> Refresh Analytics
            </button>
          </div>
        </div>

        {/* Alerts */}
        {message && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-5 py-3 rounded-2xl mb-6 flex items-center justify-between text-sm font-semibold">
            <span>{message}</span>
            <button onClick={() => setMessage("")} className="text-emerald-500 hover:text-emerald-700">
              &times;
            </button>
          </div>
        )}

        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 px-5 py-3 rounded-2xl mb-6 flex items-center justify-between text-sm font-semibold">
            <span>{error}</span>
            <button onClick={() => setError("")} className="text-rose-500 hover:text-rose-700">
              &times;
            </button>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-pink-100 pb-4 mb-8">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition flex items-center gap-2 ${
              activeTab === "overview"
                ? "bg-pink-600 text-white shadow-md shadow-pink-200"
                : "bg-white text-gray-700 hover:bg-pink-50 border border-gray-100"
            }`}
          >
            <PieChart size={18} /> Analytics & Stats
          </button>

          <button
            onClick={() => setActiveTab("products")}
            className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition flex items-center gap-2 ${
              activeTab === "products"
                ? "bg-pink-600 text-white shadow-md shadow-pink-200"
                : "bg-white text-gray-700 hover:bg-pink-50 border border-gray-100"
            }`}
          >
            <ShoppingBag size={18} /> Manage Products ({products.length})
          </button>

          <button
            onClick={() => setActiveTab("services")}
            className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition flex items-center gap-2 ${
              activeTab === "services"
                ? "bg-pink-600 text-white shadow-md shadow-pink-200"
                : "bg-white text-gray-700 hover:bg-pink-50 border border-gray-100"
            }`}
          >
            <Scissors size={18} /> Manage Services ({services.length})
          </button>

          <button
            onClick={() => setActiveTab("slots")}
            className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition flex items-center gap-2 ${
              activeTab === "slots"
                ? "bg-pink-600 text-white shadow-md shadow-pink-200"
                : "bg-white text-gray-700 hover:bg-pink-50 border border-gray-100"
            }`}
          >
            <Clock size={18} /> Schedule Slots ({slots.length})
          </button>

          <button
            onClick={() => setActiveTab("bookings")}
            className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition flex items-center gap-2 ${
              activeTab === "bookings"
                ? "bg-pink-600 text-white shadow-md shadow-pink-200"
                : "bg-white text-gray-700 hover:bg-pink-50 border border-gray-100"
            }`}
          >
            <CalendarDays size={18} /> Customer Orders ({bookings.length})
            {pendingBookings > 0 && (
              <span className="bg-amber-400 text-amber-950 text-xs px-2 py-0.5 rounded-full font-bold">
                {pendingBookings}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("users")}
            className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition flex items-center gap-2 ${
              activeTab === "users"
                ? "bg-pink-600 text-white shadow-md shadow-pink-200"
                : "bg-white text-gray-700 hover:bg-pink-50 border border-gray-100"
            }`}
          >
            <Users size={18} /> User Accounts ({usersList.length})
          </button>

          <button
            onClick={() => setActiveTab("reviews")}
            className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition flex items-center gap-2 ${
              activeTab === "reviews"
                ? "bg-pink-600 text-white shadow-md shadow-pink-200"
                : "bg-white text-gray-700 hover:bg-pink-50 border border-gray-100"
            }`}
          >
            <Star size={18} /> Customer Feedback ({reviewsList.length})
          </button>
        </div>

        {/* TAB 1: OVERVIEW & MONGO AGGREGATION ANALYTICS */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Stat Cards Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-3xl border border-pink-100 shadow-sm flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                  <ShoppingBag size={26} />
                </div>
                <div>
                  <p className="text-gray-400 text-xs font-semibold uppercase">Total Products</p>
                  <h3 className="text-3xl font-bold text-[#321f2b] mt-1">{analytics?.totalProducts || products.length}</h3>
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-pink-100 shadow-sm flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-pink-50 flex items-center justify-center text-pink-600 shrink-0">
                  <Scissors size={26} />
                </div>
                <div>
                  <p className="text-gray-400 text-xs font-semibold uppercase">Total Services</p>
                  <h3 className="text-3xl font-bold text-[#321f2b] mt-1">{analytics?.totalServices || services.length}</h3>
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-pink-100 shadow-sm flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
                  <Users size={26} />
                </div>
                <div>
                  <p className="text-gray-400 text-xs font-semibold uppercase">Pending Orders</p>
                  <h3 className="text-3xl font-bold text-[#321f2b] mt-1">{pendingBookings}</h3>
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-pink-100 shadow-sm flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                  <IndianRupee size={26} />
                </div>
                <div>
                  <p className="text-gray-400 text-xs font-semibold uppercase">Confirmed Revenue</p>
                  <h3 className="text-3xl font-bold text-[#321f2b] mt-1">₹{totalRevenue}</h3>
                </div>
              </div>
            </div>

            {/* MongoDB Aggregation Pipeline Analytics Breakdown */}
            {analytics?.analytics?.productCategoryStats && (
              <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                <h3 className="font-serif text-xl font-bold text-[#321f2b] mb-4 flex items-center gap-2">
                  <PieChart size={20} className="text-pink-600" /> MongoDB Aggregation Analytics (Category Breakdown)
                </h3>
                <div className="grid sm:grid-cols-3 gap-4">
                  {analytics.analytics.productCategoryStats.map((item) => (
                    <div key={item._id} className="p-4 rounded-2xl bg-pink-50/50 border border-pink-100">
                      <p className="text-xs text-gray-500 uppercase font-bold">{item._id}</p>
                      <h4 className="text-2xl font-bold text-pink-700 mt-1">{item.count} items</h4>
                      <p className="text-xs text-gray-600 mt-1">Avg Price: ₹{Math.round(item.avgPrice || 0)}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Customer Orders */}
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-serif text-xl font-bold text-[#321f2b]">Recent Customer Bookings</h3>
                <button onClick={() => setActiveTab("bookings")} className="text-pink-600 text-xs font-bold hover:underline">
                  View All
                </button>
              </div>

              {bookings.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-8">No appointment orders yet.</p>
              ) : (
                <div className="space-y-4">
                  {bookings.slice(0, 5).map((b) => (
                    <div key={b._id} className="flex items-center justify-between p-4 rounded-2xl bg-gray-50/70 border border-gray-100">
                      <div>
                        <p className="font-bold text-[#321f2b] text-sm">{b.customer?.name || "Customer"}</p>
                        <p className="text-xs text-gray-500">{b.slot?.service?.name || "Service"}</p>
                      </div>
                      <div className="text-right">
                        <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
                          b.status === "confirmed" ? "bg-emerald-100 text-emerald-800" : b.status === "cancelled" ? "bg-rose-100 text-rose-800" : "bg-amber-100 text-amber-800"
                        }`}>
                          {b.status}
                        </span>
                        <p className="text-xs font-semibold text-gray-700 mt-1">₹{b.slot?.service?.price || 0}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: PRODUCT MANAGEMENT & MULTER FILE UPLOAD */}
        {activeTab === "products" && (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Create Product Form */}
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm h-fit">
              <h3 className="font-serif text-xl font-bold text-[#321f2b] mb-4 flex items-center gap-2">
                <Plus size={20} className="text-pink-600" /> Add Product (URL or File Upload)
              </h3>

              <form onSubmit={handleCreateProduct} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Royal Silk Zari Saree"
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-pink-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">
                      Category *
                    </label>
                    <select
                      value={productForm.category}
                      onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-pink-500"
                    >
                      <option value="Sarees">Sarees</option>
                      <option value="Lehengas">Lehengas</option>
                      <option value="Custom Gowns">Custom Gowns</option>
                      <option value="Blouse Designs">Blouse Designs</option>
                      <option value="Designer Suits">Designer Suits</option>
                      <option value="Fabrics">Fabrics</option>
                      <option value="Accessories">Accessories</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">
                      Price (₹) *
                    </label>
                    <input
                      type="number"
                      required
                      min={0}
                      placeholder="e.g. 8500"
                      value={productForm.price}
                      onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-pink-500"
                    />
                  </div>
                </div>

                {/* File Upload vs Image URL option */}
                <div className="p-4 rounded-2xl bg-pink-50/50 border border-pink-100 space-y-3">
                  <label className="block text-xs font-bold text-gray-700 uppercase flex items-center gap-1.5">
                    <Upload size={14} className="text-pink-600" /> Upload Photo File from Device (Multer)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setProductFile(file);
                        setFilePreview(URL.createObjectURL(file));
                        setProductForm({ ...productForm, image: "" });
                      } else {
                        setProductFile(null);
                        setFilePreview(null);
                      }
                    }}
                    className="w-full text-xs text-gray-600 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-pink-600 file:text-white hover:file:bg-pink-700"
                  />

                  {/* Live File Image Preview */}
                  {filePreview && (
                    <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-pink-200">
                      <img src={filePreview} alt="Gallery Preview" className="w-14 h-14 object-cover rounded-lg border" />
                      <div>
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                          Gallery Image Ready
                        </span>
                        <p className="text-xs text-gray-700 font-semibold mt-1 truncate max-w-[180px]">
                          {productFile?.name}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="text-center text-xs text-gray-400 font-semibold my-1">— OR PICK SAMPLE BOUTIQUE PRESET —</div>

                  <div className="flex flex-wrap gap-1.5">
                    {imagePresets.map((preset) => (
                      <button
                        type="button"
                        key={preset.label}
                        onClick={() => {
                          setProductForm({ ...productForm, image: preset.url });
                          setProductFile(null);
                          setFilePreview(null);
                        }}
                        className={`text-[11px] px-2 py-1 rounded-lg border font-semibold flex items-center gap-1 transition ${
                          productForm.image === preset.url && !productFile
                            ? "bg-pink-600 text-white border-pink-600"
                            : "bg-white text-gray-700 border-gray-200"
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">
                    Description
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Embroidery details, weaving info, care instructions..."
                    value={productForm.description}
                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-pink-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submittingProduct}
                  className="w-full bg-pink-600 hover:bg-pink-700 text-white font-semibold py-3 rounded-xl transition text-sm shadow-md shadow-pink-200 disabled:opacity-50"
                >
                  {submittingProduct ? "Saving to Database..." : "Add Product to MongoDB"}
                </button>
              </form>
            </div>

            {/* Products List */}
            <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
              <h3 className="font-serif text-xl font-bold text-[#321f2b] mb-6">
                Active Catalog Products ({products.length})
              </h3>

              {products.length === 0 ? (
                <div className="text-center py-12 text-gray-400">No products in MongoDB yet.</div>
              ) : (
                <div className="space-y-4">
                  {products.map((p) => (
                    <div key={p._id} className="p-4 rounded-2xl border border-gray-100 bg-gray-50/50 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <img src={p.image} alt={p.name} className="w-16 h-16 rounded-xl object-cover border border-gray-200 shrink-0" />
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-[#321f2b] text-base">{p.name}</h4>
                            <span className="bg-pink-100 text-pink-700 text-xs px-2.5 py-0.5 rounded-full font-semibold">{p.category}</span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">Fabric: {p.fabric || "N/A"} | Stock: {p.stock || 10}</p>
                          <p className="text-pink-600 font-bold text-sm mt-1">₹{p.price}</p>
                        </div>
                      </div>

                      <button onClick={() => handleDeleteProduct(p._id)} className="px-3.5 py-2 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-xl text-xs font-bold transition flex items-center gap-1 shrink-0">
                        <Trash2 size={16} /> Delete
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: SERVICES MANAGEMENT */}
        {activeTab === "services" && (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm h-fit">
              <h3 className="font-serif text-xl font-bold text-[#321f2b] mb-4 flex items-center gap-2">
                <Plus size={20} className="text-pink-600" /> Add New Service
              </h3>

              <form onSubmit={handleCreateService} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">Service Name *</label>
                  <input type="text" required placeholder="e.g. Bridal Blouse Stitching" value={serviceForm.name} onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-pink-500" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">Description</label>
                  <textarea rows={3} placeholder="Describe custom embroidery, lining details, etc." value={serviceForm.description} onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-pink-500" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">Duration (mins) *</label>
                    <input type="number" required min={15} value={serviceForm.duration} onChange={(e) => setServiceForm({ ...serviceForm, duration: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-pink-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">Price (₹) *</label>
                    <input type="number" required min={0} placeholder="e.g. 1500" value={serviceForm.price} onChange={(e) => setServiceForm({ ...serviceForm, price: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-pink-500" />
                  </div>
                </div>
                <button type="submit" disabled={submittingService} className="w-full bg-pink-600 hover:bg-pink-700 text-white font-semibold py-3 rounded-xl transition text-sm shadow-md shadow-pink-200 disabled:opacity-50">
                  {submittingService ? "Saving..." : "Save Service to Database"}
                </button>
              </form>
            </div>

            <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
              <h3 className="font-serif text-xl font-bold text-[#321f2b] mb-6">Active Boutique Services ({services.length})</h3>
              {services.map((svc) => (
                <div key={svc._id} className="p-5 rounded-2xl border border-gray-100 bg-gray-50/50 flex justify-between items-center gap-4 mb-3">
                  <div>
                    <h4 className="font-bold text-[#321f2b] text-lg">{svc.name} ({svc.duration} mins)</h4>
                    <p className="text-gray-500 text-sm mt-1">{svc.description}</p>
                    <p className="text-pink-600 font-bold text-lg mt-1">₹{svc.price}</p>
                  </div>
                  <button onClick={() => handleDeleteService(svc._id)} className="px-3.5 py-2 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-xl text-xs font-bold transition flex items-center gap-1 shrink-0">
                    <Trash2 size={16} /> Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: SLOTS SCHEDULE MANAGEMENT */}
        {activeTab === "slots" && (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm h-fit">
              <h3 className="font-serif text-xl font-bold text-[#321f2b] mb-4 flex items-center gap-2">
                <Plus size={20} className="text-pink-600" /> Create Appointment Slot
              </h3>

              <form onSubmit={handleCreateSlot} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">Select Service *</label>
                  <select required value={slotForm.service} onChange={(e) => setSlotForm({ ...slotForm, service: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-pink-500">
                    <option value="">-- Choose Service --</option>
                    {services.map((s) => (
                      <option key={s._id} value={s._id}>{s.name} (₹{s.price})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">Appointment Date *</label>
                  <input type="date" required value={slotForm.date} onChange={(e) => setSlotForm({ ...slotForm, date: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-pink-500" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">Start Time *</label>
                    <input type="text" required placeholder="e.g. 10:00 AM" value={slotForm.startTime} onChange={(e) => setSlotForm({ ...slotForm, startTime: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-pink-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">End Time *</label>
                    <input type="text" required placeholder="e.g. 11:00 AM" value={slotForm.endTime} onChange={(e) => setSlotForm({ ...slotForm, endTime: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-pink-500" />
                  </div>
                </div>
                <button type="submit" disabled={submittingSlot} className="w-full bg-pink-600 hover:bg-pink-700 text-white font-semibold py-3 rounded-xl transition text-sm shadow-md shadow-pink-200 disabled:opacity-50">
                  {submittingSlot ? "Creating Slot..." : "Add Slot to Database"}
                </button>
              </form>
            </div>

            <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
              <h3 className="font-serif text-xl font-bold text-[#321f2b] mb-6">Scheduled Slots ({slots.length})</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {slots.map((s) => (
                  <div key={s._id} className="p-4 rounded-2xl border border-gray-100 bg-gray-50/50">
                    <div className="flex justify-between items-center mb-2">
                      <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${s.isBooked ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"}`}>
                        {s.isBooked ? "Booked" : "Available"}
                      </span>
                      <button onClick={() => handleDeleteSlot(s._id)} className="text-rose-500 hover:text-rose-700 text-xs font-bold">Delete</button>
                    </div>
                    <h4 className="font-bold text-[#321f2b]">{s.service?.name || "Service"}</h4>
                    <p className="text-xs text-gray-500 mt-1">{new Date(s.date).toLocaleDateString("en-IN")} | {s.startTime} - {s.endTime}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: CUSTOMER BOOKING ORDERS */}
        {activeTab === "bookings" && (
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-6">
            <h3 className="font-serif text-xl font-bold text-[#321f2b]">Customer Appointment Orders ({bookings.length})</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 text-xs uppercase text-gray-400 font-bold">
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Service</th>
                    <th className="py-3 px-4">Slot Date & Time</th>
                    <th className="py-3 px-4">Price</th>
                    <th className="py-3 px-4">Appointment</th>
                    <th className="py-3 px-4">Payment Method</th>
                    <th className="py-3 px-4">Live Garment Progress</th>
                    <th className="py-3 px-4">Measurements</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {bookings.map((b) => {
                    const m = b.measurements || b.customer?.measurements || {};
                    const hasMeasurements = m.bust || m.waist || m.hips || m.shoulder;
                    const pm = b.paymentMethod || "cod";

                    return (
                      <tr key={b._id} className="hover:bg-pink-50/30 transition">
                        <td className="py-4 px-4">
                          <p className="font-bold text-[#321f2b]">{b.customer?.name || "Customer"}</p>
                          <p className="text-xs text-gray-400">{b.customer?.email}</p>
                          {b.customer?.phone && (
                            <p className="text-xs text-pink-600 font-medium">{b.customer.phone}</p>
                          )}
                        </td>
                        <td className="py-4 px-4 font-semibold text-gray-700">{b.slot?.service?.name || "Service N/A"}</td>
                        <td className="py-4 px-4 text-xs text-gray-600">
                          <p className="font-semibold">{b.slot?.date ? new Date(b.slot.date).toLocaleDateString("en-IN") : "N/A"}</p>
                          <p className="text-gray-400">{b.slot?.startTime} - {b.slot?.endTime}</p>
                        </td>
                        <td className="py-4 px-4 font-bold text-pink-600">₹{b.slot?.service?.price || 0}</td>
                        <td className="py-4 px-4">
                          <span className={`inline-block text-xs px-3 py-1 rounded-full font-bold ${b.status === "confirmed" ? "bg-emerald-100 text-emerald-800" : b.status === "cancelled" ? "bg-rose-100 text-rose-800" : "bg-amber-100 text-amber-800"}`}>
                            {b.status}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`inline-block text-[11px] px-2.5 py-0.5 rounded-full font-bold uppercase ${
                            pm === "upi" ? "bg-indigo-100 text-indigo-800" : pm === "card" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                          }`}>
                            {pm === "upi" ? "UPI / GPay" : pm === "card" ? "Card Online" : "Cash / COD"}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <select
                            value={b.garmentStatus || "pending"}
                            onChange={(e) => handleUpdateGarmentStatus(b._id, e.target.value)}
                            className="text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-pink-200 bg-pink-50/50 text-pink-800 focus:outline-none focus:ring-2 focus:ring-pink-500 cursor-pointer"
                          >
                            <option value="pending">1. Requested</option>
                            <option value="approved">2. Pattern Approved</option>
                            <option value="stitching">3. In Stitching</option>
                            <option value="ready_for_trial">4. Ready for Trial</option>
                            <option value="completed">5. Order Completed</option>
                          </select>
                        </td>
                        <td className="py-4 px-4">
                          <button
                            onClick={() => setSelectedMeasurementBooking(b)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                              hasMeasurements
                                ? "bg-pink-100 text-pink-700 hover:bg-pink-200"
                                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                            }`}
                          >
                            <Ruler size={14} />
                            {hasMeasurements ? "View Specs" : "No Specs"}
                          </button>
                        </td>
                        <td className="py-4 px-4 text-right space-x-2">
                          {b.status !== "confirmed" && (
                            <button onClick={() => handleUpdateBookingStatus(b._id, "confirmed")} className="px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg text-xs font-semibold">Confirm</button>
                          )}
                          {b.status !== "cancelled" && (
                            <button onClick={() => handleUpdateBookingStatus(b._id, "cancelled")} className="px-3 py-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-lg text-xs font-semibold">Cancel</button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Body Measurements Modal */}
            {selectedMeasurementBooking && (
              <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl relative border border-pink-100">
                  <button
                    onClick={() => setSelectedMeasurementBooking(null)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-xl font-bold"
                  >
                    &times;
                  </button>

                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2.5 bg-pink-100 text-pink-600 rounded-xl">
                      <Ruler size={24} />
                    </div>
                    <div>
                      <h4 className="font-serif text-xl font-bold text-[#321f2b]">Customer Fitting Specs</h4>
                      <p className="text-xs text-gray-500">
                        {selectedMeasurementBooking.customer?.name} ({selectedMeasurementBooking.customer?.email})
                      </p>
                    </div>
                  </div>

                  {(() => {
                    const m =
                      selectedMeasurementBooking.measurements ||
                      selectedMeasurementBooking.customer?.measurements ||
                      {};
                    return (
                      <div className="space-y-4 text-sm text-gray-700">
                        <div className="grid grid-cols-2 gap-3 p-4 bg-pink-50/50 rounded-2xl border border-pink-100">
                          <div><span className="text-xs text-gray-400 font-bold block uppercase">Bust/Chest:</span> <strong className="text-pink-700">{m.bust || "N/A"} in</strong></div>
                          <div><span className="text-xs text-gray-400 font-bold block uppercase">Waist:</span> <strong className="text-pink-700">{m.waist || "N/A"} in</strong></div>
                          <div><span className="text-xs text-gray-400 font-bold block uppercase">Hips:</span> <strong className="text-pink-700">{m.hips || "N/A"} in</strong></div>
                          <div><span className="text-xs text-gray-400 font-bold block uppercase">Shoulder Width:</span> <strong className="text-pink-700">{m.shoulder || "N/A"} in</strong></div>
                          <div><span className="text-xs text-gray-400 font-bold block uppercase">Sleeve Length:</span> <strong className="text-pink-700">{m.sleeveLength || "N/A"} in</strong></div>
                          <div><span className="text-xs text-gray-400 font-bold block uppercase">Garment Length:</span> <strong className="text-pink-700">{m.garmentLength || "N/A"} in</strong></div>
                        </div>

                        {m.notes && (
                          <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                            <span className="text-xs text-gray-400 font-bold uppercase block mb-1">Styling Notes:</span>
                            <p className="text-xs text-gray-600 italic">"{m.notes}"</p>
                          </div>
                        )}
                      </div>
                    );
                  })()}

                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={() => setSelectedMeasurementBooking(null)}
                      className="px-5 py-2.5 bg-pink-600 text-white rounded-xl text-xs font-semibold hover:bg-pink-700 transition"
                    >
                      Close Specs
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 6: USER ACCOUNTS MANAGEMENT */}
        {activeTab === "users" && (
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
            <h3 className="font-serif text-xl font-bold text-[#321f2b] mb-6">User Accounts & Roles ({usersList.length})</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 text-xs uppercase text-gray-400 font-bold">
                    <th className="py-3 px-4">User Name</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {usersList.map((u) => (
                    <tr key={u._id} className="hover:bg-pink-50/30 transition">
                      <td className="py-4 px-4 font-bold text-[#321f2b]">{u.name}</td>
                      <td className="py-4 px-4 text-gray-600">{u.email}</td>
                      <td className="py-4 px-4">
                        <span className={`inline-block text-xs px-3 py-1 rounded-full font-bold ${u.role === "admin" ? "bg-purple-100 text-purple-800" : "bg-gray-100 text-gray-700"}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right space-x-2">
                        {u.role === "customer" ? (
                          <button onClick={() => handleUpdateUserRole(u._id, "admin")} className="px-3 py-1.5 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-lg text-xs font-semibold">Promote to Admin</button>
                        ) : (
                          <button onClick={() => handleUpdateUserRole(u._id, "customer")} className="px-3 py-1.5 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg text-xs font-semibold">Demote to Customer</button>
                        )}
                        <button onClick={() => handleDeleteUser(u._id)} className="px-3 py-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-lg text-xs font-semibold">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 7: CUSTOMER REVIEWS & FEEDBACK MANAGEMENT */}
        {activeTab === "reviews" && (
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
            <h3 className="font-serif text-xl font-bold text-[#321f2b] mb-6">Customer Ratings & Feedback ({reviewsList.length})</h3>
            {reviewsList.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-12">No customer reviews or feedback submitted yet.</p>
            ) : (
              <div className="space-y-4">
                {reviewsList.map((rev) => (
                  <div key={rev._id} className="p-5 rounded-2xl border border-gray-100 bg-gray-50/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-[#321f2b] text-base">{rev.customer?.name || "Customer"}</span>
                        <span className="text-xs text-gray-400">{rev.customer?.email}</span>
                        <span className="text-xs text-gray-400">| {new Date(rev.createdAt).toLocaleDateString("en-IN")}</span>
                      </div>

                      <div className="flex items-center gap-1 text-amber-400 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            className={i < rev.rating ? "fill-amber-400 text-amber-400" : "text-gray-300"}
                          />
                        ))}
                        <span className="text-xs font-bold text-gray-700 ml-1">({rev.rating}/5)</span>
                      </div>

                      <p className="text-gray-600 text-sm mt-2 italic">"{rev.comment}"</p>
                      {rev.productName && (
                        <span className="inline-block mt-2 text-[10px] font-bold px-2 py-0.5 bg-pink-100 text-pink-700 rounded-full">
                          Service/Product: {rev.productName}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => handleDeleteReview(rev._id)}
                      className="px-3.5 py-2 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-xl text-xs font-bold transition flex items-center gap-1 shrink-0"
                    >
                      <Trash2 size={16} /> Delete Feedback
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
