import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router";
import { fetchWithToken } from "../api";
import AuthContext from "../context/AuthContext";

const ItemForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin } = useContext(AuthContext);

  const [item, setItem] = useState({
    name: "",
    price: 0,
    caffeinePercent: 0.03,
    color: "",
    type: "",
    subtype: "",
    description: "",
    manufacturer: "",
  });

  const [manufacturers, setManufacturers] = useState([]);
  const [tipovi, setTipovi] = useState([]);
  const [podtipovi, setPodtipovi] = useState({});
  const [type, setType] = useState("");
  const [subtype, setSubtype] = useState("");
  const [loading, setLoading] = useState(true);

  //učitavanje svih potrebnih podataka
  useEffect(() => {
    if (!user || !isAdmin()) {
      navigate("/");
      return;
    }

    const loadData = async () => {
      try {
        //postavljanje proizvođača za formu
        const manufacturersData = await fetchWithToken("/manufacturers");
        setManufacturers(manufacturersData);

        //postavljanje tipova i podtipova
        const itemsData = await fetchWithToken("/items");
        const types = [...new Set(itemsData.map(i => i.type))];
        setTipovi(types);

        const subMap = {};
        types.forEach(t => {
          subMap[t] = [...new Set(itemsData.filter(i => i.type === t).map(i => i.subtype))];
        });
        setPodtipovi(subMap);

        //ako je edit item, onda učitaj podatke o itemu
        if (id) {
          const data = await fetchWithToken(`/items/${id}`);
          setItem(data);
          setType(data.type);
          setSubtype(data.subtype);
        } else {
          setType(types[0] || "");
          setSubtype(subMap[types[0]] ? subMap[types[0]][0] : "");
        }
      } catch (err) {
        console.error(err);
        alert("Error loading data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user, isAdmin, navigate, id]);

  //mijenjanje podtipa kad se promijeni tip
  useEffect(() => {
    if (type && podtipovi[type]) {
      setSubtype(podtipovi[type][0] || "");
    }
  }, [type, podtipovi]);
  //handleri za formu
  const handleChange = (e) => {
    const { name, value } = e.target;
    setItem({ ...item, [name]: value });
  };

  const handleTypeChange = (e) => {
    const val = e.target.value;
    if (val === "__new__") {
      const newType = prompt("Unesi novu vrstu:");
      if (newType) {
        setTipovi(prev => [...prev, newType]);
        setType(newType);
        setPodtipovi(prev => ({ ...prev, [newType]: [] }));
        setSubtype("");
      }
    } else {
      setType(val);
    }
  };

  const handleSubtypeChange = (e) => {
    const val = e.target.value;
    if (val === "__new__") {
      const newSubtype = prompt("Unesi novu podvrstu:");
      if (newSubtype) {
        setPodtipovi(prev => ({
          ...prev,
          [type]: [...(prev[type] || []), newSubtype]
        }));
        setSubtype(newSubtype);
      }
    } else {
      setSubtype(val);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        ...item,
        type,
        subtype,
      };

      if (id) {
        await fetchWithToken(`/items/${id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
      } else {
        await fetchWithToken("/items", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }

      navigate("/admin");
    } catch (err) {
      console.error(err);
      alert("Error saving item");
    }
  };

  if (loading) return <p>Loading...</p>;
  //forma za dodavanje/uređivanje itema
  return (
    <div className="editForm">
      <h2>{id ? "Izmjeni produkt" : "Dodaj novi produkt"}</h2>
      <form onSubmit={handleSubmit}>
        <label>Ime</label>
        <input name="name" value={item.name} onChange={handleChange} />
        <br />

        <label>Cijena</label>
        <input
          type="number"
          step="0.01"
          name="price"
          value={item.price}
          onChange={handleChange}
        />
        <br />

        <label>
          Kofein: {item.caffeinePercent} ({Math.round(item.caffeinePercent * 100)}%)
        </label>
        <input
          type="range"
          min="0"
          max="0.9"
          step="0.01"
          name="caffeinePercent"
          value={item.caffeinePercent}
          onChange={handleChange}
        />
        <br />

        <label>Boja pića</label>
        <input name="color" value={item.color} onChange={handleChange} />
        <br />

        <label>Vrsta</label>
        <select value={type} onChange={handleTypeChange}>
          {tipovi.map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
          <option value="__new__">-- Dodaj novu vrstu --</option>
        </select>
        <br />

        <label>Podvrsta</label>
        <select value={subtype} onChange={handleSubtypeChange}>
          {(podtipovi[type] || []).map(st => (
            <option key={st} value={st}>{st}</option>
          ))}
          <option value="__new__">-- Dodaj novu vrstu --</option>
        </select>
        <br />

        <label>Opis proizvoda</label>
        <textarea name="description" value={item.description} onChange={handleChange} />
        <br />

        <label>Proizvođač</label>
        <select
          name="manufacturer"
          value={item.manufacturer?._id || item.manufacturer || ""}
          onChange={handleChange}
        >
          <option value="">Odaberi proizvođača</option>
          {manufacturers.map((m) => (
            <option key={m._id} value={m._id}>{m.name}</option>
          ))}
        </select>
        <br />

        <button type="submit">Spremi</button>
      </form>
    </div>
  );
};

export default ItemForm;