import React, { useState, useEffect } from "react";
import axios from "axios";

const AddFaculty = () => {
  const [facultyName, setFacultyName] = useState("");
  const [activities, setActivities] = useState("");

  useEffect(() => {
    const storedName = localStorage.getItem("facultyName");
    if (storedName) {
      setFacultyName(storedName);
    }
  }, []);

  const handleChange = (e) => {
    setActivities(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!activities.trim()) {
      alert("Please enter at least one activity.");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const existingResponse = await axios.get(
        `http://localhost:5000/api/faculty-activities/activities?name=${facultyName}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const existingActivities = existingResponse.data.activities || [];
      const newActivities = activities
        .split("\n")
        .map((activity) => activity.trim())
        .filter((activity) => activity);
      const updatedActivities = [...existingActivities, ...newActivities];

      const response = await axios.put(
        "http://localhost:5000/api/faculty-activities/update-activities",
        { name: facultyName, activities: updatedActivities },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        alert("Activities updated successfully!");
        setActivities("");
      }
    } catch (error) {
      console.error("Error updating activities:", error);
      alert("Failed to update activities.");
    }
  };

  return (
    <div className="w-[90%] max-w-[1000px] mx-auto my-[150px] p-10 bg-gray-100 border-2 border-blue-900 shadow-lg rounded-xl text-center">
      <h1 className="text-2xl font-bold text-blue-900 uppercase tracking-wide border-b-4 border-blue-900 pb-2 inline-block shadow-sm">
        Add Faculty Activities
      </h1>

      <div className="flex items-center justify-center gap-3 bg-blue-100 p-3 rounded-lg my-4">
        <label className="text-lg font-semibold text-blue-900">Faculty Name:</label>
        <span className="text-lg font-bold uppercase bg-blue-200 py-2 px-4 rounded-md text-blue-900">
          {facultyName}
        </span>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <textarea
          name="activities"
          placeholder="Enter activities (one per line)"
          value={activities}
          onChange={handleChange}
          required
          className="w-full h-32 p-4 text-blue-900 bg-white border-2 border-blue-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all"
        ></textarea>

        <button
          type="submit"
          className="bg-blue-900 text-white font-bold py-3 px-6 rounded-lg transition-transform duration-200 hover:bg-blue-700 hover:-translate-y-1 active:scale-95 mx-auto"
        >
          Update Activities
        </button>
      </form>
    </div>
  );
};

export default AddFaculty;
