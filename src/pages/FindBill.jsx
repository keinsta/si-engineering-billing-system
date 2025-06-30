import { useState } from "react";
import axios from "axios";
import logo from "../assets/logo.png";

export default function FindBill() {
  const [serialNumber, setSerialNumber] = useState("");
  const [bill, setBill] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const handleSearch = async () => {
    if (!serialNumber.trim()) return;

    setLoading(true);
    setNotFound(false);
    setBill(null);

    try {
      const response = await axios.get(
        `https://si-bills.keinsta.com/api/v1/bill/${serialNumber}`
      );
      setBill(response.data);
    } catch (err) {
      console.error(err);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen mt-20">
      {/* Search Box */}
      <div className="max-w-xl mx-auto bg-white p-6 rounded shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">
          Find Bill by Serial Number
        </h2>
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Enter Serial Number"
            className="flex-1 border rounded p-2"
            value={serialNumber}
            onChange={(e) => setSerialNumber(e.target.value)}
          />
          <button
            onClick={handleSearch}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            Search
          </button>
        </div>
        {notFound && (
          <p className="text-red-600 mt-2">
            No bill found for this serial number.
          </p>
        )}
      </div>

      {/* Skeleton loader */}
      {loading && (
        <div className="max-w-4xl mx-auto bg-white border p-6 rounded shadow animate-pulse">
          <div className="h-4 bg-gray-300 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-300 rounded w-full mb-4"></div>
          <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-300 rounded w-2/3 mb-2"></div>
          <div className="h-4 bg-gray-300 rounded w-1/4"></div>
        </div>
      )}

      {/* Render invoice if found */}
      {bill && (
        <div className="invoice bg-white mx-auto my-8 shadow border border-gray-300 max-w-4xl p-8 print:p-4 print:border-none print:max-w-full print:mx-0 print:my-0">
          {/* Header */}
          <div className="flex justify-between border-b pb-4 mb-4 print:border-none print:pb-2 print:mb-2 no-break">
            <div>
              <img
                src={logo}
                className="w-28 md:w-40 mb-2"
                alt="SI Engineering"
              />
              <p className="text-xs">Broiler Control House, Parts & Services</p>
              <hr className="border-t border-gray-300 my-4" />

              <p className="font-semibold text-sm">Ifikhar Ahmad</p>
              <p className="text-gray-600 text-sm">Cell: 0300 764 3928</p>
              <p className="font-semibold text-sm">M. Sultan Ali</p>
              <p className="text-gray-600 text-sm">Cell: 0307 764 3434</p>
            </div>
            <div className="text-right text-sm">
              <h2 className="text-lg md:text-xl font-semibold text-gray-800">
                Sale Invoice
              </h2>
              <p className="font-bold">Bill No: {bill.serialNumber}</p>
              <p>
                Date: {new Date(bill.createdAt).toLocaleDateString("en-GB")}
              </p>

              <hr className="border-t border-gray-300 my-4" />

              <p className="font-semibold text-sm">Customer Details</p>
              <p className="text-gray-600">{bill.business.name}</p>
              <p className="text-gray-600">{bill.business.address}</p>
              <p className="text-gray-600">Phone: {bill.business.contact}</p>
            </div>
          </div>

          {/* Products */}
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-300 text-xs md:text-sm mb-6 print:text-xs">
              <thead className="bg-gray-100 border-b print:bg-gray-200">
                <tr>
                  <th className="border p-2">#</th>
                  <th className="border p-2 text-left">Product</th>
                  <th className="border p-2">Quantity</th>
                  <th className="border p-2">Price</th>
                  <th className="border p-2">Net Amount</th>
                </tr>
              </thead>
              <tbody>
                {bill.products.map((p, i) => (
                  <tr key={i}>
                    <td className="border p-1 text-center">{i + 1}</td>
                    <td className="border p-1">{p.name}</td>
                    <td className="border p-1 text-center">{p.quantity} pcs</td>
                    <td className="border p-1 text-right">
                      {new Intl.NumberFormat("en-PK", {
                        style: "currency",
                        currency: "PKR",
                        maximumFractionDigits: 0,
                      }).format(p.price)}
                    </td>
                    <td className="border p-1 text-right">
                      {new Intl.NumberFormat("en-PK", {
                        style: "currency",
                        currency: "PKR",
                        maximumFractionDigits: 0,
                      }).format(p.price * p.quantity)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="flex justify-end mb-4 no-break print:text-xs">
            <div className="w-full max-w-xs space-y-1">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>
                  {new Intl.NumberFormat("en-PK", {
                    style: "currency",
                    currency: "PKR",
                    maximumFractionDigits: 0,
                  }).format(
                    bill.products.reduce((s, p) => s + p.price * p.quantity, 0)
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Discount ({bill.discount}%) :</span>
                <span>
                  {new Intl.NumberFormat("en-PK", {
                    style: "currency",
                    currency: "PKR",
                    maximumFractionDigits: 0,
                  }).format(
                    bill.products.reduce(
                      (s, p) => s + p.price * p.quantity,
                      0
                    ) *
                      (bill.discount / 100)
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Tax ({bill.tax}%) :</span>
                <span>
                  {new Intl.NumberFormat("en-PK", {
                    style: "currency",
                    currency: "PKR",
                    maximumFractionDigits: 0,
                  }).format(
                    bill.products.reduce(
                      (s, p) => s + p.price * p.quantity,
                      0
                    ) *
                      (bill.tax / 100)
                  )}
                </span>
              </div>

              {/* ✅ Added pending amount display */}
              <div className="flex justify-between">
                <span>Pending Amount:</span>
                <span>
                  {new Intl.NumberFormat("en-PK", {
                    style: "currency",
                    currency: "PKR",
                    maximumFractionDigits: 0,
                  }).format(bill.pendingAmount || 0)}
                </span>
              </div>

              <div className="flex justify-between font-semibold border-t pt-2">
                <span>Net Amount:</span>
                <span>
                  {new Intl.NumberFormat("en-PK", {
                    style: "currency",
                    currency: "PKR",
                    maximumFractionDigits: 0,
                  }).format(bill.total)}
                </span>
              </div>
            </div>
          </div>

          <div className="text-xs text-gray-400 mt-8 no-break print:mt-4">
            Thank you for doing business with us.
          </div>

          {/* Print Button */}
          <div className="flex justify-center mt-4 print:hidden">
            <button
              onClick={() => window.print()}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Print Invoice
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
