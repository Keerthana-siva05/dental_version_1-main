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
  

  if (loading) return <p className="text-orange-600 text-lg font-semibold text-center">Loading...</p>;
  if (error) return <p className="text-red-600 text-center">{error}</p>;

  return (
    <div className="w-[90%] max-w-xl mx-auto bg-blue-200 p-6 rounded-lg shadow-lg mt-20">

      <h2 className="text-xl font-semibold text-blue-900 uppercase mb-4 text-center">Profile</h2>

      {/* Profile Image Upload Section */}
      <div className="flex flex-col items-center mb-1">
        {formData.profileImage ? (
          <img src={`http://localhost:5000${formData.profileImage}`} alt="Profile" 
          className="w-24 h-24 rounded-lg object-cover border-2 border-blue-900 shadow-md"
        />
        ) : (
          <p className="text-gray-600">No profile image</p>
        )}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="mt-2 text-sm bg-blue-900 text-white px-3 py-1 rounded cursor-pointer hover:bg-blue-700"
        />
        {errors.profileImage && <p className="text-red-600 text-sm">{errors.profileImage}</p>}
      </div>

      {/* Profile Form */}
      <form onSubmit={handleUpdate} className="flex flex-col gap-1">
        <label className="font-semibold">Name:</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-900"
        />

        <label className="font-semibold">Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          disabled
          className="p-2 border rounded-lg bg-gray-200"
        />

        <label className="font-semibold">Department:</label>
        <input
          type="text"
          name="department"
          value={formData.department}
          onChange={handleChange}
          className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-900"
        />
        {errors.department && <p className="text-red-600 text-sm">{errors.department}</p>}

        <label className="font-semibold">Designation:</label>
        <input
          type="text"
          name="designation"
          value={formData.designation}
          onChange={handleChange}
          className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-900"
        />
        {errors.designation && <p className="text-red-600 text-sm">{errors.designation}</p>}

        <div className="flex flex-col gap-1 mb-4">  {/* Added mb-4 for spacing */}
  <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden h-[44px]">
    <span className="bg-blue-900 text-white px-3 h-full flex items-center justify-center text-sm font-medium">
      +91
    </span>
    <input
      type="text"
      name="contactNumber"
      value={formData.contactNumber}
      onChange={handleChange}
      maxLength="10"
      placeholder="Enter 10-digit mobile number"
      className="w-full px-3 outline-none text-sm h-full border-none"
      style={{ paddingTop: '20px' }}  // Adjusted to 10px for better alignment
    />
  </div>
</div>

{/* Error Message */}
{errors.contactNumber && <p className="text-red-600 text-sm mb-4">{errors.contactNumber}</p>}

{/* Update Profile Button with spacing */}
<button
  type="submit"
  className="bg-blue-900 text-white text-lg font-semibold py-2 rounded-lg hover:bg-blue-700 transition duration-300 w-full"
>
  Update Profile
</button>

      </form>
    </div>
  );
};

export default Profile;
