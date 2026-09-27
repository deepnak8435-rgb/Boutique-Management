import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Scissors,
  Search,
  Sparkles,
  IndianRupee,
  CalendarDays,
  ShoppingBag,
  ArrowRight,
  Filter,
  Star,
  CheckCircle,
  AlertCircle,
  Truck,
  ShieldCheck,
  X,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export function Products() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Direct Order Modal state
  const [selectedProductForDirectOrder, setSelectedProductForDirectOrder] = useState(null);
  const [directOrderForm, setDirectOrderForm] = useState({
    quantity: 1,
    paymentMethod: "cod",
    address: "",
    phone: "",
  });
  const [ordering, setOrdering] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState("");

  const categories = [
    "All",
    "Sarees",
    "Lehengas",
    "Custom Gowns",
    "Blouse Designs",
    "Designer Suits",
    "Fabrics",
  ];

  const fetchProducts = async () => {
    setLoading(true);
    setError("");
    try {
      let url = `http://localhost:5000/api/products?category=${encodeURIComponent(
        selectedCategory
      )}`;
      if (searchQuery) {
        url += `&search=${encodeURIComponent(searchQuery)}`;
      }

      const res = await fetch(url);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load products");
      setProducts(data);
    } catch (err) {
      setError("Unable to connect to boutique database. Please check backend server.");
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/reviews");
      if (res.ok) {
        const data = await res.json();
        setReviews(data);
      }
    } catch (err) {
      console.error("Failed to fetch reviews:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchReviews();
  }, [selectedCategory, searchQuery]);

  const handleOpenDirectOrder = (product) => {
    if (!user) {
      navigate("/login");
      return;
    }
    setSelectedProductForDirectOrder(product);
    setDirectOrderForm({
      quantity: 1,
      paymentMethod: "cod",
      address: user.address || "",
      phone: user.phone || "",
    });
    setOrderSuccess("");
  };

  const handleConfirmDirectOrder = async (e) => {
    e.preventDefault();
    setOrdering(true);
    try {
      // Simulate direct product purchase confirmation
      setOrderSuccess(
        `Order Placed Successfully! Your order for "${selectedProductForDirectOrder.name}" (Qty: ${directOrderForm.quantity}) has been confirmed via ${directOrderForm.paymentMethod.toUpperCase()}.`
      );
      setTimeout(() => {
        setSelectedProductForDirectOrder(null);
        setOrderSuccess("");
      }, 2500);
    } catch (err) {
      alert("Failed to place order: " + err.message);
    } finally {
      setOrdering(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fffafc]">
      {/* Hero Header */}
      <section
        className="relative py-20 px-6 bg-cover bg-center text-white"
        style={{
          backgroundImage: `
            linear-gradient(rgba(50, 31, 43, 0.85), rgba(50, 31, 43, 0.7)),
            url("https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1800&q=80")
          `,
        }}
      >
        <div className="max-w-7xl mx-auto text-center max-w-3xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-500/20 border border-pink-300/30 text-pink-200 text-xs font-semibold uppercase tracking-widest mb-4">
            <Sparkles size={14} /> Dewani Couture Collection
          </div>
          <h1 className="font-serif text-5xl md:text-6xl font-bold leading-tight">
            Boutique Product Catalog
          </h1>
          <p className="mt-4 text-white/80 text-base md:text-lg leading-relaxed">
            Order ready-made boutique items directly or request custom tailor fitting sessions.
          </p>
        </div>
      </section>

      {/* Filter & Search Section */}
      <section className="py-8 px-6 border-b border-pink-100 bg-white sticky top-16 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-6">
          {/* Categories Tab */}
          <div className="flex items-center gap-2 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0 scrollbar-none">
            <Filter size={18} className="text-pink-600 shrink-0 mr-1 hidden sm:block" />
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition shrink-0 cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-pink-600 text-white shadow-md shadow-pink-200"
                    : "bg-pink-50/60 text-gray-700 hover:bg-pink-100"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="w-full lg:w-80 flex items-center gap-3 px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus-within:bg-white focus-within:border-pink-500 transition">
            <Search size={18} className="text-gray-400 shrink-0" />
            <input
              type="text"
              placeholder="Search designs or fabrics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-400"
            />
          </div>
        </div>
      </section>

      {/* Products Showcase */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
        {/* Loading state */}
        {loading && (
          <div className="py-20 text-center">
            <div className="w-12 h-12 border-4 border-pink-200 border-t-pink-600 rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-500 font-medium">Loading collection from MongoDB...</p>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 p-6 rounded-2xl text-center max-w-lg mx-auto">
            <p className="font-semibold">{error}</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && products.length === 0 && (
          <div className="bg-white rounded-3xl p-12 border border-gray-100 shadow-sm text-center max-w-2xl mx-auto">
            <ShoppingBag size={48} className="mx-auto text-pink-300 mb-4" />
            <h3 className="font-serif text-2xl font-bold text-[#321f2b]">No Products Found</h3>
            <p className="text-gray-500 mt-2 text-sm leading-relaxed">
              No products found in category "{selectedCategory}". Add new items from the Admin Control Panel!
            </p>
            <Link
              to="/admin"
              className="mt-6 inline-flex items-center gap-2 bg-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-pink-700 transition text-sm"
            >
              Open Admin Panel to Add Products <ArrowRight size={16} />
            </Link>
          </div>
        )}

        {/* Products Grid */}
        {!loading && !error && products.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((item) => (
              <div
                key={item._id}
                className="group bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Image Container */}
                  <div className="relative h-64 overflow-hidden bg-gray-100">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-[#321f2b] text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                      {item.category}
                    </div>

                    {item.fabric && (
                      <div className="absolute bottom-4 left-4 bg-[#321f2b]/80 backdrop-blur-md text-white text-xs px-3 py-1 rounded-full">
                        {item.fabric} Fabric
                      </div>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-6">
                    <h3 className="font-serif text-2xl font-bold text-[#321f2b] group-hover:text-pink-600 transition">
                      {item.name}
                    </h3>

                    <p className="text-gray-500 text-sm mt-2 line-clamp-2 leading-relaxed">
                      {item.description || "Handcrafted boutique creation with detailed fitting options."}
                    </p>

                    <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-400">Price</p>
                        <div className="flex items-center text-pink-600 font-bold text-2xl">
                          <IndianRupee size={20} />
                          <span>{item.price}</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-xs text-gray-400">Availability</p>
                        <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                          In Stock ({item.stock || 10})
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2 CHOICE ACTIONS: Direct Purchase vs Add Custom Fitting Service */}
                <div className="px-6 pb-6 pt-2 space-y-2.5">
                  <button
                    onClick={() => handleOpenDirectOrder(item)}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-xl transition flex items-center justify-center gap-2 text-sm shadow-md shadow-emerald-100 cursor-pointer"
                  >
                    <ShoppingBag size={16} /> Direct Order Product (No Fitting Needed)
                  </button>

                  <Link
                    to="/services"
                    state={{ product: item }}
                    className="w-full bg-pink-50 hover:bg-pink-100 text-pink-700 font-semibold py-2.5 rounded-xl transition flex items-center justify-center gap-2 text-xs border border-pink-200"
                  >
                    <Scissors size={14} /> Add Custom Tailoring & Fitting Slot <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Customer Reviews & Feedback Section */}
      <section className="py-16 px-6 bg-white border-t border-pink-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-pink-100 text-pink-700 text-xs font-bold uppercase tracking-wider mb-2">
              <Star size={14} className="fill-pink-600 text-pink-600" /> Customer Satisfaction & Feedback
            </div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#321f2b]">
              What Our Satisfied Clients Say
            </h2>
            <p className="text-gray-500 text-sm mt-2">
              Real reviews from customers who purchased boutique outfits or booked fitting sessions.
            </p>
          </div>

          {reviews.length === 0 ? (
            <div className="text-center py-10 text-gray-400 text-sm">
              No customer reviews submitted yet. Submit feedback after booking an appointment!
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {reviews.map((rev) => (
                <div key={rev._id} className="p-6 rounded-3xl bg-pink-50/40 border border-pink-100 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1 text-amber-400 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={i < rev.rating ? "fill-amber-400 text-amber-400" : "text-gray-300"}
                        />
                      ))}
                    </div>
                    <p className="text-gray-700 text-sm italic mb-4">"{rev.comment}"</p>
                  </div>

                  <div className="pt-3 border-t border-pink-100/80 flex items-center justify-between text-xs">
                    <span className="font-bold text-[#321f2b]">{rev.customer?.name || "Boutique Customer"}</span>
                    <span className="text-gray-400">{new Date(rev.createdAt).toLocaleDateString("en-IN")}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Direct Product Order Modal */}
      {selectedProductForDirectOrder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl relative border border-pink-100">
            <button
              onClick={() => setSelectedProductForDirectOrder(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-xl font-bold cursor-pointer"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-4 mb-6 border-b border-gray-100 pb-4">
              <img
                src={selectedProductForDirectOrder.image}
                alt={selectedProductForDirectOrder.name}
                className="w-16 h-16 rounded-2xl object-cover border border-gray-200"
              />
              <div>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                  Direct Product Order
                </span>
                <h3 className="font-serif text-xl font-bold text-[#321f2b] mt-1">
                  {selectedProductForDirectOrder.name}
                </h3>
                <p className="text-pink-600 font-bold text-base mt-0.5">
                  ₹{selectedProductForDirectOrder.price}
                </p>
              </div>
            </div>

            {orderSuccess ? (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-5 rounded-2xl text-center space-y-2">
                <CheckCircle size={36} className="mx-auto text-emerald-600" />
                <p className="font-semibold text-sm">{orderSuccess}</p>
              </div>
            ) : (
              <form onSubmit={handleConfirmDirectOrder} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">Quantity</label>
                  <input
                    type="number"
                    min={1}
                    max={selectedProductForDirectOrder.stock || 10}
                    value={directOrderForm.quantity}
                    onChange={(e) => setDirectOrderForm({ ...directOrderForm, quantity: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-pink-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">Delivery Address *</label>
                  <input
                    type="text"
                    required
                    placeholder="Street, City, Pincode"
                    value={directOrderForm.address}
                    onChange={(e) => setDirectOrderForm({ ...directOrderForm, address: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-pink-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">Payment Option</label>
                  <select
                    value={directOrderForm.paymentMethod}
                    onChange={(e) => setDirectOrderForm({ ...directOrderForm, paymentMethod: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-pink-500"
                  >
                    <option value="cod">Cash on Delivery (Pay at Delivery)</option>
                    <option value="upi">UPI / Google Pay</option>
                    <option value="card">Credit / Debit Card</option>
                  </select>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={ordering}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3.5 rounded-xl transition text-sm shadow-md shadow-emerald-200 cursor-pointer disabled:opacity-50"
                  >
                    {ordering ? "Processing Order..." : `Confirm Order for ₹${selectedProductForDirectOrder.price * directOrderForm.quantity}`}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Products;
