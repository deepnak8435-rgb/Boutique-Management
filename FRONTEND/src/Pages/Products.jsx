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
    <div className="min-h-screen bg-[#FAF6F0] text-[#38220F]">
      {/* Hero Header */}
      <section
        className="relative py-20 px-6 bg-cover bg-center text-white"
        style={{
          backgroundImage: `
            linear-gradient(rgba(42, 24, 16, 0.88), rgba(42, 24, 16, 0.75)),
            url("https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1800&q=80")
          `,
        }}
      >
        <div className="max-w-7xl mx-auto text-center max-w-3xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E5D9CC]/20 border border-[#E5D9CC]/30 text-[#E5D9CC] text-xs font-semibold uppercase tracking-widest mb-4">
            <Sparkles size={14} /> Dewani Couture Collection
          </div>
          <h1 className="font-serif text-5xl md:text-6xl font-bold leading-tight">
            Haute Couture Product Catalog
          </h1>
          <p className="mt-4 text-white/85 text-base md:text-lg leading-relaxed">
            Order ready-to-wear boutique creations directly or book a custom fitting slot for master tailor stitching.
          </p>
        </div>
      </section>

      {/* Filter & Search Section */}
      <section className="py-8 px-6 border-b border-[#E5D9CC] bg-white sticky top-16 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-6">
          {/* Categories Tab */}
          <div className="flex items-center gap-2 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0 scrollbar-none">
            <Filter size={18} className="text-[#8B4513] shrink-0 mr-1 hidden sm:block" />
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition shrink-0 cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-[#8B4513] text-[#FAF6F0] shadow-md shadow-[#8B4513]/20"
                    : "bg-[#FAF6F0] text-stone-700 hover:bg-[#E5D9CC]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="w-full lg:w-80 flex items-center gap-3 px-4 py-2.5 rounded-xl border border-[#E5D9CC] bg-[#FAF6F0] focus-within:bg-white focus-within:border-[#8B4513] transition">
            <Search size={18} className="text-stone-400 shrink-0" />
            <input
              type="text"
              placeholder="Search designs or fabrics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-sm text-stone-800 outline-none placeholder:text-stone-400"
            />
          </div>
        </div>
      </section>

      {/* Products Showcase */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
        {/* Loading state */}
        {loading && (
          <div className="py-20 text-center">
            <div className="w-12 h-12 border-4 border-[#E5D9CC] border-t-[#8B4513] rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-stone-500 font-medium text-sm">Loading collection from MongoDB...</p>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 p-6 rounded-2xl text-center max-w-lg mx-auto text-sm font-semibold">
            <p>{error}</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && products.length === 0 && (
          <div className="bg-white rounded-3xl p-12 border border-[#E5D9CC] shadow-sm text-center max-w-2xl mx-auto">
            <ShoppingBag size={48} className="mx-auto text-[#8B4513]/40 mb-4" />
            <h3 className="font-serif text-2xl font-bold text-[#38220F]">No Products Found</h3>
            <p className="text-stone-500 mt-2 text-sm leading-relaxed">
              No products found in category "{selectedCategory}". Add new items from the Admin Control Panel!
            </p>
            <Link
              to="/admin"
              className="mt-6 inline-flex items-center gap-2 bg-[#8B4513] text-[#FAF6F0] px-6 py-3 rounded-xl font-semibold hover:bg-[#6D340D] transition text-xs"
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
                className="group bg-white rounded-3xl overflow-hidden border border-[#E5D9CC] shadow-sm hover:shadow-xl transition duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Image Container */}
                  <div className="relative h-64 overflow-hidden bg-gray-100">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-[#38220F] text-xs font-bold px-3 py-1 rounded-full shadow-xs">
                      {item.category}
                    </div>

                    {item.fabric && (
                      <div className="absolute bottom-4 left-4 bg-[#2A1810]/80 backdrop-blur-md text-white text-xs px-3 py-1 rounded-full">
                        {item.fabric} Fabric
                      </div>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-6">
                    <h3 className="font-serif text-2xl font-bold text-[#38220F] group-hover:text-[#8B4513] transition">
                      {item.name}
                    </h3>

                    <p className="text-stone-500 text-sm mt-2 line-clamp-2 leading-relaxed">
                      {item.description || "Handcrafted boutique creation with detailed fitting options."}
                    </p>

                    <div className="mt-4 pt-4 border-t border-[#E5D9CC] flex items-center justify-between">
                      <div>
                        <p className="text-[11px] text-stone-400 font-bold uppercase">Price</p>
                        <div className="flex items-center text-[#8B4513] font-bold text-2xl">
                          <IndianRupee size={20} />
                          <span>{item.price}</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-[11px] text-stone-400 font-bold uppercase">Availability</p>
                        <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
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
                    className="w-full bg-[#8B4513] hover:bg-[#6D340D] text-[#FAF6F0] font-semibold py-3 rounded-2xl transition flex items-center justify-center gap-2 text-xs shadow-md cursor-pointer"
                  >
                    <ShoppingBag size={15} /> Direct Order Product (No Fitting Needed)
                  </button>

                  <Link
                    to="/services"
                    state={{ product: item }}
                    className="w-full bg-[#FAF6F0] hover:bg-[#E5D9CC] text-[#38220F] font-semibold py-2.5 rounded-2xl transition flex items-center justify-center gap-2 text-xs border border-[#E5D9CC]"
                  >
                    <Scissors size={14} className="text-[#8B4513]" /> Add Custom Fitting & Book Slot <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Customer Reviews & Feedback Section */}
      <section className="py-16 px-6 bg-white border-t border-[#E5D9CC]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FAF6F0] text-[#8B4513] border border-[#E5D9CC] text-xs font-bold uppercase tracking-wider mb-2">
              <Star size={14} className="fill-[#8B4513] text-[#8B4513]" /> Customer Satisfaction & Feedback
            </div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#38220F]">
              What Our Atelier Clients Say
            </h2>
            <p className="text-stone-500 text-sm mt-2">
              Real reviews from customers who purchased boutique outfits or booked fitting sessions.
            </p>
          </div>

          {reviews.length === 0 ? (
            <div className="text-center py-10 text-stone-400 text-sm">
              No customer reviews submitted yet. Submit feedback after booking an appointment!
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {reviews.map((rev) => (
                <div key={rev._id} className="p-6 rounded-3xl bg-[#FAF6F0] border border-[#E5D9CC] flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1 text-amber-500 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={i < rev.rating ? "fill-amber-500 text-amber-500" : "text-stone-300"}
                        />
                      ))}
                    </div>
                    <p className="text-stone-700 text-sm italic mb-4">"{rev.comment}"</p>
                  </div>

                  <div className="pt-3 border-t border-[#E5D9CC] flex items-center justify-between text-xs">
                    <span className="font-bold text-[#38220F]">{rev.customer?.name || "Boutique Customer"}</span>
                    <span className="text-stone-400">{new Date(rev.createdAt).toLocaleDateString("en-IN")}</span>
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
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl relative border border-[#E5D9CC]">
            <button
              onClick={() => setSelectedProductForDirectOrder(null)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 text-xl font-bold cursor-pointer"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-4 mb-6 border-b border-[#E5D9CC] pb-4">
              <img
                src={selectedProductForDirectOrder.image}
                alt={selectedProductForDirectOrder.name}
                className="w-16 h-16 rounded-2xl object-cover border border-stone-200"
              />
              <div>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                  Direct Product Order
                </span>
                <h3 className="font-serif text-xl font-bold text-[#38220F] mt-1">
                  {selectedProductForDirectOrder.name}
                </h3>
                <p className="text-[#8B4513] font-bold text-base mt-0.5">
                  ₹{selectedProductForDirectOrder.price}
                </p>
              </div>
            </div>

            {orderSuccess ? (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-5 rounded-2xl text-center space-y-2">
                <CheckCircle size={36} className="mx-auto text-emerald-600" />
                <p className="font-semibold text-sm">{orderSuccess}</p>
              </div>
            ) : (
              <form onSubmit={handleConfirmDirectOrder} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1 uppercase">Quantity</label>
                  <input
                    type="number"
                    min={1}
                    max={selectedProductForDirectOrder.stock || 10}
                    value={directOrderForm.quantity}
                    onChange={(e) => setDirectOrderForm({ ...directOrderForm, quantity: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm outline-none focus:border-[#8B4513]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1 uppercase">Delivery Address *</label>
                  <input
                    type="text"
                    required
                    placeholder="Street, City, Pincode"
                    value={directOrderForm.address}
                    onChange={(e) => setDirectOrderForm({ ...directOrderForm, address: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm outline-none focus:border-[#8B4513]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1 uppercase">Payment Option</label>
                  <select
                    value={directOrderForm.paymentMethod}
                    onChange={(e) => setDirectOrderForm({ ...directOrderForm, paymentMethod: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm outline-none focus:border-[#8B4513]"
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
                    className="w-full bg-[#8B4513] hover:bg-[#6D340D] text-[#FAF6F0] font-semibold py-3.5 rounded-2xl transition text-sm shadow-md cursor-pointer disabled:opacity-50"
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
