import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { fetchWithToken } from "../api";

const ManufacturerDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [manufacturer, setManufacturer] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchWithToken(`/manufacturers/${id}`);

        if (!data || !data.manufacturer) {
          throw new Error("Proizvođač nije pronađen");
        }

        setManufacturer(data.manufacturer);
        setProducts(data.items || []);
      } catch (err) {
        console.error("Greška pri učitavanju proizvođača:", err);
        alert("Greška pri učitavanju proizvođača");
        navigate("/manufacturers"); //vrati se nazad u slučaju greške
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id, navigate]);

  if (loading) return <h2>Učitavanje...</h2>;
  if (!manufacturer) return <h2>Proizvođač nije pronađen.</h2>;

  return (
    <div className="manufacturerDetails">
      <h1>{manufacturer.name}</h1>
      <p><strong>Država:</strong> {manufacturer.country}</p>
      <p><strong>Godina osnivanja:</strong> {manufacturer.foundedYear}</p>
      <p><strong>Opis:</strong> {manufacturer.description}</p>
      {manufacturer.logoUrl && (
        <img
          src={manufacturer.logoUrl}
          alt={manufacturer.name}
          style={{ width: "150px" }}
        />
      )}

      <h2>Proizvodi proizvođača</h2>
      {products.length === 0 ? (
        <p>Nema dostupnih proizvoda.</p>
      ) : (
        <ul>
          {products.map((p, index) => (
            <li key={`${p._id}-${index}`}>
              <strong>{p.name}</strong> - {p.type} ({p.subtype})
              <button onClick={() => navigate(`/details/${p._id}`)}>Detalji</button>
            </li>
          ))}
        </ul>
      )}

      <button onClick={() => navigate("/manufacturers")}>
        Povratak na listu proizvođača
      </button>
    </div>
  );
};

export default ManufacturerDetail;
