import { useState,useEffect } from "react";
import { Link } from "react-router-dom";
function Services(){
const [services, setServices] = useState([]);   // holds the list of services
  const [loading, setLoading] = useState(true);   // tracks if we're still fetching

  useEffect(() => {
    fetch("http://localhost:5000/api/services")
      .then((res) => res.json())
      .then((data) => {
        setServices(data);
        setLoading(false);
      })
      .catch((err) => {
        console.log("Error fetching services:", err);
        setLoading(false);
      });
  }, []); // empty array = run this once, when the component first loads

  return (
    <div>
      <h1>Boutique Services</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {services.map((service) => (
            <li key={service._id}>
              {service.name} — ₹{service.price} ({service.duration} min){""}
              <Link to={`/slots/$service._id`}>View available slots</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
export default Services