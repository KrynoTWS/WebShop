import { useState, useEffect } from "react";
import Result from "../components/Result";
import useDropdown from "../components/Dropdown";

const Search = () => {
  const [allItems, setAllItems] = useState({});
  const [filteredItems, setFilteredItems] = useState([]);
  const [subtypesByType, setSubtypesByType] = useState([]);
  const [selectedType, TypeDropdown, setSelectedType, setTypeOptions] = useDropdown("Type", "", []);
  const [selectedSubtype, SubtypeDropdown, setSelectedSubtype, setSubtypeOptions] = useDropdown("Subtype", "", []);

  //dohvaćanje svih proizvoda
  useEffect(() => {
    fetch("http://localhost:5123/items")
      .then(res => res.json())
      .then(items => {
        //spremanje svih proizvoda
        setAllItems(items);
        setFilteredItems(items);
        //mapiranje i postavljanje tipova,podtipova
        const types = [...new Set(items.map(item => item.type))];
        setTypeOptions(types);
        setSelectedType(types[0]);
        const subtypeMap = {};
        types.forEach(type => { 
          subtypeMap[type] = [ 
            ...new Set(
              items
                .filter(item => item.type === type)
                .map(item => item.subtype)
            )
          ];
        });
        setSubtypesByType(subtypeMap);
        //postavljanje početnih opcija
        setSubtypeOptions(subtypeMap[types[0]]);
        setSelectedSubtype(subtypeMap[types[0]][0]);
      })
      .catch(err => console.error("Fetch error:", err));
  }, []);
  //reagiranje na promjene tipa
  useEffect(() => {
    if (!selectedType || !subtypesByType[selectedType]) return;
    setSubtypeOptions(subtypesByType[selectedType]);
    setSelectedSubtype(subtypesByType[selectedType][0]);
  }, [selectedType, subtypesByType]);
  //handler za searchanje proizvoda
  const handleSearch = () => {
    const results = allItems.filter(
      item =>
        item.type === selectedType &&
        item.subtype === selectedSubtype
    );

    setFilteredItems(results);
  };
  //grupiranje po proizvođaču
  const groupedByManufacturer = filteredItems.reduce((grouped, item) => {
    const manufacturerName =
      item.manufacturer?.name || item.manufacturer;

    if (!grouped[manufacturerName]) {
      grouped[manufacturerName] = [];
    }
    grouped[manufacturerName].push(item);
    return grouped;
  }, {});


  return (
    <div>
      <form>
        <TypeDropdown /><br />
        <SubtypeDropdown /><br /><br />
        <button type="button" onClick={handleSearch}>Search</button>
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