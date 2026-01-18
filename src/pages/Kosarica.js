import { useContext } from "react";
import { useNavigate } from "react-router";
import CartContext from "../context/KosaricaContext.js";

const Cart = () => {
  const { cart, checkout } = useContext(CartContext);
  const navigate = useNavigate();

  if (cart.length === 0)
    return (
      <div>
        <h2>Košarica je prazna</h2>
        <button onClick={() => navigate("/")}>
          Povratak na pretraživanje
        </button>
      </div>
    );

return (
    <div>
      <h2>Košarica</h2>
      {cart.map((item)  => (
        <div key={`${item._id}`}>
          <h3>{item.name}</h3>
          <p>Vrsta: {item.type}</p>
          <p>Podvrsta: {item.subtype}</p>
          <p>Količina: {item.quantity}</p>
        </div>
      ))}
      <br />
      <button onClick={checkout}>Naruči</button>
      <button onClick={() => navigate("/")}>
        Povratak na pretraživanje
      </button>
    </div>
  );
};

export default Cart;
