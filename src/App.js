import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import Search from "./Search.js";
import { CartProvider } from "./KosaricaContext.js";
import Kosarica from "./Kosarica.js";
import WrappedDetails from "./Details.js";

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Search />} />
          <Route path="/details/:id" element={<WrappedDetails />} />
          <Route path="/cart" element={<Kosarica />} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}

createRoot(document.getElementById("root")).render(<App />);
