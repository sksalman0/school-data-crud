import React from "react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-lg border-b">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-indigo-600">🏫 School Manager</h1>
            </div>
            <div className="flex space-x-4">
              <Link
                href="/"
                className="px-4 py-2 text-indigo-600 font-medium border-b-2 border-indigo-600"
              >
                Home
              </Link>
              <Link
                href="/addSchool"
                className="px-4 py-2 text-gray-700 hover:text-indigo-600 font-medium transition-colors border-b-2 border-transparent hover:border-indigo-600"
              >
                Add School
              </Link>
              <Link
                href="/showSchools"
                className="px-4 py-2 text-gray-700 hover:text-indigo-600 font-medium transition-colors border-b-2 border-transparent hover:border-indigo-600"
              >
                View Schools
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="text-center py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold mb-6 text-gray-800">
            School Management System
          </h1>
          <p className="text-xl text-gray-600 mb-12 leading-relaxed">
            A comprehensive solution for managing school information, student data, and administrative tasks.
            Built with modern web technologies for efficiency and reliability.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              href="/addSchool"
              className="bg-indigo-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-indigo-700 transition-colors text-lg shadow-lg hover:shadow-xl"
            >
              Add New School
            </Link>
            <Link
              href="/showSchools"
              className="bg-green-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-green-700 transition-colors text-lg shadow-lg hover:shadow-xl"
            >
              View School Directory
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Key Features
          </h2>
          <p className="text-gray-600 text-lg">
            Everything you need to manage your school information effectively
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 text-center">
            <div className="text-4xl mb-4">📝</div>
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Easy Data Entry</h3>
            <p className="text-gray-600">
              Simple forms with validation to add new schools with complete information and contact details.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 text-center">
            <div className="text-4xl mb-4">💾</div>
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Data Management</h3>
            <p className="text-gray-600">
              Efficient storage and retrieval of school information. Secure database management with MySQL.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 text-center">
            <div className="text-4xl mb-4">📱</div>
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Responsive Design</h3>
            <p className="text-gray-600">
              Works perfectly on all devices - desktop, tablet, and mobile. Modern interface for the best user experience.
            </p>
          </div>
        </div>
      </div>

      
    </div>
  );
}
