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
        const res = await fetch("http://localhost:5000/api/services");

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Failed to load services");
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
    <div className="min-h-screen bg-[#FAF6F0] text-[#38220F]">

      {/* HERO */}
      <section
        className="
          relative
          min-h-[420px]
          flex
          items-center
          bg-cover
          bg-center
        "
        style={{
          backgroundImage: `
            linear-gradient(
              rgba(42, 24, 16, 0.88),
              rgba(42, 24, 16, 0.75)
            ),
            url("https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1800&q=85")
          `,
        }}
      >

        <div className="max-w-7xl mx-auto w-full px-6 py-20">

          <div className="max-w-2xl text-white">

            <div className="flex items-center gap-3 mb-5">
              <span className="w-12 h-[1px] bg-[#E5D9CC]"></span>

              <p className="
                uppercase
                tracking-[0.3em]
                text-[#E5D9CC]
                text-xs
                font-semibold
              ">
                Dewani Haute Atelier
              </p>
            </div>

            <h1 className="
              font-serif
              text-5xl
              md:text-6xl
              leading-tight
              font-medium
            ">
              Atelier Fitting Services
            </h1>

            <p className="
              mt-5
              text-white/85
              text-base
              md:text-lg
              leading-8
              max-w-xl
            ">
              Select a specialized tailoring service below to view real-time available appointment slots and reserve your custom fitting session.
            </p>

          </div>

        </div>

      </section>


      {/* SERVICES CONTENT */}
      <section className="py-20 px-6">

        <div className="max-w-7xl mx-auto">

          {/* Heading */}
          <div className="text-center max-w-2xl mx-auto mb-14">

            <p className="
              uppercase
              tracking-[0.25em]
              text-[#8B4513]
              text-xs
              font-bold
            ">
              Direct Slot Booking
            </p>

            <h2 className="
              mt-3
              font-serif
              text-4xl
              md:text-5xl
              text-[#38220F]
            ">
              Choose Service & Book Available Slot
            </h2>

            <p className="
              mt-4
              text-stone-600
              leading-7
              text-sm
            ">
              Click "Select Available Slot" to pick your date and time window with our master tailoring team.
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
                border-[#E5D9CC]
                border-t-[#8B4513]
                rounded-full
                animate-spin
              "></div>

              <p className="mt-4 text-stone-500 font-medium text-sm">
                Loading atelier services...
              </p>

            </div>
          )}


          {/* Error */}
          {!loading && error && (
            <div className="
              max-w-xl
              mx-auto
              text-center
              bg-rose-50
              border
              border-rose-200
              rounded-2xl
              px-6
              py-5
              text-rose-700
              font-semibold
              text-sm
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
              rounded-3xl
              border
              border-[#E5D9CC]
            ">

              <Scissors
                size={40}
                className="mx-auto text-[#8B4513]"
              />

              <h3 className="
                mt-4
                font-serif
                text-2xl
                text-[#38220F]
              ">
                No services available
              </h3>

              <p className="mt-2 text-stone-500 text-sm">
                Our services will be available soon. Add services from the Admin Panel.
              </p>

            </div>
          )}


          {/* Service Cards */}
          {!loading && !error && services.length > 0 && (

            <div className="
              grid
              sm:grid-cols-2
              lg:grid-cols-3
              gap-8
            ">

              {services.map((service) => (

                <div
                  key={service._id}
                  className="
                    group
                    bg-white
                    rounded-3xl
                    overflow-hidden
                    border
                    border-[#E5D9CC]
                    shadow-sm
                    hover:shadow-xl
                    transition
                    duration-300
                    flex flex-col justify-between
                  "
                >

                  {/* Visual Header */}
                  <div>
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
                            rgba(42, 24, 16, 0.35),
                            rgba(42, 24, 16, 0.55)
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
                        rounded-2xl
                        bg-white/95
                        flex
                        items-center
                        justify-center
                        text-[#8B4513]
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
                          bg-[#8B4513]
                          text-[#FAF6F0]
                          text-xs
                          font-semibold
                          px-3
                          py-1.5
                          rounded-full
                        ">
                          Atelier Tailoring Service
                        </span>

                      </div>

                    </div>


                    {/* Card Content */}
                    <div className="p-7">

                      <h3 className="
                        font-serif
                        text-2xl
                        text-[#38220F]
                        group-hover:text-[#8B4513]
                        transition
                      ">
                        {service.name}
                      </h3>


                      <p className="
                        mt-3
                        text-stone-500
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
                        border-[#E5D9CC]
                        flex
                        items-center
                        justify-between
                      ">

                        {/* Duration */}
                        <div className="flex items-center gap-2.5">

                          <div className="
                            w-9
                            h-9
                            rounded-xl
                            bg-[#FAF6F0]
                            flex
                            items-center
                            justify-center
                            text-[#8B4513]
                          ">
                            <Clock size={17} />
                          </div>

                          <div>
                            <p className="text-[11px] text-stone-400 font-bold uppercase">
                              Duration
                            </p>

                            <p className="
                              text-xs
                              font-bold
                              text-stone-800
                            ">
                              {service.duration} mins
                            </p>
                          </div>

                        </div>


                        {/* Price */}
                        <div className="text-right">

                          <p className="text-[11px] text-stone-400 font-bold uppercase">
                            Fitting Fee
                          </p>

                          <div className="
                            flex
                            items-center
                            justify-end
                            text-[#8B4513]
                            font-bold
                            text-xl
                          ">
                            <IndianRupee size={17} />
                            {service.price}
                          </div>

                        </div>

                      </div>

                    </div>
                  </div>

                  {/* Direct Book Button */}
                  <div className="p-7 pt-0">
                    <Link
                      to={`/slots/${service._id}`}
                      state={{ service, product: selectedProduct }}
                      className="
                        w-full
                        flex
                        items-center
                        justify-center
                        gap-2
                        bg-[#8B4513]
                        hover:bg-[#6D340D]
                        text-[#FAF6F0]
                        py-3.5
                        rounded-2xl
                        font-semibold
                        transition
                        duration-200
                        shadow-md
                        text-xs
                      "
                    >
                      <CalendarDays size={17} />
                      Select Available Slot
                      <ArrowRight size={16} />
                    </Link>
                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

      </section>


      {/* BOTTOM CTA */}
      <section className="bg-[#2A1810] py-20 px-6">

        <div className="
          max-w-3xl
          mx-auto
          text-center
          text-white
        ">

          <Sparkles
            size={30}
            className="mx-auto text-[#E5D9CC]"
          />

          <h2 className="
            mt-5
            font-serif
            text-4xl
            md:text-5xl
          ">
            Ready for your custom fitting?
          </h2>

          <p className="
            mt-5
            text-white/80
            leading-relaxed
            text-sm
          ">
            Select a service above and book your appointment slot with Dewani Atelier.
          </p>

          <Link
            to="/services"
            className="
              inline-flex
              items-center
              gap-2
              mt-7
              bg-[#8B4513]
              hover:bg-[#6D340D]
              text-[#FAF6F0]
              px-8
              py-3.5
              rounded-2xl
              font-semibold
              transition
              text-xs
            "
          >
            View All Fitting Services
            <ArrowRight size={16} />
          </Link>

        </div>

      </section>

    </div>
  );
}

export default Services;
