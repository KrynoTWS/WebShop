import { createContext, useContext, useEffect, useState } from "react";
import AuthContext from "./AuthContext";

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const { token,user } = useContext(AuthContext);
  const [favorites, setFavorites] = useState([]);
  //mijenjanje favorita pri izmjeni korisnika
  useEffect(() => {
    if (!token|| !user?._id){
      setFavorites([]);
      return;
    }
    const fetchFavorites = async () => {
      try {
        const res = await fetch("http://localhost:5123/favorites", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error("Fetch failed");
        const data = await res.json();
        setFavorites(data);
      } catch (err) {
        console.error(err);
        setFavorites([]);
      }
    };

    fetchFavorites();
  }, [token]);
  //micanje ili stavljanje produkta u favorite
  const toggleFavorite = async (item) => {
    if (!token) return;
    try {
      const res = await fetch(`http://localhost:5123/favorites/${item._id}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Toggle failed");
      const data = await res.json();
      setFavorites(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export default FavoritesContext;
