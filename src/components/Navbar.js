import { Link, useNavigate } from "react-router";
import { useContext, useState } from "react";
import AuthContext from "../context/AuthContext";
import FavoritesContext from "../context/FavoritesContext";
import CartContext from "../context/KosaricaContext";
import FavoritesModal from "./FavoritesModal";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { favorites } = useContext(FavoritesContext);
  const { cart } = useContext(CartContext);
  const navigate = useNavigate();
  const [showFav, setShowFav] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav style={{ display: "flex", gap: "10px", alignItems: "center" }}>
      <Link to="/">Pretraživanje</Link>
      <Link to="/manufacturers">Proizvođači</Link>

      {user ? (
        <>
          {showFav && (
            <FavoritesModal
              favorites={favorites}
              onClose={() => setShowFav(false)}
            />
          )}
          {user.role === "admin" && <Link to="/admin">Admin upravljanje</Link>}
          <button onClick={() => setShowFav(true)}>
            Favorites ({favorites.length})
          </button>
          <button onClick={() => navigate("/cart")}>
            Košarica ({cart.reduce((sum, item) => sum + item.quantity, 0)})
          </button>

          <button onClick={handleLogout}>Logout</button>
          <span>Pozdrav, {user.username}</span>
        </>
      ) : (
        <>
          <Link to="/login">Login</Link>
          <Link to="/register">Registracija</Link>
        </>
      )}
    </nav>
  );
};

export default Navbar;
