import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Scissors,
  Search,
  Sparkles,
  IndianRupee,
  CalendarDays,
  ShoppingBag,
  ArrowRight,
  Filter,
} from "lucide-react";

export function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

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

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, searchQuery]);

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
            Discover handcrafted sarees, bridal lehengas, custom designer gowns, and premium boutique fabrics.
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
                className={`px-4 py-2 rounded-xl text-xs font-bold transition shrink-0 ${
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

                {/* Footer Action */}
                <div className="px-6 pb-6 pt-2">
                  <Link
                    to="/services"
                    state={{ product: item }}
                    className="w-full bg-pink-600 hover:bg-pink-700 text-white font-semibold py-3 rounded-xl transition flex items-center justify-center gap-2 text-sm shadow-md shadow-pink-200"
                  >
                    <CalendarDays size={16} /> Book Custom Fitting <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Products;
