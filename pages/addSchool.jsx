import React from "react";
import { useForm } from "react-hook-form";

export default function AddSchool() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    // Check file size before submission
    if (data.image && data.image[0]) {
      const fileSize = data.image[0].size;
      const maxSize = 5 * 1024 * 1024; // 5MB
      
      if (fileSize > maxSize) {
        alert("Image file is too large! Please select an image smaller than 5MB.");
        return;
      }
    }

    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === "image" && value[0]) {
        formData.append(key, value[0]);
      } else {
        formData.append(key, value);
      }
    });
    
    try {
      const res = await fetch("/api/addSchool", {
        method: "POST",
        body: formData,
      });
      
      if (res.ok) {
        reset();
        alert("School added successfully!");
      } else {
        const errorData = await res.json();
        alert(`Error adding school: ${errorData.error || 'Unknown error'}`);
      }
    } catch (err) {
      alert("Network error. Please check your connection and try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-lg border-b">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-indigo-600">🏫 School Manager</h1>
            </div>
            <div className="flex space-x-4">
              <a
                href="/"
                className="px-4 py-2 text-gray-700 hover:text-indigo-600 font-medium transition-colors border-b-2 border-transparent hover:border-indigo-600"
              >
                Home
              </a>
              <a
                href="/addSchool"
                className="px-4 py-2 text-indigo-600 font-medium border-b-2 border-indigo-600"
              >
                Add School
              </a>
              <a
                href="/showSchools"
                className="px-4 py-2 text-gray-700 hover:text-indigo-600 font-medium transition-colors border-b-2 border-transparent hover:border-indigo-600"
              >
                View Schools
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Form Content */}
      <div className="flex items-center justify-center py-12 px-6">
        <form
          className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg space-y-6"
          onSubmit={handleSubmit(onSubmit)}
          encType="multipart/form-data"
        >
          <h2 className="text-2xl font-bold text-gray-900 text-center">
            Add New School
          </h2>

          {/* Form fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                {...register("name", { required: "Name is required" })}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                {...register("address", { required: "Address is required" })}
              />
              {errors.address && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.address.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City
              </label>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                {...register("city", { required: "City is required" })}
              />
              {errors.city && (
                <p className="mt-1 text-sm text-red-500">{errors.city.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                State
              </label>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                {...register("state", { required: "State is required" })}
              />
              {errors.state && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.state.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contact
              </label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                {...register("contact", { required: "Contact is required" })}
              />
              {errors.contact && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.contact.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                {...register("email_id", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/,
                    message: "Invalid email format",
                  },
                })}
              />
              {errors.email_id && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.email_id.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image
              </label>
              <input
                type="file"
                accept="image/*"
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"
                {...register("image", { required: "Image is required" })}
              />
              <p className="mt-1 text-xs text-gray-500">
                Maximum file size: 5MB. Supported formats: JPG, PNG, GIF
              </p>
              {errors.image && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.image.message}
                </p>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            Add School
          </button>
        </form>
      </div>
    </div>
  );
}
