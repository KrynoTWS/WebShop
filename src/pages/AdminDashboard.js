// pages/AdminDashboard.js
import { useEffect, useState, useContext } from "react";
import { useNavigate, Link } from "react-router";
import AuthContext from "../context/AuthContext";
import { fetchWithToken } from "../api";

const AdminDashboard = () => {
  const { user, isAdmin } = useContext(AuthContext);
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [manufacturers, setManufacturers] = useState([]);

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

    const handleDeleteItem = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      await fetchWithToken(`/items/${id}`, { method: "DELETE" });
      setItems(items.filter(i => i._id !== id));
    } catch (err) {
      console.error(err);
      alert("Error deleting item");
    }
  };

  const handleDeleteManufacturer = async (id) => {
    if (!window.confirm("Are you sure you want to delete this manufacturer?")) return;
    try {
      await fetchWithToken(`/manufacturers/${id}`, { method: "DELETE" });
      setManufacturers(manufacturers.filter(m => m._id !== id));
    } catch (err) {
      console.error(err);
      alert("Cannot delete manufacturer with linked items");
    }
  };

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <h3>Products</h3>
      <Link to="/items/new"><button>Add New Item</button></Link>
      <ul>
        {items.map(item => (
          <li key={item._id}>
            {item.name} - {item.manufacturer?.name || item.manufacturer}
            <Link to={`/items/edit/${item._id}`}><button>Edit</button></Link>
            <button onClick={() => handleDeleteItem(item._id)}>Delete</button>
          </li>
        ))}
      </ul>

      <h3>Manufacturers</h3>
      <Link to="/manufacturers/new"><button>Add New Manufacturer</button></Link>
      <ul>
        {manufacturers.map(m => (
          <li key={m._id}>
            {m.name}
            <Link to={`/manufacturers/edit/${m._id}`}><button>Edit</button></Link>
            <button onClick={() => handleDeleteManufacturer(m._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminDashboard;
