import { useEffect, useState } from "react";
import axios from "axios";

const FacultyList = () => {
  const [faculty, setFaculty] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/faculty")
      .then((response) => setFaculty(response.data))
      .catch((error) => console.error("Error fetching faculty data:", error));
  }, []);

  return (
    <div className="w-[1100px] mx-auto mt-28 bg-gray-100 p-8 rounded-lg shadow-lg border border-gray-300">
      <h2 className="text-center mb-6 text-2xl font-semibold uppercase text-gray-800">Faculties</h2>
      <table className="w-full border-collapse bg-white rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-blue-900 text-white text-lg">
            <th className="py-3 px-4">Photo</th>
            <th className="py-3 px-4">Name</th>
            <th className="py-3 px-4">Contact No.</th>
          </tr>
        </thead>
        <tbody>
          {faculty.length > 0 ? (
            faculty.map((member, index) => (
              <>
                {index === 0 || faculty[index - 1].designation !== member.designation ? (
                  <tr key={`header-${member._id}`} className="bg-gray-200">
                    <td colSpan="3" className="py-3 px-4 text-center font-bold text-black uppercase tracking-wide">
                      {member.designation}
                    </td>
                  </tr>
                ) : null}

                <tr key={member._id} className="hover:bg-blue-200 transition">
                  <td className="py-3 px-4">
                  <img
  src={member.profileImage ? `http://localhost:5000${member.profileImage}` : "/default-profile.jpg"}
  alt={member.name}
  className="w-24 h-28 object-cover rounded-md border-2 border-blue-800 p-1 transition-transform transform hover:scale-105 shadow-md"
  onError={(e) => (e.target.src = "/default-profile.jpg")}
/>
                  </td>
                  <td className="py-3 px-4 text-lg font-semibold text-gray-800">{member.name}</td>
                  <td className="py-3 px-4 text-gray-600">
                  {member.contactNumber?.startsWith("+") ? member.contactNumber : `+91 ${member.contactNumber || ""}`}

                  </td>
                </tr>
              </>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="py-4 text-center text-gray-600">No faculty members found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default FacultyList;