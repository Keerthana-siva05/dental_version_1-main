import React, { useEffect, useState } from "react";
import axios from "axios";

const FacultyActivity = () => {
  const [facultyData, setFacultyData] = useState([]);

  useEffect(() => {
    const fetchFacultyData = async () => {
      try {
        const facultyResponse = await axios.get("http://localhost:5000/api/faculty");
        const facultyList = facultyResponse.data;

        const activitiesResponse = await axios.get("http://localhost:5000/api/faculty-activities/activities");
        const activitiesList = activitiesResponse.data;

        const mergedData = facultyList.map((faculty) => {
          const facultyActivities = activitiesList.find((item) => item.name === faculty.name);
          return {
            ...faculty,
            activities: facultyActivities ? facultyActivities.activities : [],
          };
        });

        setFacultyData(mergedData);
      } catch (error) {
        console.error("Error fetching faculty data:", error);
      }
    };

    fetchFacultyData();
  }, []);

  return (
    <div className="max-w-5xl mx-auto mt-36 p-8 bg-white rounded-lg shadow-lg border-l-8 border-r-8 border-blue-500 font-sans">
      <h1 className="text-center text-3xl font-semibold text-gray-800 uppercase mb-6 border-b-4 border-blue-500 pb-3 tracking-wide">
        Faculty Details
      </h1>
      <div className="flex flex-col gap-5">
        {facultyData.length > 0 ? (
          facultyData.map((faculty, index) => (
            <div
              key={index}
              className="flex flex-col items-start bg-gray-100 p-5 border-l-4 border-blue-500 rounded-lg shadow-md transition-transform transform hover:scale-105 hover:bg-blue-50"
            >
              <h2 className="flex items-center text-xl font-bold text-gray-800">
                <span className="uppercase font-extrabold">{faculty.name}</span>,
                <span className="italic text-gray-600 ml-2">{faculty.designation}</span>
              </h2>
              <ul className="list-disc pl-5 mt-3 text-gray-700">
                {faculty.activities.length > 0 ? (
                  faculty.activities.map((activity, i) => (
                    <li key={i} className="text-base py-1">
                      {activity}
                    </li>
                  ))
                ) : (
                  <li className="text-gray-500">No activities available</li>
                )}
              </ul>
            </div>
          ))
        ) : (
          <p className="text-left text-lg text-gray-500 mt-5">No faculty details available.</p>
        )}
      </div>
    </div>
  );
};

export default FacultyActivity;
