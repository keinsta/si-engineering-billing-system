import "./App.css";

import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProductForm from "./pages/AddProducts";
import Invoice from "./pages/Invoice";
import FindBill from "./pages/FindBill";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<ProductForm />} />
        <Route path="/invoice" element={<Invoice />} />
        <Route path="/find-customer-bill" element={<FindBill />} />
      </Routes>
    </>
  );
}

export default App;
