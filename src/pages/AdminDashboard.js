import { useEffect, useState, useContext } from "react";
import { useNavigate, Link } from "react-router";
import AuthContext from "../context/AuthContext";
import { fetchWithToken } from "../api";

const AdminDashboard = () => {
  const { user, isAdmin } = useContext(AuthContext);
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [manufacturers, setManufacturers] = useState([]);
  //ako korisnik nema privilegije (nije admin), ide na početnu
  useEffect(() => {
    if (!user || !isAdmin()) {
      navigate("/");
      return;
    }
    
    const loadData = async () => {
      try {
        const itemsData = await fetchWithToken("/items");
        const manufacturersData = await fetchWithToken("/manufacturers");
        setItems(itemsData);
        setManufacturers(manufacturersData);
      } catch (err) {
        console.error(err);
      }
    };

    loadData();
  }, [user, isAdmin, navigate]);
    //provjere za brisanje
    const handleDeleteItem = async (id) => {
    if (!window.confirm("Je li sigurno želiš izbrisati ovaj produkt?")) return;
    try {
      await fetchWithToken(`/items/${id}`, { method: "DELETE" });
      setItems(items.filter(i => i._id !== id));
    } catch (err) {
      console.error(err);
      alert("Error deleting item");
    }
  };
  const handleDeleteManufacturer = async (id) => {
    if (!window.confirm("Je li sigurno želiš izbrisati ovog proizvođača?")) return;
    try {
      await fetchWithToken(`/manufacturers/${id}`, { method: "DELETE" });
      setManufacturers(manufacturers.filter(m => m._id !== id));
    } catch (err) {
      console.error(err);
      alert("Cannot delete manufacturer with linked items");
    }
  };
  //izgled stranice
  return (
    <div>
      <h2>Admin Dashboard</h2>
      <h3>Proizvodi</h3>
      <Link to="/items/new"><button>Dodaj novi proizvod</button></Link>
      <ul>
        {items.map(item => (
          <li key={item._id}>
            {item.name} - {item.manufacturer?.name || item.manufacturer}
            <Link to={`/items/edit/${item._id}`}><button>Izmjeni</button></Link>
            <button onClick={() => handleDeleteItem(item._id)}>Izbriši</button>
          </li>
        ))}
      </ul>

      <h3>Proizvođači</h3>
      <Link to="/manufacturers/new"><button>Dodaj novog proizvođača</button></Link>
      <ul>
        {manufacturers.map(m => (
          <li key={m._id}>
            {m.name}
            <Link to={`/manufacturers/edit/${m._id}`}><button>Izmjeni</button></Link>
            <button onClick={() => handleDeleteManufacturer(m._id)}>Izbriši</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminDashboard;
