import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Scissors, CalendarDays, Sparkles, Ruler, Heart, ArrowRight, Star, ShoppingBag, ShieldCheck } from "lucide-react";

function Home() {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/reviews")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setReviews(data);
      })
      .catch((err) => console.error("Error loading home reviews:", err));
  }, []);

  return (
    <div className="bg-[#FAF6F0] text-[#38220F]">

      {/* =====================================================
          HERO SECTION
      ===================================================== */}
      <section
        className="relative min-h-[680px] flex items-center bg-cover bg-center"
        style={{
          backgroundImage: `
            linear-gradient(
              to right,
              rgba(42, 24, 16, 0.90),
              rgba(42, 24, 16, 0.72),
              rgba(42, 24, 16, 0.35)
            ),
            url("https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=2000&q=85")
          `,
        }}
      >
        <div className="max-w-7xl mx-auto w-full px-6 py-24">

          <div className="max-w-2xl text-white">

            {/* Small heading */}
            <div className="flex items-center gap-3 mb-6">
              <span className="w-12 h-[1px] bg-[#E5D9CC]"></span>

              <p className="uppercase tracking-[0.3em] text-[#E5D9CC] text-xs font-semibold">
                Dewani Haute Atelier
              </p>
            </div>

            {/* Main heading */}
            <h1 className="font-serif text-5xl md:text-7xl leading-[1.05] font-medium">
              Timeless Tailoring
              <br />
              <span className="text-[#E5D9CC] italic">
                & Atelier Craft
              </span>
            </h1>

            <p className="mt-7 text-base md:text-lg leading-8 text-white/85 max-w-xl">
              Experience personalized tailoring, bespoke fitting sessions, and luxury designer wear. Book your appointment slot directly or explore our ready-to-wear couture collection.
            </p>

            {/* Direct Booking CTAs */}
            <div className="mt-9 flex flex-col sm:flex-row gap-4">

              <Link
                to="/services"
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2.5
                  bg-[#8B4513]
                  hover:bg-[#6D340D]
                  text-[#FAF6F0]
                  px-8
                  py-4
                  rounded-2xl
                  font-semibold
                  transition
                  duration-200
                  shadow-xl
                  text-sm
                "
              >
                <CalendarDays size={18} />
                Book Fitting Slot Now
              </Link>

              <Link
                to="/products"
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2.5
                  border
                  border-white/40
                  hover:bg-white
                  hover:text-[#38220F]
                  text-white
                  px-8
                  py-4
                  rounded-2xl
                  font-semibold
                  transition
                  duration-200
                  text-sm
                "
              >
                <ShoppingBag size={18} />
                Explore Couture Catalog
              </Link>

            </div>

          </div>
        </div>

        {/* Bottom decorative text */}
        <div className="absolute bottom-7 left-0 right-0">
          <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">

            <p className="text-white/50 text-xs tracking-[0.25em] uppercase">
              Bespoke Fitting • Tailoring • Bridal Atelier
            </p>

            <div className="hidden md:flex items-center gap-2 text-white/50 text-xs">
              <Scissors size={15} />
              Handcrafted Precision
            </div>

          </div>
        </div>

      </section>


      {/* =====================================================
          WELCOME SECTION
      ===================================================== */}
      <section className="py-24 px-6">

        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">

          {/* Image */}
          <div className="relative">

            <img
              src="https://assets.cntraveller.in/photos/6967436ee69603befa0061d4/master/w_1600%2Cc_limit/DSCF6078.jpg"
              alt="Boutique tailoring"
              className="w-full h-[480px] object-cover rounded-3xl shadow-xl border border-[#E5D9CC]"
            />

            {/* Floating card */}
            <div className="
              absolute
              -bottom-8
              -right-6
              md:right-[-35px]
              bg-white
              shadow-xl
              rounded-2xl
              p-6
              max-w-[230px]
              border
              border-[#E5D9CC]
            ">
              <Scissors
                size={26}
                className="text-[#8B4513] mb-3"
              />

              <p className="font-serif text-xl text-[#38220F]">
                Bespoke Fitting
              </p>

              <p className="text-xs text-stone-500 mt-2 leading-relaxed">
                Custom body measurement snapshots for seamless designer stitching.
              </p>
            </div>

          </div>


          {/* Content */}
          <div>

            <p className="
              uppercase
              tracking-[0.25em]
              text-[#8B4513]
              text-xs
              font-bold
              mb-4
            ">
              Welcome to Dewani Atelier
            </p>

            <h2 className="
              font-serif
              text-4xl
              md:text-5xl
              leading-tight
              text-[#38220F]
            ">
              Where Couture Meets
              <br />
              Personal Distinction.
            </h2>

            <p className="mt-6 text-stone-600 leading-8 text-sm">
              We believe every outfit should fit your exact contours and style preferences. Our boutique provides high-precision tailoring, alterations, and luxury fitting appointments with master craftsmanship.
            </p>

            <p className="mt-4 text-stone-600 leading-8 text-sm">
              Whether you need bridal lehenga fitting, custom saree blouse stitching, or direct luxury product ordering, our atelier workflow makes slot booking effortless.
            </p>

            <Link
              to="/services"
              className="
                inline-flex
                items-center
                gap-2
                mt-7
                text-[#8B4513]
                font-bold
                hover:text-[#6D340D]
                transition
                text-sm
              "
            >
              Browse Services & Select Slot
              <ArrowRight size={18} />
            </Link>

          </div>

        </div>

      </section>


      {/* =====================================================
          SERVICES & DIRECT SLOT BOOKING HIGHLIGHTS
      ===================================================== */}
      <section className="bg-[#F4ECE1] py-24 px-6 border-y border-[#E5D9CC]">

        <div className="max-w-7xl mx-auto">

          <div className="text-center max-w-2xl mx-auto mb-14">

            <p className="
              uppercase
              tracking-[0.25em]
              text-[#8B4513]
              text-xs
              font-bold
            ">
              Atelier Services
            </p>

            <h2 className="
              mt-3
              font-serif
              text-4xl
              md:text-5xl
              text-[#38220F]
            ">
              Tailored & Fitted to Perfection
            </h2>

            <p className="mt-4 text-stone-600 leading-7 text-sm">
              Select any specialized service below to view real-time available appointment slots and reserve your session.
            </p>

          </div>


          <div className="grid md:grid-cols-3 gap-7">

            {/* Tailoring */}
            <div className="
              bg-white
              rounded-3xl
              p-8
              border
              border-[#E5D9CC]
              shadow-sm
              hover:shadow-xl
              transition
              duration-300
              group
              flex flex-col justify-between
            ">
              <div>
                <div className="
                  w-14
                  h-14
                  rounded-2xl
                  bg-[#FAF6F0]
                  flex
                  items-center
                  justify-center
                  text-[#8B4513]
                  mb-6
                  group-hover:bg-[#8B4513]
                  group-hover:text-white
                  transition
                ">
                  <Ruler size={26} />
                </div>

                <h3 className="font-serif text-2xl text-[#38220F]">
                  Custom Tailoring
                </h3>

                <p className="mt-3 text-stone-500 text-sm leading-7">
                  Bespoke garments crafted and fitted strictly to your body specs, lining preferences, and cut choices.
                </p>
              </div>

              <Link
                to="/services"
                className="inline-flex items-center justify-between mt-8 text-xs font-bold text-[#8B4513] bg-[#FAF6F0] p-3.5 rounded-xl hover:bg-[#8B4513] hover:text-white transition"
              >
                <span>Book Fitting Slot</span>
                <ArrowRight size={16} />
              </Link>
            </div>


            {/* Alterations */}
            <div className="
              bg-white
              rounded-3xl
              p-8
              border
              border-[#E5D9CC]
              shadow-sm
              hover:shadow-xl
              transition
              duration-300
              group
              flex flex-col justify-between
            ">
              <div>
                <div className="
                  w-14
                  h-14
                  rounded-2xl
                  bg-[#FAF6F0]
                  flex
                  items-center
                  justify-center
                  text-[#8B4513]
                  mb-6
                  group-hover:bg-[#8B4513]
                  group-hover:text-white
                  transition
                ">
                  <Scissors size={26} />
                </div>

                <h3 className="font-serif text-2xl text-[#38220F]">
                  Precision Alterations
                </h3>

                <p className="mt-3 text-stone-500 text-sm leading-7">
                  Give your existing wardrobe a refreshed luxury silhouette with master tailor adjustments.
                </p>
              </div>

              <Link
                to="/services"
                className="inline-flex items-center justify-between mt-8 text-xs font-bold text-[#8B4513] bg-[#FAF6F0] p-3.5 rounded-xl hover:bg-[#8B4513] hover:text-white transition"
              >
                <span>Book Fitting Slot</span>
                <ArrowRight size={16} />
              </Link>
            </div>


            {/* Bridal */}
            <div className="
              bg-white
              rounded-3xl
              p-8
              border
              border-[#E5D9CC]
              shadow-sm
              hover:shadow-xl
              transition
              duration-300
              group
              flex flex-col justify-between
            ">
              <div>
                <div className="
                  w-14
                  h-14
                  rounded-2xl
                  bg-[#FAF6F0]
                  flex
                  items-center
                  justify-center
                  text-[#8B4513]
                  mb-6
                  group-hover:bg-[#8B4513]
                  group-hover:text-white
                  transition
                ">
                  <Heart size={26} />
                </div>

                <h3 className="font-serif text-2xl text-[#38220F]">
                  Bridal & Occasion Wear
                </h3>

                <p className="mt-3 text-stone-500 text-sm leading-7">
                  Exclusive fitting trials and embroidery adjustments for bridal lehengas and celebration gowns.
                </p>
              </div>

              <Link
                to="/services"
                className="inline-flex items-center justify-between mt-8 text-xs font-bold text-[#8B4513] bg-[#FAF6F0] p-3.5 rounded-xl hover:bg-[#8B4513] hover:text-white transition"
              >
                <span>Book Fitting Slot</span>
                <ArrowRight size={16} />
              </Link>
            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          WHY CHOOSE US
      ===================================================== */}
      <section className="py-24 px-6">

        <div className="max-w-6xl mx-auto">

          <div className="text-center mb-14">

            <p className="
              uppercase
              tracking-[0.25em]
              text-[#8B4513]
              text-xs
              font-bold
            ">
              Standard Boutique Experience
            </p>

            <h2 className="
              mt-3
              font-serif
              text-4xl
              md:text-5xl
              text-[#38220F]
            ">
              The Dewani Standard
            </h2>

          </div>


          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8">

            <div className="text-center p-6 rounded-2xl bg-white border border-[#E5D9CC]">
              <Sparkles
                size={28}
                className="mx-auto text-[#8B4513]"
              />

              <h3 className="font-semibold text-stone-900 mt-4 text-sm">
                Master Craftsmanship
              </h3>

              <p className="text-xs text-stone-500 mt-2 leading-relaxed">
                Precision embroidery & hand-sewn finishing.
              </p>
            </div>


            <div className="text-center p-6 rounded-2xl bg-white border border-[#E5D9CC]">
              <Ruler
                size={28}
                className="mx-auto text-[#8B4513]"
              />

              <h3 className="font-semibold text-stone-900 mt-4 text-sm">
                Custom Body Specs
              </h3>

              <p className="text-xs text-stone-500 mt-2 leading-relaxed">
                Automatic measurement snapshotting into bookings.
              </p>
            </div>


            <div className="text-center p-6 rounded-2xl bg-white border border-[#E5D9CC]">
              <Heart
                size={28}
                className="mx-auto text-[#8B4513]"
              />

              <h3 className="font-semibold text-stone-900 mt-4 text-sm">
                Flexible Purchase Flow
              </h3>

              <p className="text-xs text-stone-500 mt-2 leading-relaxed">
                Direct product orders or custom fitting slots.
              </p>
            </div>


            <div className="text-center p-6 rounded-2xl bg-white border border-[#E5D9CC]">
              <CalendarDays
                size={28}
                className="mx-auto text-[#8B4513]"
              />

              <h3 className="font-semibold text-stone-900 mt-4 text-sm">
                Live Garment Tracking
              </h3>

              <p className="text-xs text-stone-500 mt-2 leading-relaxed">
                4-Stage live progress tracking on all orders.
              </p>
            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          CUSTOMER REVIEWS & TESTIMONIALS SECTION
      ===================================================== */}
      {reviews.length > 0 && (
        <section className="py-20 px-6 bg-white border-t border-[#E5D9CC]">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <p className="uppercase tracking-[0.25em] text-[#8B4513] text-xs font-bold">
                Customer Feedback
              </p>
              <h2 className="mt-3 font-serif text-4xl md:text-5xl text-[#38220F]">
                Loved by Our Atelier Clients
              </h2>
              <p className="mt-4 text-stone-500 text-sm leading-relaxed">
                Read real ratings and experiences shared by our boutique customers.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {reviews.slice(0, 6).map((rev) => (
                <div key={rev._id} className="p-6 rounded-3xl bg-[#FAF6F0] border border-[#E5D9CC] shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1 text-amber-500 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={i < rev.rating ? "fill-amber-500 text-amber-500" : "text-stone-300"}
                        />
                      ))}
                    </div>
                    <p className="text-stone-700 text-sm leading-relaxed italic mb-6">"{rev.comment}"</p>
                  </div>

                  <div className="pt-4 border-t border-[#E5D9CC] flex items-center justify-between text-xs">
                    <span className="font-bold text-[#38220F]">{rev.customer?.name || "Atelier Client"}</span>
                    <span className="text-stone-400">{new Date(rev.createdAt).toLocaleDateString("en-IN")}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* =====================================================
          FINAL CTA
      ===================================================== */}
      <section
        className="relative py-24 px-6 bg-cover bg-center"
        style={{
          backgroundImage: `
            linear-gradient(
              rgba(42, 24, 16, 0.92),
              rgba(42, 24, 16, 0.92)
            ),
            url("https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1800&q=85")
          `,
        }}
      >

        <div className="max-w-3xl mx-auto text-center text-white">

          <Scissors
            size={32}
            className="mx-auto text-[#E5D9CC]"
          />

          <h2 className="
            mt-5
            font-serif
            text-4xl
            md:text-5xl
          ">
            Reserve Your Fitting Session
          </h2>

          <p className="
            mt-5
            text-white/80
            leading-relaxed
            max-w-xl
            mx-auto
            text-sm
          ">
            Book your appointment slot directly with Dewani Atelier and experience luxury custom tailoring designed specifically for you.
          </p>

          <Link
            to="/services"
            className="
              inline-flex
              items-center
              gap-2.5
              mt-8
              bg-[#8B4513]
              hover:bg-[#6D340D]
              text-[#FAF6F0]
              px-8
              py-4
              rounded-2xl
              font-semibold
              transition
              shadow-xl
              text-sm
            "
          >
            Select Service & Book Available Slot
            <ArrowRight size={18} />
          </Link>

        </div>

      </section>

    </div>
  );
}

export default Home;
