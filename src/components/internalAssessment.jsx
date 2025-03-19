import React, { useState, useEffect } from "react";
import axios from "axios";

const InternalAssessment = () => {
    const [selectedCourse, setSelectedCourse] = useState("");
    const [selectedBatch, setSelectedBatch] = useState("");
    const [assessmentType, setAssessmentType] = useState("");
    const [students, setStudents] = useState([]);

    // Function to determine student's current year
    const getCurrentYear = (batch) => {
        const currentYear = new Date().getFullYear();
        const batchStartYear = parseInt(batch.split("-")[0]);
        const year = currentYear - batchStartYear + 1;
        return year > 5 ? "Graduated" : `${year} Year`;
    };

    useEffect(() => {
        if (selectedCourse && selectedBatch && assessmentType) {
            axios.get(`http://localhost:5000/api/assessment?course=${selectedCourse}&batch=${selectedBatch}&assessmentType=${assessmentType}`)
                .then(response => {
                    console.log("Fetched Students:", response.data); // Check if totalTheory and totalPractical exist
                    setStudents(response.data);
                })
                .catch(error => console.error("Error fetching students:", error));
        }
    }, [selectedCourse, selectedBatch, assessmentType]);
    
    
    const handleInputChange = (index, field, value) => {
        const updatedStudents = [...students];
        updatedStudents[index][field] = value ? parseInt(value) : 0;
    
        // Recalculate totals
        updatedStudents[index].totalTheory = 
            (updatedStudents[index].theory70 || 0) + 
            (updatedStudents[index].theory20 || 0) + 
            (updatedStudents[index].theory10 || 0);
    
        updatedStudents[index].totalPractical = 
            (updatedStudents[index].practical90 || 0) + 
            (updatedStudents[index].practical10 || 0);
    
        setStudents(updatedStudents);
    };
    

    const handleAssessmentChange = (event) => {
        setAssessmentType(event.target.value);
    
        // Fetch new data when assessment type changes
        axios.get(`http://localhost:5000/api/assessment?course=${selectedCourse}&batch=${selectedBatch}&assessmentType=${event.target.value}`)
            .then(response => {
                if (response.data.length > 0) {
                    setStudents(response.data);
                } else {
                    // If no assessment data is found, reset only the marks
                    setStudents(students.map(student => ({
                        ...student,
                        theory70: "",
                        theory20: "",
                        theory10: "",
                        practical90: "",
                        practical10: "",
                        totalTheory: "",
                        totalPractical: ""
                    })));
                }
            })
            .catch(error => console.error("Error fetching assessments:", error));
    };
    

    const downloadCSV = () => {
        const csvContent = [
            ["Reg. No", "Name", "Year", "Assessment Type", "Theory (70)", "Theory (20)", "Theory (10)", "Total Theory", "Practical (90)", "Practical (10)", "Total Practical"],
            ...students.map(student => [
                student.regNumber,
                student.name,
                getCurrentYear(selectedBatch),
                assessmentType,
                student.theory70 || "",
                student.theory20 || "",
                student.theory10 || "",
                student.totalTheory || "",
                student.practical90 || "",
                student.practical10 || "",
                student.totalPractical || ""
            ].join(","))
        ].join("\n");
    
        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `assessment_${selectedBatch}_${assessmentType}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };
    

    const saveAssessment = () => {
        students.forEach(student => {
            axios.post("http://localhost:5000/api/assessment/save", {
                regNumber: student.regNumber,
                assessmentType,
                theory70: student.theory70,
                theory20: student.theory20,
                theory10: student.theory10,
                practical90: student.practical90,
                practical10: student.practical10,
            })
            .then(() => alert("Assessment saved successfully"))
            .catch(error => console.error("Error saving assessment:", error));
        });
    };

    return (
        <div className="p-8 bg-gray-100 min-h-screen mt-16">
            <h1 className="text-3xl font-bold text-center mb-6 mt-5">
                Internal Assessment
            </h1>

            {/* Dropdowns for Course, Batch, and Assessment Type */}
            <div className="flex gap-4 mb-6">
                <select value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)} className="p-2 border rounded">
                    <option value="">Select Course</option>
                    <option value="BDS">BDS</option>
                    <option value="MDS">MDS</option>
                </select>

                <select value={selectedBatch} onChange={(e) => setSelectedBatch(e.target.value)} className="p-2 border rounded">
                    <option value="">Select Batch</option>
                    <option value="2022-2026">2022-2026</option>
                    <option value="2021-2025">2021-2025</option>
                </select>

                <select value={assessmentType} onChange={handleAssessmentChange}>
                <option value="">Select Assessment</option>
                <option value="Assessment I">Internal Assessment I</option>
                <option value="Assessment II">Internal Assessment II</option>
            </select>
            </div>

            {students.length > 0 && (
                <table className="w-full border-collapse border border-gray-300 text-center">
                    <thead className="bg-purple-900 text-white">
                        <tr>
                            <th className="p-2">Reg. No</th>
                            <th className="p-2">Name</th>
                            <th className="p-2">Year</th>
                            <th className="p-2">Theory (70)</th>
                            <th className="p-2">Theory (20)</th>
                            <th className="p-2">Theory (10)</th>
                            <th className="p-2 bg-green-500">Total Theory</th>
                            <th className="p-2">Practical (90)</th>
                            <th className="p-2">Practical (10)</th>
                            <th className="p-2 bg-blue-500">Total Practical</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map((student, index) => (
                            <tr key={index} className="border-b">
                                <td className="p-2">{student.regNumber}</td>
                                <td className="p-2">{student.name}</td>
                                <td className="p-2 font-bold">{getCurrentYear(selectedBatch)}</td>
                                <td className="p-2">
                                    <input type="number" value={student.theory70 || ""} 
                                        onChange={(e) => handleInputChange(index, "theory70", e.target.value)} 
                                        className="w-16 p-1 border rounded text-center" />
                                </td>
                                <td className="p-2">
                                    <input type="number" value={student.theory20 || ""} 
                                        onChange={(e) => handleInputChange(index, "theory20", e.target.value)} 
                                        className="w-16 p-1 border rounded text-center" />
                                </td>
                                <td className="p-2">
                                    <input type="number" value={student.theory10 || ""} 
                                        onChange={(e) => handleInputChange(index, "theory10", e.target.value)} 
                                        className="w-16 p-1 border rounded text-center" />
                                </td>
                                <td className="p-2 font-bold bg-green-200">{student.totalTheory}</td>
                                <td className="p-2">
                                    <input type="number" value={student.practical90 || ""} 
                                        onChange={(e) => handleInputChange(index, "practical90", e.target.value)} 
                                        className="w-16 p-1 border rounded text-center" />
                                </td>
                                <td className="p-2">
                                    <input type="number" value={student.practical10 || ""} 
                                        onChange={(e) => handleInputChange(index, "practical10", e.target.value)} 
                                        className="w-16 p-1 border rounded text-center" />
                                </td>
                                <td className="p-2 font-bold bg-blue-200">{student.totalPractical}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

<div className="flex justify-center space-x-4 mt-4">
    <button onClick={saveAssessment} className="bg-blue-500 text-white px-4 py-2 rounded">
        Save Assessment
    </button>
    <button onClick={downloadCSV} className="bg-green-500 text-white px-4 py-2 rounded">
        Download CSV
    </button>
</div>
        </div>
    );
};

export default InternalAssessment;