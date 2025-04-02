import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const FacultySidebar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);

  return (
    <>
      {/* Sidebar Toggle Button */}
      {!isOpen && (
        <button
          className="fixed top-5 left-5 bg-gray-800 text-white p-2 rounded-md z-[10000] shadow-md"
          onClick={() => setIsOpen(true)}
        >
          ☰
        </button>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 w-[250px] h-screen bg-black text-white pt-5 z-[9999] shadow-xl transition-transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Close Button */}
        <button
          className="absolute top-2 right-4 text-white focus:outline-none"
          onClick={() => setIsOpen(false)}
        >
          ✖
        </button>

        {/* Navigation Menu */}
        <nav className="mt-10">
          <ul className="space-y-2 px-3">
            {[
              { name: "Home", path: "/", icon: "🏠" },
              { name: "Dashboard", path: "/dashboard", icon: "📋" },
              { name: "Profile", path: "/profile", icon: "👤" },
              { name: "Attendance", path: "/attendance", icon: "📅" },
              { name: "Internal Assessment", path: "/internal", icon: "📊" },
              { name: "Patient Cases", path: "/patient-cases", icon: "🏥" },
              { name: "Faculty Activities", path: "/faculty", icon: "🎓" },
              { name: "Attendance Average", path: "/average", icon: "🎓" },
            ].map((item) => (
              <li key={item.name}>
                <button
                  onClick={() => navigate(item.path)}
                  className="block w-full text-left px-4 py-2 rounded-md font-medium bg-gray-900 text-white focus:outline-none active:bg-gray-900 flex items-center"
                >
                  <span className="mr-3">{item.icon}</span> {item.name}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout Button */}
        <button
          className="w-[240px] mt-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md focus:outline-none active:bg-red-700 transition mx-auto block"
          onClick={() => {
            localStorage.removeItem("token");
            navigate("/login");
          }}
        >
          Logout
        </button>
      </aside>
    </>
  );
};

export default FacultySidebar;
