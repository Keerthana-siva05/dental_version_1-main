// models/Patient.js
import mongoose from "mongoose";

const PatientSchema = new mongoose.Schema({
  // Patient info
  name: { type: String, required: true },
  serialNo: { type: String },
  orthoNo: { type: String },
  opNo: { type: String, required: true },
  age: { type: Number },
  
  // Student info
  studentId: { type: mongoose.Schema.Types.ObjectId, required: true },
  studentName: { type: String, required: true },
  studentRegNo: { type: String, required: true },
  
  // Faculty review
  isCompleted: { type: Boolean, default: false },
  facultyComments: { type: String },
  reviewedBy: { type: mongoose.Schema.Types.ObjectId },
  reviewedAt: { type: Date },
  
  // Other fields
  createdAt: { type: Date, default: Date.now }
});

// Static method to generate dummy data
PatientSchema.statics.generateDummyData = async function(count = 10) {
  const students = [
    { id: new mongoose.Types.ObjectId(), name: "Rahul Sharma", regNo: "20BCE1001" },
    { id: new mongoose.Types.ObjectId(), name: "Priya Patel", regNo: "20BCE1002" },
    { id: new mongoose.Types.ObjectId(), name: "Amit Singh", regNo: "20BCE1003" },
    { id: new mongoose.Types.ObjectId(), name: "Neha Gupta", regNo: "20BCE1004" },
    { id: new mongoose.Types.ObjectId(), name: "Vikram Joshi", regNo: "20BCE1005" }
  ];

  const patientNames = [
    "Arun Kumar", "Deepak Verma", "Sunita Reddy", "Karthik M", "Anjali Nair",
    "Mohammed Ali", "Sneha R", "Prakash T", "Divya S", "Rajesh K"
  ];

  const dummyPatients = [];
  
  for (let i = 0; i < count; i++) {
    const randomStudent = students[Math.floor(Math.random() * students.length)];
    const randomStatus = Math.random() > 0.5;
    
    dummyPatients.push({
      name: patientNames[i % patientNames.length],
      serialNo: `SN${1000 + i}`,
      orthoNo: `ON${2000 + i}`,
      opNo: `OP${3000 + i}`,
      age: Math.floor(Math.random() * 50) + 10,
      studentId: randomStudent.id,
      studentName: randomStudent.name,
      studentRegNo: randomStudent.regNo,
      isCompleted: randomStatus,
      facultyComments: randomStatus ? "Case completed successfully" : "",
      reviewedAt: randomStatus ? new Date() : null
    });
  }

  await this.deleteMany({}); // Clear existing data
  return this.insertMany(dummyPatients);
};

const Patient = mongoose.model("Patient", PatientSchema);
export default Patient;