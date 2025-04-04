import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  Home,
  LayoutDashboard,
  User,
  Calendar,
  BarChart2,
  HeartPulse,
  GraduationCap,
  BookOpenCheck,
  LogOut,
} from "lucide-react";
import "./header.css";

const FacultySidebar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const menuItems = [
    { name: "Home", path: "/", icon: <Home size={18} /> },
    { name: "Dashboard", path: "/dashboard", icon: <LayoutDashboard size={18} /> },
    { name: "Profile", path: "/profile", icon: <User size={18} /> },
    { name: "Attendance", path: "/attendance", icon: <Calendar size={18} /> },
    { name: "Internal Assessment", path: "/internal", icon: <BarChart2 size={18} /> },
    { name: "Patient Cases", path: "/patient-cases", icon: <HeartPulse size={18} /> },
    { name: "Faculty Activities", path: "/faculty", icon: <GraduationCap size={18} /> },
    { name: "Resources", path: "/resources", icon: <BookOpenCheck size={18} /> }, // NEW TAB
  ];

  return (
    <>
      {/* Menu Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="fixed top-5 right-5 bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-2 rounded-md z-[10000] shadow-lg hover:scale-105 transition-transform"
      >
        <Menu size={30} />
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 w-[260px] h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white pt-5 z-[9999] shadow-xl transition-transform duration-300 ease-in-out sidebar_1 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Close Button */}
        <button
          onClick={toggleSidebar}
          className="absolute top-2 right-4 text-white  focus:outline-none"
        >
          <X size={24} />
        </button>

        {/* Navigation Menu */}
        <nav className="mt-10">
          <ul className="space-y-2 px-3">
            {menuItems.map((item) => (
              <li key={item.name}>
                <button
                  onClick={() => {
                    navigate(item.path);
                    setIsOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 rounded-lg font-medium text-white flex items-center gap-3 transition-all duration-200 hover:bg-purple-700 hover:shadow-md hover:pl-5"
                >
                  {item.icon}
                  {item.name}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout Button */}
        <button
          className="w-[220px] mt-6 py-2 bg-gradient-to-r from-red-600 to-red-500 text-white text-sm font-semibold rounded-md shadow-md  transition duration-300 mx-auto block flex items-center justify-center gap-2"
          onClick={() => {
            localStorage.removeItem("token");
            navigate("/login");
            setIsOpen(false);
          }}
        >
          <LogOut size={18} /> Logout
        </button>
      </aside>
    </>
  );
};

export default FacultySidebar;
