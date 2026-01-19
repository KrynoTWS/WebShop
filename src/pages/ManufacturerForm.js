import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router";
import { fetchWithToken } from "../api";
import AuthContext from "../context/AuthContext";

const ManufacturerForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin } = useContext(AuthContext);

  const [manufacturer, setManufacturer] = useState({
    name: "",
    country: "",
    foundedYear: "",
    description: "",
    logoUrl: "",
  });
  //dobavljanje podataka/ako nije admin, nazad
  useEffect(() => {
    if (!user || !isAdmin()) navigate("/");

    if (id) {
      fetchWithToken(`/manufacturers/${id}`)
        .then((data) => setManufacturer(data.manufacturer));
    }
  }, [id, user, isAdmin, navigate]);

  const handleChange = (e) => {
    setManufacturer({ ...manufacturer, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await fetchWithToken(`/manufacturers/${id}`, {
          method: "PUT",
          body: JSON.stringify(manufacturer),
        });
      } else {
        await fetchWithToken("/manufacturers", {
          method: "POST",
          body: JSON.stringify(manufacturer),
        });
      }
      navigate("/admin");
    } catch (err) {
      console.error(err);
      alert("Error saving manufacturer");
    }
  };

  return (
    <div>
      <h2>{id ? "Edit Manufacturer" : "Add New Manufacturer"}</h2>
      <form onSubmit={handleSubmit}>
        <label>Naziv</label>
        <input name="name" value={manufacturer.name} onChange={handleChange} />
        <br />
        <label>Zemlja</label>
        <input name="country" value={manufacturer.country} onChange={handleChange} />
        <br />
        <label>Godina osnivanja</label>
        <input name="foundedYear" value={manufacturer.foundedYear} onChange={handleChange} />
        <br />
        <label>Opis</label>
        <textarea name="description" value={manufacturer.description} onChange={handleChange} />
        <br />
        <label>Logo URL</label>
        <input name="logoUrl" value={manufacturer.logoUrl} onChange={handleChange} />
        <br />
        <button type="submit">Spremi</button>
      </form>
    </div>
  );
};

export default ManufacturerForm;