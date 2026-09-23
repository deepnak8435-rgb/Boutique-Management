import { useEffect, useState } from "react";
import { Clock, IndianRupee, Scissors, CalendarDays, Sparkles, ArrowRight, ShoppingBag } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const location = useLocation();
  const selectedProduct = location.state?.product || null;

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch(
          "http://localhost:5000/api/services"
        );

        const data = await res.json();
        if (!res.ok) {
          throw new Error(
            data.error || "Failed to load services"
          );
        }

        setServices(data);
      } catch (err) {
        console.error("Error fetching services:", err);
        setError("Unable to load services. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  return (
    <div className="min-h-screen bg-[#fffafc]">

      {/* =====================================================
          HERO
      ===================================================== */}
      <section
        className="
          relative
          min-h-[430px]
          flex
          items-center
          bg-cover
          bg-center
        "
        style={{
          backgroundImage: `
            linear-gradient(
              rgba(50, 31, 43, 0.82),
              rgba(50, 31, 43, 0.65)
            ),
            url("https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1800&q=85")
          `,
        }}
      >

        <div className="max-w-7xl mx-auto w-full px-6 py-20">

          <div className="max-w-2xl text-white">

            <div className="flex items-center gap-3 mb-5">
              <span className="w-12 h-[1px] bg-pink-300"></span>

              <p className="
                uppercase
                tracking-[0.3em]
                text-pink-200
                text-xs
                font-semibold
              ">
                Dewani Boutique
              </p>
            </div>

            <h1 className="
              font-serif
              text-5xl
              md:text-6xl
              leading-tight
            ">
              Our Services
            </h1>

            <p className="
              mt-5
              text-white/80
              text-base
              md:text-lg
              leading-8
              max-w-xl
            ">
              From custom tailoring to careful alterations,
              every service is designed to give you a beautiful,
              comfortable and confident fit.
            </p>

          </div>

        </div>

      </section>


      {/* =====================================================
          SERVICES CONTENT
      ===================================================== */}
      <section className="py-20 px-6">

        <div className="max-w-7xl mx-auto">

          {/* Heading */}
          <div className="text-center max-w-2xl mx-auto mb-14">

            <p className="
              uppercase
              tracking-[0.25em]
              text-pink-600
              text-xs
              font-semibold
            ">
              What We Offer
            </p>

            <h2 className="
              mt-3
              font-serif
              text-4xl
              md:text-5xl
              text-[#321f2b]
            ">
              Services made for you
            </h2>

            <p className="
              mt-4
              text-gray-500
              leading-7
            ">
              Choose the service that suits your needs and
              reserve a convenient appointment with our team.
            </p>

          </div>


          {/* Loading */}
          {loading && (
            <div className="
              flex
              flex-col
              items-center
              justify-center
              py-20
            ">

              <div className="
                w-10
                h-10
                border-4
                border-pink-100
                border-t-pink-600
                rounded-full
                animate-spin
              "></div>

              <p className="mt-4 text-gray-500">
                Loading services...
              </p>

            </div>
          )}


          {/* Error */}
          {!loading && error && (
            <div className="
              max-w-xl
              mx-auto
              text-center
              bg-red-50
              border
              border-red-100
              rounded-xl
              px-6
              py-5
              text-red-600
            ">
              {error}
            </div>
          )}


          {/* Empty */}
          {!loading && !error && services.length === 0 && (
            <div className="
              text-center
              py-20
              bg-white
              rounded-2xl
              border
              border-gray-100
            ">

              <Scissors
                size={40}
                className="mx-auto text-pink-400"
              />

              <h3 className="
                mt-4
                font-serif
                text-2xl
                text-[#321f2b]
              ">
                No services available
              </h3>

              <p className="mt-2 text-gray-500">
                Our services will be available soon.
              </p>

            </div>
          )}


          {/* Service Cards */}
          {!loading && !error && services.length > 0 && (

            <div className="
              grid
              sm:grid-cols-2
              lg:grid-cols-3
              gap-7
            ">

              {services.map((service) => (

                <div
                  key={service._id}
                  className="
                    group
                    bg-white
                    rounded-2xl
                    overflow-hidden
                    border
                    border-gray-100
                    shadow-sm
                    hover:shadow-xl
                    transition
                    duration-300
                  "
                >

                  {/* Image / Visual Header */}
                  <div
                    className="
                      relative
                      h-48
                      bg-cover
                      bg-center
                    "
                    style={{
                      backgroundImage: `
                        linear-gradient(
                          rgba(50, 31, 43, 0.25),
                          rgba(50, 31, 43, 0.35)
                        ),
                        url("https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=900&q=80")
                      `,
                    }}
                  >

                    <div className="
                      absolute
                      top-5
                      left-5
                      w-11
                      h-11
                      rounded-full
                      bg-white/95
                      flex
                      items-center
                      justify-center
                      text-pink-600
                      shadow-md
                    ">
                      <Scissors size={21} />
                    </div>

                    <div className="
                      absolute
                      bottom-5
                      left-5
                      right-5
                    ">

                      <span className="
                        inline-block
                        bg-pink-600
                        text-white
                        text-xs
                        font-semibold
                        px-3
                        py-1.5
                        rounded-full
                      ">
                        Boutique Service
                      </span>

                    </div>

                  </div>


                  {/* Card Content */}
                  <div className="p-7">

                    <h3 className="
                      font-serif
                      text-2xl
                      text-[#321f2b]
                      group-hover:text-pink-600
                      transition
                    ">
                      {service.name}
                    </h3>


                    <p className="
                      mt-3
                      text-gray-500
                      text-sm
                      leading-7
                      min-h-[70px]
                    ">
                      {service.description ||
                        "Professional boutique service with careful attention to detail and fitting."}
                    </p>


                    {/* Duration + Price */}
                    <div className="
                      mt-6
                      pt-5
                      border-t
                      border-gray-100
                      flex
                      items-center
                      justify-between
                    ">

                      {/* Duration */}
                      <div className="flex items-center gap-2">

                        <div className="
                          w-9
                          h-9
                          rounded-full
                          bg-pink-50
                          flex
                          items-center
                          justify-center
                          text-pink-600
                        ">
                          <Clock size={17} />
                        </div>

                        <div>
                          <p className="text-xs text-gray-400">
                            Duration
                          </p>

                          <p className="
                            text-sm
                            font-semibold
                            text-gray-700
                          ">
                            {service.duration} mins
                          </p>
                        </div>

                      </div>


                      {/* Price */}
                      <div className="text-right">

                        <p className="text-xs text-gray-400">
                          Starting from
                        </p>

                        <div className="
                          flex
                          items-center
                          justify-end
                          text-pink-600
                          font-bold
                          text-xl
                        ">
                          <IndianRupee size={17} />
                          {service.price}
                        </div>

                      </div>

                    </div>


                    {/* Book Button */}
                    <Link
                      to={`/slots/${service._id}`}
                      state={{ service, product: selectedProduct }}
                      className="
                        mt-6
                        w-full
                        flex
                        items-center
                        justify-center
                        gap-2
                        bg-pink-600
                        hover:bg-pink-700
                        text-white
                        py-3
                        rounded-lg
                        font-semibold
                        transition
                        duration-200
                      "
                    >
                      <CalendarDays size={18} />
                      Book Appointment
                      <ArrowRight size={17} />
                    </Link>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

      </section>


      {/* =====================================================
          BOTTOM CTA
      ===================================================== */}
      <section className="bg-[#321f2b] py-20 px-6">

        <div className="
          max-w-3xl
          mx-auto
          text-center
          text-white
        ">

          <Sparkles
            size={30}
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
            text-white/70
            leading-7
          ">
            Select a service and book your appointment
            with Dewani Boutique.
          </p>

          <Link
            to="/services"
            className="
              inline-flex
              items-center
              gap-2
              mt-7
              bg-pink-600
              hover:bg-pink-700
              text-white
              px-7
              py-3.5
              rounded-lg
              font-semibold
              transition
            "
          >
            View Services
            <ArrowRight size={18} />
          </Link>

        </div>

      </section>

    </div>
  );
}

export default Services;

