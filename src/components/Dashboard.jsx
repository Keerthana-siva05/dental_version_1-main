import React, { useEffect, useState } from "react";
import { fetchProfile } from "../api/api.js";
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from "recharts";
import { FaUserGraduate, FaTasks, FaCalendarAlt, FaUserMd } from "react-icons/fa";
import Header from "../components/Header";
import Sidebar from "./FacultySidebar";

const Dashboard = () => {
  const [profile, setProfile] = useState({ name: "Faculty Member" });

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const res = await fetchProfile(token);
        setProfile({ name: res.data.name });
      } catch (error) {
        console.error("Error fetching profile", error);
      }
    };
    fetchUserData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const statsData = [
    { name: "Students", value: 250 },
    { name: "Cases", value: 35 },
    { name: "Tasks", value: 5 },
    { name: "Appointments", value: 8 },
  ];

  const pieData = [
    { name: "Completed", value: 70 },
    { name: "Pending", value: 30 },
  ];
  const COLORS = ["#0088FE", "#FFBB28"];

  return (
    <div className="flex flex-col lg:flex-row w-full min-h-screen bg-gray-100 p-4 mt-8">
      <Sidebar />
      <div className="flex flex-col flex-1 space-y-6 p-6">
        <Header onLogout={handleLogout} />
        <section className="bg-blue-900 text-white text-center p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold">Welcome, {profile.name}</h2>
          <p>Manage students, exams, and patient cases efficiently.</p>
        </section>

        {/* Stats Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center space-y-2">
            <FaUserGraduate className="text-blue-900 text-4xl mx-auto" />
            <h3 className="text-lg font-semibold">Total Students</h3>
            <p className="text-gray-700 text-xl">250</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg text-center space-y-2">
            <FaUserMd className="text-blue-900 text-4xl mx-auto" />
            <h3 className="text-lg font-semibold">Patient Cases</h3>
            <p className="text-gray-700 text-xl">35</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg text-center space-y-2">
            <FaTasks className="text-blue-900 text-4xl mx-auto" />
            <h3 className="text-lg font-semibold">Pending Tasks</h3>
            <p className="text-gray-700 text-xl">5</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg text-center space-y-2">
            <FaCalendarAlt className="text-blue-900 text-4xl mx-auto" />
            <h3 className="text-lg font-semibold">Upcoming Appointments</h3>
            <p className="text-gray-700 text-xl">8</p>
          </div>
        </section>

        {/* Charts Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-4 text-center">Student & Case Overview</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={statsData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#2C3E50" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-4 text-center">Task Completion</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie 
                  data={pieData} 
                  cx="50%" 
                  cy="50%" 
                  outerRadius={70} 
                  fill="#8884d8" 
                  dataKey="value"
                  label
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
