import React, { useState, useEffect } from "react";
import axios from "axios";

const AddFaculty = () => {
  const [facultyName, setFacultyName] = useState("");
  const [activities, setActivities] = useState("");
  const [storedActivities, setStoredActivities] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    const storedName = localStorage.getItem("facultyName");
    if (storedName) {
      setFacultyName(storedName);
      fetchActivities(storedName);
    }
  }, []);

  // ✅ Fetch activities for the logged-in faculty
  const fetchActivities = async (name) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/faculty-activities/activities", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Filter the response to get only the logged-in faculty's activities
      const facultyData = response.data.find((faculty) => faculty.name === name);
      setStoredActivities(facultyData ? facultyData.activities : []);
    } catch (error) {
      console.error("Error fetching activities:", error);
    }
  };

  // ✅ Handle Edit
  const handleEdit = (index) => {
    setActivities(storedActivities[index]);
    setEditIndex(index);
  };

  // ✅ Handle Delete
  const handleDelete = async (index) => {
    const updatedActivities = storedActivities.filter((_, i) => i !== index);
    await updateActivities(updatedActivities);
  };

  // ✅ Handle Submit (Add or Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!activities.trim()) {
      alert("Please enter an activity.");
      return;
    }

    let updatedActivities = [...storedActivities];

    if (editIndex !== null) {
      updatedActivities[editIndex] = activities.trim();
    } else {
      updatedActivities.push(activities.trim());
    }

    await updateActivities(updatedActivities);
    setActivities("");
    setEditIndex(null);
  };

  // ✅ Update activities in the database
  const updateActivities = async (updatedActivities) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        "http://localhost:5000/api/faculty-activities/update-activities",
        { name: facultyName, activities: updatedActivities },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        setStoredActivities(updatedActivities);
        alert("Activities updated successfully!");
      }
    } catch (error) {
      console.error("Error updating activities:", error);
      alert("Failed to update activities.");
    }
  };

  return (
    <div className="w-[90%] max-w-[1000px] mx-auto my-[150px] p-10 bg-gray-100 border-2 border-blue-900 shadow-lg rounded-xl text-center">
      <h1 className="text-2xl font-bold text-blue-900 uppercase tracking-wide border-b-4 border-blue-900 pb-2 inline-block shadow-sm">
        Add / Edit Faculty Activities
      </h1>

      <div className="flex items-center justify-center gap-3 bg-blue-100 p-3 rounded-lg my-4">
        <label className="text-lg font-semibold text-blue-900">Faculty Name:</label>
        <span className="text-lg font-bold uppercase bg-blue-200 py-2 px-4 rounded-md text-blue-900">
          {facultyName}
        </span>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <textarea
          placeholder="Enter activities..."
          value={activities}
          onChange={(e) => setActivities(e.target.value)}
          required
          className="w-full h-32 p-4 text-blue-900 bg-white border-2 border-blue-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all"
        ></textarea>

        <button
          type="submit"
          className="bg-blue-900 text-white font-bold py-3 px-6 rounded-lg transition-transform duration-200 hover:bg-blue-700 hover:-translate-y-1 active:scale-95 mx-auto"
        >
          {editIndex !== null ? "Update Activity" : "Add Activity"}
        </button>
      </form>

      {/* ✅ Display Activities */}
      <div className="mt-6">
        <h2 className="text-xl font-bold text-blue-900 border-b-2 border-blue-900 pb-2">Stored Activities</h2>
        <ul className="mt-4">
          {storedActivities.map((activity, index) => (
            <li key={index} className="bg-white p-3 border border-blue-900 rounded-lg flex justify-between items-center my-2">
              <span>{activity}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(index)}
                  className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(index)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AddFaculty;
