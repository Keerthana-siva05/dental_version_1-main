import React, { useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { useNavigate } from "react-router-dom";

const AverageAttendance = () => {
  // Form state
  const [course, setCourse] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("");
  const [startMonth, setStartMonth] = useState(1);
  const [startYear, setStartYear] = useState(new Date().getFullYear());
  const [endMonth, setEndMonth] = useState(new Date().getMonth() + 1);
  const [endYear, setEndYear] = useState(new Date().getFullYear());
  
  // Results and status
  const [averageData, setAverageData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const navigate = useNavigate();

  const calculateAverage = async () => {
    // Validate inputs
    if (!course || !selectedBatch) {
      alert("Please select course and batch first");
      return;
    }

    if (startYear > endYear || (startYear === endYear && startMonth > endMonth)) {
      alert("End date must be after start date");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSaveSuccess(false);
      
      const response = await axios.get("http://localhost:5000/api/attendance/average", {
        params: { 
          course, 
          batch: selectedBatch, 
          startMonth, 
          endMonth, 
          startYear,
          endYear
        }
      });
      
      setAverageData(response.data);
    } catch (error) {
      setError("Error calculating averages");
      console.error("Error calculating averages:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveAveragesToDB = async () => {
    if (!averageData.length) {
      alert("No data to save. Please calculate averages first.");
      return;
    }

    try {
      setLoading(true);
      
      await axios.post("http://localhost:5000/api/attendance/save-averages", {
        course,
        batch: selectedBatch,
        startMonth,
        endMonth,
        startYear,
        endYear,
        averages: averageData
      });
      
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      setError("Error saving averages to database");
      console.error("Error saving averages:", error);
    } finally {
      setLoading(false);
    }
  };

  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      averageData.map((student) => ({
        "Register Number": student.regNumber,
        "Name": student.name,
        "Theory (%)": student.theoryPercentage + "%",
        "Practical (%)": student.practicalPercentage + "%",
        "Clinical (%)": student.clinicalPercentage + "%",
        "Overall Average (%)": student.averageAttendance + "%",
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Average Attendance");
    XLSX.writeFile(
      workbook,
      `Average_Attendance_${course}_${selectedBatch}_${startMonth}-${startYear}_to_${endMonth}-${endYear}.xlsx`
    );
  };

  // Generate year options (current year ± 2 years)
  const yearOptions = () => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);
  };

  return (
    <div className="max-w-6xl mx-auto mt-10 p-8 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold text-blue-900 mb-4 text-center">
        Average Attendance Calculator
      </h2>
      
      <button 
        onClick={() => navigate("/attendance")}
        className="mb-6 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
      >
        Back to Attendance
      </button>

      <div className="flex justify-between items-center space-x-6 mb-6">
        <div className="flex-1">
          <label className="block font-semibold mb-1">Course:</label>
          <select 
            className="w-full p-2 border rounded" 
            value={course} 
            onChange={(e) => setCourse(e.target.value)}
            required
          >
            <option value="">Select Course</option>
            <option value="BDS">BDS</option>
            <option value="MDS">MDS</option>
          </select>
        </div>
        <div className="flex-1">
          <label className="block font-semibold mb-1">Batch:</label>
          <select 
            className="w-full p-2 border rounded" 
            value={selectedBatch} 
            onChange={(e) => setSelectedBatch(e.target.value)}
            required
          >
            <option value="">Select Batch</option>
            <option value="2022-2026">2022-2026</option>
            <option value="2021-2025">2021-2025</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-3">Start Period</h3>
          <div className="mb-3">
            <label className="block font-medium mb-1">Month:</label>
            <select 
              className="w-full p-2 border rounded" 
              value={startMonth}
              onChange={(e) => setStartMonth(Number(e.target.value))}
              required
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {new Date(0, i).toLocaleString("en", { month: "long" })}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-medium mb-1">Year:</label>
            <select
              className="w-full p-2 border rounded"
              value={startYear}
              onChange={(e) => setStartYear(Number(e.target.value))}
              required
            >
              {yearOptions().map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-3">End Period</h3>
          <div className="mb-3">
            <label className="block font-medium mb-1">Month:</label>
            <select 
              className="w-full p-2 border rounded" 
              value={endMonth}
              onChange={(e) => setEndMonth(Number(e.target.value))}
              required
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {new Date(0, i).toLocaleString("en", { month: "long" })}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-medium mb-1">Year:</label>
            <select
              className="w-full p-2 border rounded"
              value={endYear}
              onChange={(e) => setEndYear(Number(e.target.value))}
              required
            >
              {yearOptions().map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="flex justify-center space-x-4 mb-6">
        <button 
          onClick={calculateAverage}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:bg-blue-300"
          disabled={loading}
        >
          {loading ? "Calculating..." : "Calculate Average"}
        </button>
        
        {averageData.length > 0 && (
          <button 
            onClick={saveAveragesToDB}
            className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700 disabled:bg-purple-300"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save to Database"}
          </button>
        )}
      </div>

      {saveSuccess && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded text-center">
          Averages saved successfully!
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-center">
          {error}
        </div>
      )}

      {averageData.length > 0 && (
        <>
          <h3 className="text-xl font-semibold mb-4 text-center">
            Average Attendance from {new Date(startYear, startMonth - 1).toLocaleString("en", { month: "long" })} {startYear} to {new Date(endYear, endMonth - 1).toLocaleString("en", { month: "long" })} {endYear}
          </h3>
          
          <div className="overflow-x-auto mb-6">
            <table className="w-full border-collapse shadow-lg rounded-lg text-sm">
              <thead>
                <tr className="bg-purple-800 text-white">
                  <th className="border p-2">Register Number</th>
                  <th className="border p-2">Name</th>
                  <th className="border p-2">Theory (%)</th>
                  <th className="border p-2">Practical (%)</th>
                  <th className="border p-2">Clinical (%)</th>
                  <th className="border p-2">Overall (%)</th>
                </tr>
              </thead>
              <tbody>
                {averageData.map((student) => (
                  <tr key={student.regNumber} className="odd:bg-gray-100 even:bg-white">
                    <td className="border p-2">{student.regNumber}</td>
                    <td className="border p-2">{student.name}</td>
                    <td className="border p-2">{student.theoryPercentage}%</td>
                    <td className="border p-2">{student.practicalPercentage}%</td>
                    <td className="border p-2">{student.clinicalPercentage}%</td>
                    <td className="border p-2 font-semibold">{student.averageAttendance}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-center">
            <button 
              onClick={downloadExcel}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Download Excel
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default AverageAttendance;