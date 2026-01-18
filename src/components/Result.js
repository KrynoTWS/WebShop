import { useNavigate } from "react-router";
import { useContext, useState } from "react";
import CartContext from "../context/KosaricaContext";
import FavoritesContext from "../context/FavoritesContext";
import AuthContext from "../context/AuthContext";
import Modal from "./Modal";

const Result = ({ data }) => {
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const { toggleFavorite, favorites } = useContext(FavoritesContext);
  const { user } = useContext(AuthContext);
  const [modal, setModal] = useState({ show: false, product: null });

  const handleAddToCart = (product) => {
    addToCart(product);
    setModal({ show: true, product });
  };

  const closeModal = () => setModal({ show: false, product: null });
  const goToCart = () => {
    closeModal();
    navigate("/cart");
  };

  if (!data || data.length === 0) return <p>Nema proizvoda za prikaz.</p>;

  return (
    <div>
      {data.map(item => {
        const isFavorite = favorites.some(f => f._id === item._id);

        return (
          <div key={item._id} className="result">
            <h3>{item.name}</h3>
            <p>{item.description}</p>
            <button onClick={() => navigate(`/details/${item._id}`)}>Detalji</button>
            {user && (
              <>
                <button onClick={() => toggleFavorite(item)}>
                  {isFavorite ? "Ukloni iz favorita" : "Dodaj u favorite"}
                </button>
                <button onClick={() => handleAddToCart(item)}>Dodaj u košaricu</button>
              </>
            )}
          </div>
        );
      })}

      {modal.show && modal.product && (
        <Modal onClose={closeModal} onConfirm={goToCart}>
          <h3>Proizvod "{modal.product.name}" je dodan u košaricu!</h3>
        </Modal>
      )}
    </div>
  );
};

export default Result;