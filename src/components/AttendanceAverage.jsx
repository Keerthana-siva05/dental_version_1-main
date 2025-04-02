import React, { useState, useEffect } from "react";
import axios from "axios";

const AttendanceAverage = ({ course, selectedBatch, month, year }) => {
  const [averageAttendance, setAverageAttendance] = useState({
    theory: 0,
    practical: 0,
    clinical: 0,
  });

  useEffect(() => {
    if (!course || !selectedBatch || !month || !year) return;

    axios
      .get("http://localhost:5000/api/attendance", {
        params: { course, batch: selectedBatch, month, year },
      })
      .then((res) => {
        if (res.data && res.data.students.length > 0) {
          const totalStudents = res.data.students.length;
          let totalTheory = 0,
            totalPractical = 0,
            totalClinical = 0;

          res.data.students.forEach((student) => {
            totalTheory +=
              (Number(student.theoryAttended) / Number(student.theoryTotal)) || 0;
            totalPractical +=
              (Number(student.practicalAttended) / Number(student.practicalTotal)) || 0;
            totalClinical +=
              (Number(student.clinicalAttended) / Number(student.clinicalTotal)) || 0;
          });

          setAverageAttendance({
            theory: ((totalTheory / totalStudents) * 100).toFixed(2),
            practical: ((totalPractical / totalStudents) * 100).toFixed(2),
            clinical: ((totalClinical / totalStudents) * 100).toFixed(2),
          });
        }
      })
      .catch((err) => {
        console.error("Error fetching attendance data:", err);
      });
  }, [course, selectedBatch, month, year]);

  return (
    <div className="mt-4 p-4 bg-gray-100 rounded shadow-lg">
      <h3 className="text-lg font-semibold text-center mb-2">Average Attendance</h3>
      <div className="flex justify-around">
        <div className="text-blue-700">Theory: {averageAttendance.theory}%</div>
        <div className="text-green-700">Practical: {averageAttendance.practical}%</div>
        <div className="text-red-700">Clinical: {averageAttendance.clinical}%</div>
      </div>
    </div>
  );
};

export default AttendanceAverage;