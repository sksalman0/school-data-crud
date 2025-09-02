import React, { useState } from "react";
import { useForm } from "react-hook-form";

export default function AddSchool() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setSubmitMessage("");
    
    try {
      // Check file size before submission
      if (data.image && data.image[0]) {
        const fileSize = data.image[0].size;
        const maxSize = 5 * 1024 * 1024; // 5MB
        
        if (fileSize > maxSize) {
          setSubmitMessage("Image file is too large! Please select an image smaller than 5MB.");
          setIsSubmitting(false);
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
      
      console.log("Submitting form data:", data);
      
      const res = await fetch("/api/addSchool", {
        method: "POST",
        body: formData,
      });
      
      const responseData = await res.json();
      
      if (res.ok) {
        setSubmitMessage("School added successfully!");
        reset();
        // Clear message after 3 seconds
        setTimeout(() => setSubmitMessage(""), 3000);
      } else {
        setSubmitMessage(`Error adding school: ${responseData.error || 'Unknown error'}`);
      }
    } catch (err) {
      console.error("Form submission error:", err);
      setSubmitMessage("Network error. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
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

          {/* Submit Message */}
          {submitMessage && (
            <div className={`p-3 rounded-md text-sm ${
              submitMessage.includes("successfully") 
                ? "bg-green-50 text-green-700 border border-green-200" 
                : "bg-red-50 text-red-700 border border-red-200"
            }`}>
              {submitMessage}
            </div>
          )}

          {/* Form fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name *
              </label>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                {...register("name", { required: "Name is required" })}
                placeholder="Enter school name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address *
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                rows="3"
                {...register("address", { required: "Address is required" })}
                placeholder="Enter complete address"
              />
              {errors.address && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.address.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City *
                </label>
                <input
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  {...register("city", { required: "City is required" })}
                  placeholder="Enter city"
                />
                {errors.city && (
                  <p className="mt-1 text-sm text-red-500">{errors.city.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State *
                </label>
                <input
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  {...register("state", { required: "State is required" })}
                  placeholder="Enter state"
                />
                {errors.state && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.state.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact *
                </label>
                <input
                  type="tel"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  {...register("contact", { 
                    required: "Contact is required",
                    pattern: {
                      value: /^[0-9]{10,15}$/,
                      message: "Please enter a valid phone number (10-15 digits)"
                    }
                  })}
                  placeholder="Enter contact number"
                />
                {errors.contact && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.contact.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
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
                  placeholder="Enter email address"
                />
                {errors.email_id && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.email_id.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image *
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
            disabled={isSubmitting}
            className={`w-full py-2 px-4 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
              isSubmitting
                ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                : "bg-indigo-600 text-white hover:bg-indigo-700"
            }`}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Adding School...
              </span>
            ) : (
              "Add School"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
