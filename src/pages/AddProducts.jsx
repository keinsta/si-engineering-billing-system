import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function ProductForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [business, setBusiness] = useState({
    name: "",
    contact: "",
    address: "",
  });

  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    price: "",
    quantity: "",
  });
  const [pendingAmount, setPendingAmount] = useState(0);
  const [discount, setDiscount] = useState(0); // %
  const [tax, setTax] = useState(0); // %
  const [editIndex, setEditIndex] = useState(null);

  const handleBusinessChange = (e) => {
    setBusiness({
      ...business,
      [e.target.name]: e.target.value,
    });
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddOrUpdate = () => {
    if (!form.name || !form.price || !form.quantity)
      return alert("Please fill all product fields");
    if (editIndex !== null) {
      const updated = [...products];
      updated[editIndex] = form;
      setProducts(updated);
      setEditIndex(null);
    } else {
      setProducts([...products, form]);
    }
    setForm({ name: "", price: "", quantity: "" });
  };

  const handleEdit = (index) => {
    setForm(products[index]);
    setEditIndex(index);
  };

  const handleDelete = (index) => {
    setProducts(products.filter((_, i) => i !== index));
  };

  const calculateTotal = () => {
    const subtotal = products.reduce(
      (sum, prod) => sum + prod.price * prod.quantity,
      0
    );
    const discountAmount = (subtotal * discount) / 100;
    const taxableAmount = subtotal - discountAmount;
    const taxAmount = (taxableAmount * tax) / 100;
    return taxableAmount + taxAmount + pendingAmount;
  };

  const generateBill = async () => {
    if (!business.name || !business.contact || !business.address) {
      return alert(
        "Please fill all business details before generating the bill."
      );
    }
    setLoading(true);
    try {
      const response = await axios.post(
        "https://si-bills.keinsta.com/api/v1/bill",
        {
          business,
          products,
          discount,
          tax,
          pendingAmount,
        }
      );
      setLoading(false);
      navigate("/invoice", { state: { bill: response.data.bill } });
    } catch (error) {
      setLoading(false);
      alert(error.response?.data?.message || "Error saving bill to server");
    }
    // const savedBill = {
    //   serialNumber: "BILL-001", // optional fallback for preview
    //   business,
    //   products,
    //   discount,
    //   tax,
    //   total: calculateTotal(),
    //   createdAt: new Date(),
    // };
    // navigate("/invoice", { state: { bill: savedBill } });
  };

  return (
    <div className="min-h-screen flex justify-center items-start bg-gray-100 p-4 mt-16 pt-10">
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-md p-6 space-y-8">
        <h2 className="text-3xl font-extrabold text-center">
          <span className="bg-gradient-to-r from-sky-400 to-blue-600 bg-clip-text text-transparent">
            SI Engineering Billing System
          </span>
        </h2>

        {/* Business details */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700">
            Business Details
          </h3>
          <input
            name="name"
            value={business.name}
            onChange={handleBusinessChange}
            placeholder="Business Name"
            className="w-full border border-gray-300 rounded-lg p-3"
          />
          <input
            name="contact"
            value={business.contact}
            onChange={handleBusinessChange}
            placeholder="Business Contact"
            className="w-full border border-gray-300 rounded-lg p-3"
          />
          <input
            name="address"
            value={business.address}
            onChange={handleBusinessChange}
            placeholder="Business Address"
            className="w-full border border-gray-300 rounded-lg p-3"
          />
        </div>

        {/* Product form */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700">Add Product</h3>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Product Name"
            className="w-full border border-gray-300 rounded-lg p-3"
          />
          <input
            name="price"
            type="number"
            value={form.price}
            onChange={handleChange}
            placeholder="Product Price"
            className="w-full border border-gray-300 rounded-lg p-3"
          />
          <input
            name="quantity"
            type="number"
            value={form.quantity}
            onChange={handleChange}
            placeholder="Product Quantity"
            className="w-full border border-gray-300 rounded-lg p-3"
          />
          <button
            onClick={handleAddOrUpdate}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg mx-auto block"
          >
            {editIndex !== null ? "Update Product" : "Add Product"}
          </button>
        </div>

        {/* Discount and tax */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700">Discount (%)</h3>
          <input
            type="number"
            value={discount}
            onChange={(e) => setDiscount(Number(e.target.value))}
            placeholder="Enter Discount Percentage (e.g. 10)"
            className="w-full border border-gray-300 rounded-lg p-3"
          />

          <h3 className="text-lg font-semibold text-gray-700">Tax (%)</h3>
          <input
            type="number"
            value={tax}
            onChange={(e) => setTax(Number(e.target.value))}
            placeholder="Enter Tax Percentage (e.g. 5)"
            className="w-full border border-gray-300 rounded-lg p-3"
          />
          <h3 className="text-lg font-semibold text-gray-700">
            Pending Amount
          </h3>
          <input
            type="number"
            value={pendingAmount}
            onChange={(e) => setPendingAmount(Number(e.target.value))}
            placeholder="Enter Pending Amount (e.g. 500)"
            className="w-full border border-gray-300 rounded-lg p-3"
          />
        </div>

        {/* Products List */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-700">Products List</h3>
          {products.length === 0 ? (
            <p className="text-gray-500">No products added yet.</p>
          ) : (
            <ul className="space-y-2">
              {products.map((prod, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center bg-gray-50 border border-gray-200 rounded-lg p-3"
                >
                  <div>
                    <span className="font-medium">{prod.name}</span>{" "}
                    <span className="text-gray-600">
                      (
                      {new Intl.NumberFormat("en-PK", {
                        style: "currency",
                        currency: "PKR",
                        maximumFractionDigits: 0,
                      }).format(prod.price)}
                      ) x {prod.quantity} pcs ={" "}
                      {new Intl.NumberFormat("en-PK", {
                        style: "currency",
                        currency: "PKR",
                        maximumFractionDigits: 0,
                      }).format(prod.price * prod.quantity)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEdit(index)}
                      className="bg-indigo-100 text-indigo-600 rounded-full p-2 hover:bg-indigo-200"
                      title="Edit"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(index)}
                      className="bg-red-100 text-red-600 rounded-full p-2 hover:bg-red-200"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Total */}
        <div className="text-right text-lg font-semibold text-gray-800 pt-4 border-t">
          Total after {discount}% discount and {tax}% tax:{" "}
          {new Intl.NumberFormat("en-PK", {
            style: "currency",
            currency: "PKR",
            maximumFractionDigits: 0,
          }).format(calculateTotal())}
        </div>

        <button
          onClick={generateBill}
          className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700"
        >
          {loading ? "Generating Bill" : "Generate Bill"}
        </button>
      </div>
    </div>
  );
}
