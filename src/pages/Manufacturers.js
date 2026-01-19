import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { fetchWithToken } from "../api";

const Manufacturer = () => {
  const [manufacturers, setManufacturers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadManufacturers = async () => {
      try {
        const data = await fetchWithToken("/manufacturers");
        setManufacturers(data);
      } catch (err) {
        console.error("Error fetching manufacturers:", err);
        alert("Error loading manufacturers");
      }
    };
    loadManufacturers();
  }, []);

  return (
    <div >
      <h2>Proizvođači</h2>
      {manufacturers.length === 0 && <p>Nema proizvođača</p>}
      <ul>
        {manufacturers.map((m) => (
          <li className="manufacturerListed"
            key={m._id}
            onClick={() => navigate(`/manufacturer/${m._id}`)}
          >
            <h3>{m.name}</h3>
            <p>
              <strong>Zemlja:</strong> {m.country}
            </p>
            <p>
              <strong>Godina osnivanja:</strong> {m.foundedYear}
            </p>
            <img
              src={m.logoUrl}
              alt={m.name}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Manufacturer;
