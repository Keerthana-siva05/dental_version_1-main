import React, { useState, useEffect } from "react";
import axios from "axios";
import * as XLSX from "xlsx";

const AttendanceForm = () => {
  const [students, setStudents] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [course, setCourse] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  

  const getCurrentYear = (batch) => {
    const currentYear = new Date().getFullYear();
    const batchStartYear = parseInt(batch.split("-")[0]);
    const year = currentYear - batchStartYear + 1;
    return year > 5 ? "Graduated" : `${year}`;
};

useEffect(() => {
  if (!course || !selectedBatch || !month || !year) return;

  setLoading(true);
  setError(null);

  // Fetch attendance data
  axios
    .get("http://localhost:5000/api/attendance", {
      params: { course, batch: selectedBatch, month, year },
    })
    .then((res) => {
      if (res.data && res.data.students.length > 0) {
        setAttendanceData(
          res.data.students.map((student) => ({
            regNumber: student.regNumber,
            name: student.name,
            theoryTotal: student.theory?.total || "",
            theoryAttended: student.theory?.attended || "",
            practicalTotal: student.practical?.total || "",
            practicalAttended: student.practical?.attended || "",
            clinicalTotal: student.clinical?.total || "",
            clinicalAttended: student.clinical?.attended || "",
          }))
        );
      } else {
        fetchStudentDetails();
      }
    })
    .catch((err) => {
      if (err.response?.status === 404) {
        fetchStudentDetails();
      } else {
        setError("Error fetching attendance data.");
        console.error("Error fetching attendance record:", err);
      }
    })
    .finally(() => setLoading(false));
}, [course, selectedBatch, month, year]);

const fetchStudentDetails = () => {
  axios
    .get("http://localhost:5000/api/students", {
      params: { course, batch: selectedBatch },
    })
    .then((studentRes) => {
      if (studentRes.data && studentRes.data.students.length > 0) {
        setStudents(studentRes.data.students);
        setAttendanceData(
          studentRes.data.students.map((student) => ({
            regNumber: student.regNumber,
            name: student.name,
            theoryTotal: "",
            theoryAttended: "",
            practicalTotal: "",
            practicalAttended: "",
            clinicalTotal: "",
            clinicalAttended: "",
          }))
        );
      } else {
        setAttendanceData([]);
      }
    })
    .catch((err) => {
      setError("Error fetching student details.");
      console.error("Error fetching student details:", err);
    });
};  

  const handleTableChange = (id, field, value) => {
    setAttendanceData((prevData) =>
      prevData.map((row) =>
        row.regNumber === id ? { ...row, [field]: value } : row
      )
    );
  };

  const autoFillTotalClasses = (field, value) => {
    setAttendanceData((prevData) =>
      prevData.map((row) => ({ ...row, [field]: Number(value) })));
  };

  const calculatePercentage = (attended, totalClasses) => {
    return totalClasses ? ((attended / totalClasses) * 100).toFixed(2) : "0.00";
  };

  const handleMonthChange = (e) => {
    const selectedMonth = Number(e.target.value);
    setMonth(selectedMonth);

    // Reset attendance data when the month is changed
    setAttendanceData((prevData) =>
      prevData.map((student) => ({
        ...student,
        theoryTotal: "",
        theoryAttended: "",
        practicalTotal: "",
        practicalAttended: "",
        clinicalTotal: "",
        clinicalAttended: "",
      }))
    );
};


const saveToDatabase = async () => {
  console.log("Saving Data:", { course, batch: selectedBatch, month, students: attendanceData });

  try {
      await axios.post("http://localhost:5000/api/attendance/save", {
          course,
          batch: selectedBatch,
          month,
          year,
          students: attendanceData.map((student) => ({
              regNumber: student.regNumber,
              name: student.name,
              theoryTotal: Number(student.theoryTotal) || 0,
              theoryAttended: Number(student.theoryAttended) || 0,
              practicalTotal: Number(student.practicalTotal) || 0,
              practicalAttended: Number(student.practicalAttended) || 0,
              clinicalTotal: Number(student.clinicalTotal) || 0,
              clinicalAttended: Number(student.clinicalAttended) || 0,
          })),
      });

      alert("Attendance saved successfully!");
  } catch (error) {
      console.error("Error saving attendance:", error);
      alert("Error saving attendance. Check console for details.");
  }
};

  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      attendanceData.map((student) => ({
        "Register Number": student.regNumber,
        Name: student.name,
        "Theory (Total)": student.theoryTotal,
        "Theory (Attended)": student.theoryAttended,
        "Theory (%)": calculatePercentage(student.theoryAttended, student.theoryTotal) + "%",
        "Clinical (Total)": student.clinicalTotal,
        "Clinical (Attended)": student.clinicalAttended,
        "Clinical (%)": calculatePercentage(student.clinicalAttended, student.clinicalTotal) + "%",
        "Practical (Total)": student.practicalTotal,
        "Practical (Attended)": student.practicalAttended,
        "Practical (%)": calculatePercentage(student.practicalAttended, student.practicalTotal) + "%",
      }))
    );
  
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");
    XLSX.writeFile(workbook, `Attendance_${course}_${selectedBatch}_${month}.xlsx`);
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
        <label className="block font-semibold mb-1">Batch:</label>
        <select value={selectedBatch} onChange={(e) => setSelectedBatch(e.target.value)} className="w-full p-2 border rounded">
                    <option value="">Select Batch</option>
                    <option value="2022-2026">2022-2026</option>
                    <option value="2021-2025">2021-2025</option>
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


      <div className="overflow-x-auto">
        <table className="w-full border-collapse shadow-lg rounded-lg text-sm">
          <thead>
            <tr className="bg-blue-900 text-white">
              <th className="border p-2">Register Number</th>
              <th className="border p-2">Name</th>
              <th className="p-2 font-bold">Year</th>
              <th className="border p-2">Theory (Total)</th>
              <th className="border p-2">Theory (Attended)</th>
              <th className="border p-2">Theory (%)</th>
              <th className="border p-2">Clinical (Total)</th>
              <th className="border p-2">Clinical (Attended)</th>
              <th className="border p-2">Clinical (%)</th>
              <th className="border p-2">Practical (Total)</th>
              <th className="border p-2">Practical (Attended)</th>
              <th className="border p-2">Practical (%)</th>
            </tr>
          </thead>
          <tbody>
            {attendanceData.map((row, index) => (
              <tr key={row.regNumber} className="odd:bg-gray-100 even:bg-white">
                <td className="border p-2">{row.regNumber}</td>
                <td className="border p-2">{row.name}</td>
                <td className="border p-2">{getCurrentYear(selectedBatch)}</td>
                {/* Theory Total */}
                <td className="border p-2">
                  <input
                    type="number"
                    className="w-full p-1 border rounded"
                    value={row.theoryTotal}
                    onChange={(e) => autoFillTotalClasses("theoryTotal", e.target.value)}
                  />
                </td>
                {/* Theory Attended */}
                <td className="border p-2">
                  <input
                    type="number"
                    className="w-full p-1 border rounded"
                    value={row.theoryAttended}
                    onChange={(e) => handleTableChange(row.regNumber, "theoryAttended", e.target.value)}
                  />
                </td>
                <td className="border p-2">{calculatePercentage(row.theoryAttended, row.theoryTotal)}%</td>

                {/* Clinical Total */}
                <td className="border p-2">
                  <input
                    type="number"
                    className="w-full p-1 border rounded"
                    value={row.clinicalTotal}
                    onChange={(e) => autoFillTotalClasses("clinicalTotal", e.target.value)}
                  />
                </td>
                {/* Clinical Attended */}
                <td className="border p-2">
                  <input
                    type="number"
                    className="w-full p-1 border rounded"
                    value={row.clinicalAttended}
                    onChange={(e) => handleTableChange(row.regNumber, "clinicalAttended", e.target.value)}
                  />
                </td>
                <td className="border p-2">{calculatePercentage(row.clinicalAttended, row.clinicalTotal)}%</td>

                {/* Practical Total */}
                <td className="border p-2">
                  <input
                    type="number"
                    className="w-full p-1 border rounded"
                    value={row.practicalTotal}
                    onChange={(e) => autoFillTotalClasses("practicalTotal", e.target.value)}
                  />
                </td>
                {/* Practical Attended */}
                <td className="border p-2">
                  <input
                    type="number"
                    className="w-full p-1 border rounded"
                    value={row.practicalAttended}
                    onChange={(e) => handleTableChange(row.regNumber, "practicalAttended", e.target.value)}
                  />
                </td>
                <td className="border p-2">{calculatePercentage(row.practicalAttended, row.practicalTotal)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-center mt-6 space-x-4">
        <button onClick={saveToDatabase} className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">Save Attendance</button>
        <button onClick={downloadExcel} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Download Excel</button>
      </div>
      </div>
  );
};

export default AttendanceForm;
