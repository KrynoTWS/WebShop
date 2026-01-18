import { createPortal } from "react-dom";
import { useNavigate } from "react-router";

const FavoritesModal = ({ favorites, onClose }) => {
  const modalRoot = document.getElementById("modal");
  const navigate = useNavigate();

  if (!modalRoot) return null;

  const goToDetails = (id) => {
    onClose();
    navigate(`/details/${id}`);
  };

  return createPortal(
    <div className="modal-overlay">
      <div className="modal">
        <h3>Favoriti</h3>

        {favorites.length === 0 ? (
          <p>Nema favorita</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {favorites.map(item => (
              <li key={item._id}>
                <button onClick={() => goToDetails(item._id)}>
                  {item.name}
                </button>
              </li>
            ))}
          </ul>
        )}

        <button onClick={onClose}>Zatvori</button>
      </div>
    </div>,
    modalRoot
  );
};

export default FavoritesModal;