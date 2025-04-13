import React, { useState, useEffect } from "react";
import axios from "axios";

const Profile = () => {
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "",
    designation: "",
    contactNumber: "",
    profileImage: "",
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(response.data);
        setFormData({
          name: response.data.name || "",
          email: response.data.email || "",
          department: response.data.department || "",
          designation: response.data.designation || "",
          contactNumber: response.data.contactNumber || "",
          profileImage: response.data.profileImage || "",
        });
      } catch (error) {
        setError("Failed to fetch profile.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    let validationErrors = {};

    if (!formData.department.trim()) {
      validationErrors.department = "Department is required.";
    } else if (/\d/.test(formData.department)) {
      validationErrors.department = "Department cannot contain numbers.";
    }

    if (!formData.designation.trim()) {
      validationErrors.designation = "Designation is required.";
    } else if (/\d/.test(formData.designation)) {
      validationErrors.designation = "Designation cannot contain numbers.";
    }

    if (!/^\d{10}$/.test(formData.contactNumber)) {
      validationErrors.contactNumber = "Enter a valid 10-digit mobile number.";
    }

    if (!formData.profileImage) {
      validationErrors.profileImage = "Profile image is required.";
    }

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await axios.put("http://localhost:5000/api/auth/update-profile", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(response.data);
      alert("Profile updated successfully!");
    } catch (error) {
      setError("Failed to update profile.");
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    const formData = new FormData();
    formData.append("profileImage", file);
  
    try {
      const res = await fetch("http://localhost:5000/api/auth/upload-image", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });
  
      const data = await res.json();
      if (res.ok) {
        setFormData({ ...formData, profileImage: data.profileImage });
      } else {
        console.error("Error:", data.message);
      }
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
  
  if (error) return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative max-w-md" role="alert">
        <strong className="font-bold">Error! </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mt-10">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-900 to-indigo-700 px-6 py-8 text-center">
            <h1 className="text-3xl font-bold text-white">Profile Settings</h1>
            <p className="mt-2 text-blue-100">Update your personal information</p>
          </div>

          {/* Main Content */}
          <div className="px-6 py-8 sm:px-10">
            {/* Profile Picture Section */}
            <div className="flex flex-col items-center mb-8">
              <div className="relative group">
                {formData.profileImage ? (
                  <img 
                    src={`http://localhost:5000${formData.profileImage}`} 
                    alt="Profile" 
                    className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center border-4 border-white shadow-lg">
                    <svg className="w-16 h-16 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
                <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition duration-200 transform hover:scale-105 shadow-md">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageUpload} 
                    className="hidden" 
                  />
                </label>
              </div>
              {errors.profileImage && (
                <p className="mt-2 text-sm text-red-600">{errors.profileImage}</p>
              )}
            </div>

            {/* Profile Form */}
            <form onSubmit={handleUpdate} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {/* Name Field */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    />
                  </div>
                </div>

                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <div className="mt-1">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      disabled
                      className="block w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-100 text-gray-600 cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Department Field */}
                <div>
                  <label htmlFor="department" className="block text-sm font-medium text-gray-700">
                    Department
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="department"
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      className="block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    />
                    {errors.department && (
                      <p className="mt-1 text-sm text-red-600">{errors.department}</p>
                    )}
                  </div>
                </div>

                {/* Designation Field */}
                <div>
                  <label htmlFor="designation" className="block text-sm font-medium text-gray-700">
                    Designation
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="designation"
                      name="designation"
                      value={formData.designation}
                      onChange={handleChange}
                      className="block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    />
                    {errors.designation && (
                      <p className="mt-1 text-sm text-red-600">{errors.designation}</p>
                    )}
                  </div>
                </div>

                {/* Contact Number Field */}
                <div className="sm:col-span-2">
                  <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700">
                    Contact Number
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 flex items-center">
                      <label htmlFor="country" className="sr-only">Country</label>
                      <div className="h-full py-0 pl-3 pr-2 border-r border-gray-300 bg-gray-50 flex items-center justify-center text-gray-500 sm:text-sm">
                        +91
                      </div>
                    </div>
                    <input
                      type="text"
                      id="contactNumber"
                      name="contactNumber"
                      value={formData.contactNumber}
                      onChange={handleChange}
                      maxLength="10"
                      placeholder="9876543210"
                      className="block w-full px-4 py-3 pl-16 rounded-lg border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    />
                  </div>
                  {errors.contactNumber && (
                    <p className="mt-1 text-sm text-red-600">{errors.contactNumber}</p>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200 transform hover:scale-[1.01]"
                >
                  Update Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;