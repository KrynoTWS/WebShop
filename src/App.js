import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import Search from "./pages/Search";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Kosarica from "./pages/Kosarica";
import Details from "./pages/Details";
import AdminDashboard from "./pages/AdminDashboard";
import ItemForm from "./pages/ItemForm";
import ManufacturerForm from "./pages/ManufacturerForm";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import Navbar from "./components/Navbar";
import Manufacturers from "./pages/Manufacturers";
import ManufacturerID from "./pages/ManufacturerDetail";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/KosaricaContext";
import { FavoritesProvider } from "./context/FavoritesContext";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <FavoritesProvider>
          <BrowserRouter>
            <Navbar />
            <Routes>
              <Route path="/" element={<Search />} />
              <Route path="/details/:id" element={<Details />} />
              <Route path="/cart" element={<ProtectedRoute><Kosarica /></ProtectedRoute>} />
              <Route path="/manufacturers" element={<Manufacturers/>} />
              <Route path="/manufacturer/:id" element={<ManufacturerID/>} />

              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
              <Route path="/items/new" element={<AdminRoute><ItemForm /></AdminRoute>} />
              <Route path="/items/edit/:id" element={<AdminRoute><ItemForm /></AdminRoute>} />
              <Route path="/manufacturers/new" element={<AdminRoute><ManufacturerForm /></AdminRoute>} />
              <Route path="/manufacturers/edit/:id" element={<AdminRoute><ManufacturerForm /></AdminRoute>} />
            </Routes>
          </BrowserRouter>
        </FavoritesProvider>
      </CartProvider>
    </AuthProvider>
  );
}

createRoot(document.getElementById("root")).render(<App />);