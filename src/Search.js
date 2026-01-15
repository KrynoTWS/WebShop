import { useState, useEffect } from "react";
import Result from "./Result.js";
import useDropdown from "./Dropdown.js";

const Search = () => {
  const [tipovi, setTipovi] = useState([]);
  const [podtipovi, setPodtipovi] = useState({});
  const [itemsData, setItemsData] = useState({});

  const [type, TypeDropdown, setType, setTypeOptions] = useDropdown("Vrsta", "", []);
  const [subtype, SubtypeDropdown, setSubtype, setSubtypeOptions] = useDropdown(
    "Podvrsta", "", []
  );
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5123/products")
      .then(res => res.json())
      .then(data => {
        setTipovi(data.tipovi);
        setPodtipovi(data.podtipovi);
        setItemsData(data.itemsData);
        setTypeOptions(data.tipovi);
        setType(data.tipovi[0]);
        setSubtypeOptions(data.podtipovi[data.tipovi[0]]);
        setSubtype(data.podtipovi[data.tipovi[0]][0]);
      })
      .catch(err => console.error("Fetch error:", err));
  }, []);


  useEffect(() => {
    if (type && podtipovi[type]) {
      setSubtypeOptions(podtipovi[type]);
      setSubtype(podtipovi[type][0]);
    }
  }, [type, podtipovi]);

  const getProducts = () => {
    setProducts((itemsData[type] && itemsData[type][subtype]) || []);
  };

  return (
    <div>
      <form>
        <TypeDropdown />
        <br />
        <SubtypeDropdown />
        <br /><br />
        <button type="button" onClick={getProducts}>
          Search
        </button>
      </form>
      <Result data={products} />
    </div>
  );
};

export default Search;