import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router";
import { fetchWithToken } from "../api";
import CartContext from "../context/KosaricaContext";
import FavoritesContext from "../context/FavoritesContext";
import AuthContext from "../context/AuthContext";
import Modal from "../components/Modal";

const Details = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const { favorites, toggleFavorite } = useContext(FavoritesContext);
  const { user, token } = useContext(AuthContext);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({ show: false });
  //dohvaćanje detalja proizvoda, provjera je li korisnik
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await fetchWithToken(`/items/${id}`);
        setProduct(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, navigate, token]);

  const handleAddToCart = () => {
    addToCart(product);
    setModal({ show: true });
  };

  const closeModal = () => setModal({ show: false });
  const goToCart = () => {
    closeModal();
    navigate("/cart");
  };

  if (loading) return <h2>Učitavanje...</h2>;
  if (!product) return <h2>Proizvod ne postoji!</h2>;

  const isFavorite = favorites.some(f => f._id === product._id);
  //ako nije ulogiran, ne može kupiti ni favorizirati
  return (
    <div className="details">
      <h1>{product.name}</h1>
      <p><strong>Vrsta:<br/></strong> {product.type}</p>
      <p><strong>Podvrsta:<br/></strong> {product.subtype}</p>
      <p><strong>Opis:<br/></strong> {product.description}</p>
      <p><strong>Boja pića:<br/></strong> {product.color}</p>
      <p><strong>Kofein:<br/></strong> {product.caffeinePercent * 100}%</p>
      <p><strong>Proizvođač:<br/></strong> {product.manufacturer?.name || product.manufacturer}</p>

      {user && (
        <>
          <button onClick={() => toggleFavorite(product)}>
            {isFavorite ? "Ukloni iz favorita" : "Dodaj u favorite"}
          </button>
          <button onClick={handleAddToCart}>Dodaj u košaricu</button>
        </>
      )}
      <button onClick={() => navigate("/")}>Pretraživanje</button>

      {modal.show && (
        <Modal onClose={closeModal} onConfirm={goToCart}>
          <h3>Proizvod "{product.name}" dodano u košaricu!</h3>
        </Modal>
      )}
    </div>
  );
};

export default Details;