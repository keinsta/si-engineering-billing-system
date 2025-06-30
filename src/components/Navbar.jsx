import { useState } from "react";
import logo from "../assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  return (
    <nav className="bg-white shadow-md w-full fixed top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to={"/"}>
              <img src={logo} className="w-40" alt="SI Engineering" />
            </Link>
          </div>

          {/* Desktop Buttons */}
          <div className="hidden md:flex space-x-4">
            <button
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
              onClick={() => {
                navigate("/");
              }}
            >
              Generate Bill
            </button>
            <button
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
              onClick={() => {
                navigate("/find-customer-bill");
              }}
            >
              Find Bill
            </button>
          </div>

          {/* Mobile Hamburger */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-gray-800 focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d={
                    isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"
                  }
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden mt-2 space-y-2">
            <button
              className="w-full text-left bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
              onClick={() => {
                navigate("/");
                setIsOpen(!isOpen);
              }}
            >
              Generate Bill
            </button>
            <button
              className="w-full text-left bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
              onClick={() => {
                navigate("/find-customer-bill");
                setIsOpen(!isOpen);
              }}
            >
              Find Bill
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
