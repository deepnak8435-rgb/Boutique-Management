
import { Link } from "react-router-dom";
import {Scissors,CalendarDays, Sparkles, Ruler, Heart, ArrowRight,} from "lucide-react";

function Home() {
  return (
    <div className="bg-[#fffafc] text-[#321f2b]">

      {/* =====================================================
          HERO SECTION
      ===================================================== */}
      <section
        className="relative min-h-[680px] flex items-center bg-cover bg-center"
        style={{
          backgroundImage: `
            linear-gradient(
              to right,
              rgba(38, 17, 31, 0.88),
              rgba(38, 17, 31, 0.62),
              rgba(38, 17, 31, 0.25)
            ),
            url("https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=2000&q=85")
          `,
        }}
      >
        <div className="max-w-7xl mx-auto w-full px-6 py-24">

          <div className="max-w-2xl text-white">

            {/* Small heading */}
            <div className="flex items-center gap-3 mb-6">
              <span className="w-12 h-[1px] bg-pink-300"></span>

              <p className="uppercase tracking-[0.3em] text-pink-200 text-xs font-medium">
                Dewani Boutique
              </p>
            </div>

            {/* Main heading */}
            <h1 className="font-serif text-5xl md:text-7xl leading-[1.05] font-medium">
              Elegance
              <br />
              <span className="text-pink-200 italic">
                in Every Stitch
              </span>
            </h1>

            <p className="mt-7 text-base md:text-lg leading-8 text-white/85 max-w-xl">
              Experience personalized tailoring, beautiful alterations,
              and custom fitting designed around you. From everyday
              elegance to your most special occasions.
            </p>

            {/* Buttons */}
            <div className="mt-9 flex flex-col sm:flex-row gap-4">

              <Link
                to="/services"
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  bg-pink-600
                  hover:bg-pink-700
                  text-white
                  px-7
                  py-3.5
                  rounded-lg
                  font-semibold
                  transition
                  duration-200
                  shadow-lg
                "
              >
                <CalendarDays size={19} />
                Book an Appointment
              </Link>

              <Link
                to="/products"
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  border
                  border-white/50
                  hover:bg-white
                  hover:text-[#321f2b]
                  text-white
                  px-7
                  py-3.5
                  rounded-lg
                  font-semibold
                  transition
                  duration-200
                "
              >
                Explore Our Collection
                <ArrowRight size={18} />
              </Link>

            </div>

          </div>
        </div>

        {/* Bottom decorative text */}
        <div className="absolute bottom-7 left-0 right-0">
          <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">

            <p className="text-white/50 text-xs tracking-[0.25em] uppercase">
              Tailoring • Alterations • Bridal
            </p>

            <div className="hidden md:flex items-center gap-2 text-white/50 text-xs">
              <Scissors size={15} />
              Crafted with care
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
              src="https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=1000&q=85"
              alt="Boutique tailoring"
              className="w-full h-[480px] object-cover rounded-2xl shadow-xl"
            />

            {/* Floating card */}
            <div className="
              absolute
              -bottom-8
              -right-6
              md:right-[-35px]
              bg-white
              shadow-xl
              rounded-xl
              p-6
              max-w-[220px]
            ">
              <Scissors
                size={26}
                className="text-pink-600 mb-3"
              />

              <p className="font-serif text-xl">
                Crafted for you
              </p>

              <p className="text-sm text-gray-500 mt-2">
                Every measurement. Every detail. Every stitch.
              </p>
            </div>

          </div>


          {/* Content */}
          <div>

            <p className="
              uppercase
              tracking-[0.25em]
              text-pink-600
              text-xs
              font-semibold
              mb-4
            ">
              Welcome to Dewani Boutique
            </p>

            <h2 className="
              font-serif
              text-4xl
              md:text-5xl
              leading-tight
              text-[#321f2b]
            ">
              Where your style
              <br />
              becomes personal.
            </h2>

            <p className="mt-6 text-gray-600 leading-8">
              We believe that every outfit should reflect your personality,
              style, and individuality. Our boutique offers personalized
              tailoring, alterations, and custom-fitting services with
              careful attention to detail and quality craftsmanship.
            </p>

            <p className="mt-4 text-gray-600 leading-8">
              From everyday outfits to special occasions and bridal wear,
              our goal is to create a comfortable and beautiful fitting
              experience for every customer.
            </p>

            <Link
              to="/services"
              className="
                inline-flex
                items-center
                gap-2
                mt-7
                text-pink-600
                font-semibold
                hover:text-pink-700
                transition
              "
            >
              Discover our services
              <ArrowRight size={18} />
            </Link>

          </div>

        </div>

      </section>


      {/* =====================================================
          SERVICES SECTION
      ===================================================== */}
      <section className="bg-[#f9eef4] py-24 px-6">

        <div className="max-w-7xl mx-auto">

          <div className="text-center max-w-2xl mx-auto mb-14">

            <p className="
              uppercase
              tracking-[0.25em]
              text-pink-600
              text-xs
              font-semibold
            ">
              What We Do
            </p>

            <h2 className="
              mt-3
              font-serif
              text-4xl
              md:text-5xl
              text-[#321f2b]
            ">
              Tailored to perfection
            </h2>

            <p className="mt-4 text-gray-600 leading-7">
              Professional boutique services designed to make every
              garment fit beautifully and feel uniquely yours.
            </p>

          </div>


          <div className="grid md:grid-cols-3 gap-7">

            {/* Tailoring */}
            <div className="
              bg-white
              rounded-2xl
              p-8
              shadow-sm
              hover:shadow-xl
              transition
              duration-300
              group
            ">

              <div className="
                w-14
                h-14
                rounded-xl
                bg-pink-100
                flex
                items-center
                justify-center
                text-pink-600
                mb-6
                group-hover:bg-pink-600
                group-hover:text-white
                transition
              ">
                <Ruler size={27} />
              </div>

              <h3 className="font-serif text-2xl">
                Custom Tailoring
              </h3>

              <p className="mt-3 text-gray-500 leading-7">
                Garments created and fitted according to your
                measurements, preferences, and personal style.
              </p>

              <Link
                to="/services"
                className="inline-flex items-center gap-2 mt-6 text-pink-600 font-semibold"
              >
                Learn more
                <ArrowRight size={16} />
              </Link>

            </div>


            {/* Alterations */}
            <div className="
              bg-white
              rounded-2xl
              p-8
              shadow-sm
              hover:shadow-xl
              transition
              duration-300
              group
            ">

              <div className="
                w-14
                h-14
                rounded-xl
                bg-pink-100
                flex
                items-center
                justify-center
                text-pink-600
                mb-6
                group-hover:bg-pink-600
                group-hover:text-white
                transition
              ">
                <Scissors size={27} />
              </div>

              <h3 className="font-serif text-2xl">
                Alterations
              </h3>

              <p className="mt-3 text-gray-500 leading-7">
                Give your favorite clothes the perfect fit with
                professional adjustments and careful finishing.
              </p>

              <Link
                to="/services"
                className="inline-flex items-center gap-2 mt-6 text-pink-600 font-semibold"
              >
                Learn more
                <ArrowRight size={16} />
              </Link>

            </div>


            {/* Bridal */}
            <div className="
              bg-white
              rounded-2xl
              p-8
              shadow-sm
              hover:shadow-xl
              transition
              duration-300
              group
            ">

              <div className="
                w-14
                h-14
                rounded-xl
                bg-pink-100
                flex
                items-center
                justify-center
                text-pink-600
                mb-6
                group-hover:bg-pink-600
                group-hover:text-white
                transition
              ">
                <Heart size={27} />
              </div>

              <h3 className="font-serif text-2xl">
                Bridal & Occasion Wear
              </h3>

              <p className="mt-3 text-gray-500 leading-7">
                Thoughtful fitting and alterations for bridal,
                celebration, and special occasion outfits.
              </p>

              <Link
                to="/services"
                className="inline-flex items-center gap-2 mt-6 text-pink-600 font-semibold"
              >
                Learn more
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
              text-pink-600
              text-xs
              font-semibold
            ">
              Why Choose Us
            </p>

            <h2 className="
              mt-3
              font-serif
              text-4xl
              md:text-5xl
            ">
              The Dewani difference
            </h2>

          </div>


          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8">

            <div className="text-center">
              <Sparkles
                size={30}
                className="mx-auto text-pink-600"
              />

              <h3 className="font-semibold mt-4">
                Quality Craftsmanship
              </h3>

              <p className="text-sm text-gray-500 mt-2 leading-6">
                Attention to detail in every stitch.
              </p>
            </div>


            <div className="text-center">
              <Ruler
                size={30}
                className="mx-auto text-pink-600"
              />

              <h3 className="font-semibold mt-4">
                Perfect Fit
              </h3>

              <p className="text-sm text-gray-500 mt-2 leading-6">
                Measurements tailored specifically to you.
              </p>
            </div>


            <div className="text-center">
              <Heart
                size={30}
                className="mx-auto text-pink-600"
              />

              <h3 className="font-semibold mt-4">
                Personal Service
              </h3>

              <p className="text-sm text-gray-500 mt-2 leading-6">
                Your preferences always come first.
              </p>
            </div>


            <div className="text-center">
              <CalendarDays
                size={30}
                className="mx-auto text-pink-600"
              />

              <h3 className="font-semibold mt-4">
                Easy Appointments
              </h3>

              <p className="text-sm text-gray-500 mt-2 leading-6">
                Book your fitting without waiting in a queue.
              </p>
            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          FINAL CTA
      ===================================================== */}
      <section
        className="relative py-24 px-6 bg-cover bg-center"
        style={{
          backgroundImage: `
            linear-gradient(
              rgba(50, 31, 43, 0.88),
              rgba(50, 31, 43, 0.88)
            ),
            url("https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1800&q=85")
          `,
        }}
      >

        <div className="max-w-3xl mx-auto text-center text-white">

          <Scissors
            size={32}
            className="mx-auto text-pink-200"
          />

          <h2 className="
            mt-5
            font-serif
            text-4xl
            md:text-5xl
          ">
            Ready for your perfect fit?
          </h2>

          <p className="
            mt-5
            text-white/75
            leading-7
            max-w-xl
            mx-auto
          ">
            Book your appointment with Dewani Boutique and
            experience tailoring designed around you.
          </p>

          <Link
            to="/services"
            className="
              inline-flex
              items-center
              gap-2
              mt-8
              bg-pink-600
              hover:bg-pink-700
              text-white
              px-8
              py-3.5
              rounded-lg
              font-semibold
              transition
              shadow-lg
            "
          >
            Book Your Appointment
            <ArrowRight size={18} />
          </Link>

        </div>

      </section>

    </div>
  );
}

export default Home;

