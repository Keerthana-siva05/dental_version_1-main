import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import FacultySidebar from "./components/FacultySidebar"; 
import Home from "./pages/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import Profile from "./components/Profile";
import Facultyactivity from "./components/Facultyactivity";
import FacultyList from "./components/FacultyList";
import AddFaculty from "./components/AddFaculty";
import AttendanceForm from "./components/AttendanceForm";
import About from "./components/About";
import Services from "./components/Services";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

import "./app.css"; // Global styles

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isFacultySidebarOpen, setIsFacultySidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, [location.pathname]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleFacultySidebar = () => {
    setIsFacultySidebarOpen(!isFacultySidebarOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setIsFacultySidebarOpen(false);
    navigate("/login");
  };

  const handleLogin = () => setIsAuthenticated(true);

  const sidebarPages = ["/", "/facultyactivity", "/facultylist"];
  const facultySidebarPages = ["/dashboard", "/profile", "/attendance", "/faculty"];

  return (
    <div className="relative min-h-screen bg-gray-100">
      <Header
        isAuthenticated={isAuthenticated}
        onLogout={isAuthenticated ? handleLogout : null}
        toggleSidebar={toggleSidebar}
      />

      {sidebarPages.includes(location.pathname) && (
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      )}

      {isAuthenticated && facultySidebarPages.includes(location.pathname) && (
        <FacultySidebar isOpen={isFacultySidebarOpen} toggleSidebar={toggleFacultySidebar} />
      )}

      <main className="pt-16 transition-all duration-300 ease-in-out">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} />} />
          <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Register />} />
          <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} />
          <Route path="/attendance" element={isAuthenticated ? <AttendanceForm /> : <Navigate to="/login" />} />
          <Route path="/faculty" element={isAuthenticated ? <AddFaculty /> : <Navigate to="/login" />} />
          <Route path="/facultyactivity" element={<Facultyactivity />} />
          <Route path="/facultylist" element={<FacultyList />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
};

export default App;