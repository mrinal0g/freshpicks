import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProductsPage from "./ProductsPage";
import OrderPage from "./OrderPage";
import TrackPage from "./TrackPage";
import AdminPage from "./AdminPage";
import NotFound from "./NotFound";

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<ProductsPage />} />
      <Route path="/order" element={<OrderPage />} />
      <Route path="/track" element={<TrackPage />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);

export default App;
