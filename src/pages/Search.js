import { useState, useEffect, useContext } from "react";
import Result from "../components/Result";
import useDropdown from "../components/Dropdown";

const Search = () => {
  const [tipovi, setTipovi] = useState([]);
  const [podtipovi, setPodtipovi] = useState({});
  const [allProducts, setAllProducts] = useState([]);
  const [products, setProducts] = useState([]);

  const [type, TypeDropdown, setType, setTypeOptions] = useDropdown("Type", "", []);
  const [subtype, SubtypeDropdown, setSubtype, setSubtypeOptions] = useDropdown("Subtype", "", []);

  useEffect(() => {
    fetch("http://localhost:5123/items")
      .then(res => res.json())
      .then(items => {
        setAllProducts(items);
        setProducts(items);

        // Tipovi i podtipovi
        const types = [...new Set(items.map(i => i.type))];
        setTipovi(types);
        setTypeOptions(types);
        setType(types[0]);

        const subMap = {};
        types.forEach(t => {
          subMap[t] = [...new Set(items.filter(i => i.type === t).map(i => i.subtype))];
        });
        setPodtipovi(subMap);
        setSubtypeOptions(subMap[types[0]]);
        setSubtype(subMap[types[0]][0]);
      })
      .catch(err => console.error("Fetch error:", err));
  }, []);

  //promjena podtipa kad se tip promijeni
  useEffect(() => {
    if (type && podtipovi[type]) {
      setSubtypeOptions(podtipovi[type]);
      setSubtype(podtipovi[type][0]);
    }
  }, [type, podtipovi]);

  const getProducts = () => {
    const filtered = allProducts.filter(i => i.type === type && i.subtype === subtype);
    setProducts(filtered);
  };

  //grupiranje po proizvođaču
  const groupedByManufacturer = products.reduce((acc, item) => {
    const name = item.manufacturer?.name || item.manufacturer;
    if (!acc[name]) acc[name] = [];
    acc[name].push(item);
    return acc;
  }, {});

  return (
    <div>
      <form>
        <TypeDropdown /><br />
        <SubtypeDropdown /><br /><br />
        <button type="button" onClick={getProducts}>Search</button>
      </form>

      {Object.keys(groupedByManufacturer).sort().map(mName => (
        <div key={mName}>
          <h2>{mName}</h2>
          {groupedByManufacturer[mName].map(product => (
            <Result key={product._id} data={[product]} />
          ))}
        </div>
      ))}
    </div>
  );
};

export default Search;