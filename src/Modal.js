import { createPortal } from "react-dom";

const Modal = ({ children, onClose,onConfirm }) => {
  const modalRoot = document.getElementById("modal");
  if (!modalRoot) return null;

  return createPortal(
    <div className="modal-overlay">
      <div className = "modal">
        {children}
        <h4>Želite li provjeriti košaricu?</h4>
        <button onClick={onConfirm}>Da</button>
        <button onClick={onClose}>Ne</button>
      </div>
    </div>,
    modalRoot
  );
};

export default Modal;
