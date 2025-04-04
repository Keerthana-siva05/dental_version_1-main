import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react"; // Keep Menu icon here
import "./header.css";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const navigate = useNavigate();

  const toggleDropdown = (section) => {
    setActiveDropdown(activeDropdown === section ? null : section);
  };

  return (
    <>
      {/* Menu Button - fixed at top-left */}
      <button
        onClick={toggleSidebar}
        className="fixed top-5 right-5 bg-blue-700 text-white  p-2 rounded-md z-[10000] shadow-md"
      >
        <Menu size={30} />
      </button>

      {/* Sidebar Panel */}
      <div
        className={`fixed top-0 left-0 z-50 h-full w-64 text-white bg-gray-900 transform transition-transform duration-300 ease-in-out sidebar_1 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Close Button */}
        <button
          onClick={toggleSidebar}
          className="absolute top-2 right-4 text-white focus:outline-none"
        >
          <X size={24} />
        </button>

        {/* Navigation Links */}
        <nav className="mt-16 space-y-4 px-4">
          <button
            className="block py-2 w-full text-left rounded transition-colors duration-200"
            onClick={() => navigate("/")}
          >
            Home
          </button>

          {/* Faculty Dropdown */}
          <div>
            <button
              className="block py-2 w-full text-left rounded transition-colors duration-200"
              onClick={() => toggleDropdown("faculty")}
            >
              Faculty &#9662;
            </button>
            {activeDropdown === "faculty" && (
              <div className="pl-4 mt-2 space-y-2">
                <button
                  onClick={() => navigate("/login")}
                  className="block w-full text-left py-1 rounded"
                >
                  Faculty Login
                </button>
                <button
                  onClick={() => navigate("/facultylist")}
                  className="block w-full text-left py-1 rounded"
                >
                  Faculty Profile
                </button>
                <button
                  onClick={() => navigate("/facultyactivity")}
                  className="block w-full text-left py-1 rounded"
                >
                  Faculty Activities
                </button>
              </div>
            )}
          </div>

          {/* Students Dropdown */}
          <div>
            <button
              className="block py-2 w-full text-left rounded transition-colors duration-200"
              onClick={() => toggleDropdown("students")}
            >
              Students &#9662;
            </button>
            {activeDropdown === "students" && (
              <div className="pl-4 mt-2 space-y-2">
                <button
                  onClick={() => console.log("Courses")}
                  className="block w-full text-left py-1 rounded"
                >
                  Courses
                </button>
                <button
                  onClick={() => console.log("Academic Calendar")}
                  className="block w-full text-left py-1 rounded"
                >
                  Academic Calendar
                </button>
                <button
                  onClick={() => console.log("Exam Schedules")}
                  className="block w-full text-left py-1 rounded"
                >
                  Exam Schedules
                </button>
              </div>
            )}
          </div>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
