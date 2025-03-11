import React, { useState, useEffect } from "react";
import axios from "axios";
import * as XLSX from "xlsx";

const AttendanceForm = () => {
  const [students, setStudents] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [course, setCourse] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  useEffect(() => {
    if (course && selectedYear) {
      axios
        .get(
          `http://localhost:5000/api/attendance/students?course=${course}&year=${selectedYear}`
        )
        .then((res) => {
          setStudents(res.data);
          setAttendanceData(
            res.data.map((student) => ({
              ...student,
              totalClasses: "",
              attended: "",
            }))
          );
        })
        .catch((err) => console.error("Error fetching students:", err));
    }
  }, [course, selectedYear]);

  const handleTableChange = (id, field, value) => {
    setAttendanceData((prevData) =>
      prevData.map((row) =>
        row.regNumber === id ? { ...row, [field]: value } : row
      )
    );
  };

  const autoFillTotalClasses = (value) => {
    setAttendanceData((prevData) =>
      prevData.map((row) => ({ ...row, totalClasses: Number(value) }))
    );
  };

  const calculatePercentage = (attended, totalClasses) => {
    return totalClasses ? ((attended / totalClasses) * 100).toFixed(2) : "0.00";
  };

  const handleMonthChange = (e) => {
    const newMonth = parseInt(e.target.value);
    setMonth(newMonth);
    setAttendanceData((prevData) =>
      prevData.map((student) => ({
        ...student,
        totalClasses: "",
        attended: "",
      }))
    );
  };

  const saveToDatabase = async () => {
    try {
      await axios.post("http://localhost:5000/api/attendance/save", {
        course,
        year,
        month,
        students: attendanceData.map((student) => ({
          regNumber: student.regNumber,
          name: student.name,
          totalClasses: Number(student.totalClasses) || 0,
          attended: Number(student.attended) || 0,
        })),
      });
      alert("Attendance saved successfully!");
    } catch (error) {
      alert("Error saving attendance. Check console for details.");
    }
  };

  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      attendanceData.map((student) => ({
        "Register Number": student.regNumber,
        Name: student.name,
        "Total Classes": student.totalClasses,
        "Total Attended": student.attended,
        "Attendance (%)": calculatePercentage(student.attended, student.totalClasses) + "%",
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");
    XLSX.writeFile(workbook, `Attendance_${course}_${selectedYear}_${month}.xlsx`);
  };

  return (
    <div className="max-w-6xl mx-auto mt-10 p-8 bg-white shadow-lg rounded-lg mt-16">
      <h2 className="text-2xl font-semibold text-blue-900 mb-4 text-center">
        Students Attendance Entry
      </h2>

      <div className="flex justify-between items-center space-x-6 mb-6">
        <div className="flex-1">
          <label className="block font-semibold mb-1">Course:</label>
          <select className="w-full p-2 border rounded" onChange={(e) => setCourse(e.target.value)}>
            <option value="">Select Course</option>
            <option value="BDS">BDS</option>
            <option value="MDS">MDS</option>
          </select>
        </div>

        <div className="flex-1">
          <label className="block font-semibold mb-1">Year:</label>
          <select className="w-full p-2 border rounded" onChange={(e) => setSelectedYear(e.target.value)}>
            <option value="">Select Year</option>
            <option value="1st Year">1st Year</option>
            <option value="2nd Year">2nd Year</option>
            <option value="3rd Year">3rd Year</option>
            <option value="4th Year">4th Year</option>
          </select>
        </div>

        <div className="flex-1">
          <label className="block font-semibold mb-1">Month:</label>
          <select className="w-full p-2 border rounded" onChange={handleMonthChange} value={month}>
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {new Date(0, i).toLocaleString("en", { month: "long" })}
              </option>
            ))}
          </select>
        </div>
      </div>

      <table className="w-full border-collapse shadow-lg rounded-lg">
        <thead>
          <tr className="bg-blue-900 text-white">
            <th className="border p-3">Register Number</th>
            <th className="border p-3">Name</th>
            <th className="border p-3">Total Classes</th>
            <th className="border p-3">Total Attended</th>
            <th className="border p-3">Attendance (%)</th>
          </tr>
        </thead>
        <tbody>
          {attendanceData.map((row) => (
            <tr key={row.regNumber} className="odd:bg-gray-100 even:bg-white">
              <td className="border p-3">{row.regNumber}</td>
              <td className="border p-3">{row.name}</td>
              <td className="border p-3">
                <input type="number" className="w-full p-2 border rounded" value={row.totalClasses} onChange={(e) => autoFillTotalClasses(e.target.value)} />
              </td>
              <td className="border p-3">
                <input type="number" className="w-full p-2 border rounded" value={row.attended} onChange={(e) => handleTableChange(row.regNumber, "attended", e.target.value)} />
              </td>
              <td className="border p-3">{calculatePercentage(row.attended, row.totalClasses)}%</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-center mt-6 space-x-4">
        <button onClick={saveToDatabase} className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">Save Attendance</button>
        <button onClick={downloadExcel} className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">Download Excel</button>
      </div>
    </div>
  );
};

export default AttendanceForm;
