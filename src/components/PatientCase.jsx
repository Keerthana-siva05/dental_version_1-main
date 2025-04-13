// FacultyPatientDashboard.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Eye, Edit, Check, X, Database } from "lucide-react";

const FacultyPatientDashboard = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();

  const fetchPatients = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/patients");
      setPatients(response.data);
    } catch (error) {
      console.error("Error fetching patients:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleStatusUpdate = async (patientId, isCompleted) => {
    try {
      await axios.patch(`http://localhost:5000/api/patients/${patientId}`, {
        isCompleted,
        facultyComments: isCompleted ? "Case reviewed and approved" : "Needs revision"
      });
      fetchPatients(); // Refresh data
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const generateDummyData = async () => {
    try {
      setLoading(true);
      await axios.post("http://localhost:5000/api/patients/generate-dummy-data", {
        count: 15
      });
      fetchPatients(); // Refresh data
    } catch (error) {
      console.error("Error generating dummy data:", error);
    }
  };

  // Group patients by student
  const studentsWithCases = patients.reduce((acc, patient) => {
    const existing = acc.find(s => s.studentId === patient.studentId);
    if (existing) {
      existing.cases.push(patient);
    } else {
      acc.push({
        studentId: patient.studentId,
        studentName: patient.studentName,
        studentRegNo: patient.studentRegNo,
        cases: [patient]
      });
    }
    return acc;
  }, []);

  // Apply filter
  const filteredStudents = studentsWithCases.map(student => ({
    ...student,
    cases: student.cases.filter(patient => 
      filter === "all" || 
      (filter === "completed" && patient.isCompleted) || 
      (filter === "incomplete" && !patient.isCompleted)
    )
  })).filter(student => student.cases.length > 0);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-12">
      <div className="flex justify-between items-center mb-8 mt-10">
        <h1 className="text-3xl font-bold text-gray-800">Patient Case Review</h1>
        <button
          onClick={generateDummyData}
          className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
        >
          <Database className="w-5 h-5 mr-2" />
          Generate Test Data
        </button>
      </div>

      {/* Filter controls */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-md ${filter === "all" ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          All Cases
        </button>
        <button
          onClick={() => setFilter("completed")}
          className={`px-4 py-2 rounded-md ${filter === "completed" ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
        >
          Completed
        </button>
        <button
          onClick={() => setFilter("incomplete")}
          className={`px-4 py-2 rounded-md ${filter === "incomplete" ? 'bg-yellow-500 text-white' : 'bg-gray-200'}`}
        >
          Incomplete
        </button>
      </div>

      {/* Cases table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden ">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reg No</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cases</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student) => (
                <React.Fragment key={student.studentId}>
                  {student.cases.map((patient, idx) => (
                    <tr key={patient._id} className="hover:bg-gray-50">
                      {idx === 0 && (
                        <>
                          <td className="px-6 py-4 whitespace-nowrap" rowSpan={student.cases.length}>
                            <div className="font-medium text-gray-900">{student.studentName}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap" rowSpan={student.cases.length}>
                            <div className="text-gray-500">{student.studentRegNo}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap" rowSpan={student.cases.length}>
                            <div className="font-semibold">{student.cases.length}</div>
                          </td>
                        </>
                      )}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium">{patient.name}</div>
                        <div className="text-sm text-gray-500">OP: {patient.opNo}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {patient.isCompleted ? (
                          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                            Completed
                          </span>
                        ) : (
                          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                            Pending Review
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap space-x-2">
                        <button
                          onClick={() => navigate(`/patient/${patient._id}`)}
                          className="text-blue-600 hover:text-blue-900 p-1"
                          title="View"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => navigate(`/update/${patient._id}`)}
                          className="text-indigo-600 hover:text-indigo-900 p-1"
                          title="Edit"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        {!patient.isCompleted ? (
                          <button
                            onClick={() => handleStatusUpdate(patient._id, true)}
                            className="text-green-600 hover:text-green-900 p-1"
                            title="Mark Complete"
                          >
                            <Check className="w-5 h-5" />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleStatusUpdate(patient._id, false)}
                            className="text-red-600 hover:text-red-900 p-1"
                            title="Mark Incomplete"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                  No patient cases found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FacultyPatientDashboard;