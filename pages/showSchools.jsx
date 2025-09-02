import React, { useState, useEffect } from "react";
import { getConnection } from "../lib/db";

export async function getServerSideProps({ req }) {
  try {
    console.log('getServerSideProps: Starting to fetch schools directly from database');
    
    // Query database directly instead of calling API route
    const conn = await getConnection();
    console.log('getServerSideProps: Database connection successful');
    
    const [rows] = await conn.execute(
      "SELECT id, name, address, city, state, contact, image, email_id FROM schools ORDER BY id ASC"
    );
    
    console.log(`getServerSideProps: Successfully fetched ${rows.length} schools from database`);
    
    // Release connection back to pool
    await conn.release();
    
    return { 
      props: { 
        schools: rows, 
        error: null,
        debugInfo: {
          timestamp: new Date().toISOString(),
          source: 'direct_database_query',
          recordCount: rows.length
        }
      } 
    };
    
  } catch (err) {
    console.error('getServerSideProps: Error fetching schools directly:', err);
    
    return { 
      props: { 
        schools: [], 
        error: err.message,
        debugInfo: {
          timestamp: new Date().toISOString(),
          source: 'direct_database_query_failed',
          error: err.message,
          code: err.code,
          errno: err.errno
        }
      } 
    };
  }
}

// Client-side fallback component
function ClientSideSchools() {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/getSchools');
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(`API ${response.status}: ${errorData.error || 'Unknown error'}`);
        }
        
        const data = await response.json();
        setSchools(data);
        setError(null);
      } catch (err) {
        console.error('Client-side fetch error:', err);
        setError(err.message);
        setSchools([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSchools();
  }, []);

  if (loading) {
    return (
      <div className="text-center text-gray-600 mt-8 p-6 bg-gray-50 rounded-lg">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
        <p>Loading schools...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 mt-8 p-6 bg-red-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Client-side Fallback Failed</h3>
        <p className="mb-4">{error}</p>
        <p className="text-sm text-gray-600">Both server-side and client-side data fetching failed.</p>
      </div>
    );
  }

  if (schools.length === 0) {
    return (
      <div className="text-center text-gray-600 mt-8 p-6 bg-gray-50 rounded-lg">
        <p>No schools found. Add a new one to get started!</p>
        <p className="text-sm text-green-600 mt-2">✅ Data loaded via client-side fallback</p>
      </div>
    );
  }

  return (
    <>
      <div className="mb-4 text-center">
        <p className="text-sm text-green-600">
          ✅ Data loaded via client-side fallback ({schools.length} schools)
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {schools.map((school) => (
          <div
            key={school.id}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden border border-gray-200"
          >
            {/* Image Section */}
            <div className="w-full bg-gray-100">
              {school.image && school.image.trim() !== "" ? (
                <img
                  src={school.image}
                  alt={school.name || "School image"}
                  className="w-full h-auto object-contain"
                  style={{ minHeight: '200px' }}
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                <div className="w-full h-48 flex items-center justify-center text-gray-400 bg-gray-100">
                  <span className="text-sm">No Image</span>
                </div>
              )}
            </div>

            {/* Content Section - All Database Fields */}
            <div className="p-6">
              {/* ID and Name */}
              <div className="mb-4">
                <div className="text-xs text-gray-500 mb-1">ID: {school.id}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {school.name}
                </h3>
              </div>

              {/* Address */}
              <div className="mb-3">
                <div className="text-sm font-medium text-gray-700 mb-1">Address:</div>
                <p className="text-sm text-gray-600">
                  {school.address}
                </p>
              </div>

              {/* City and State */}
              <div className="mb-3">
                <div className="text-sm font-medium text-gray-700 mb-1">Location:</div>
                <p className="text-sm text-gray-600">
                  {school.city}, {school.state}
                </p>
              </div>

              {/* Contact */}
              <div className="mb-3">
                <div className="text-sm font-medium text-gray-700 mb-1">Contact:</div>
                <p className="text-sm text-gray-600">
                  {school.contact}
                </p>
              </div>

              {/* Email */}
              <div className="mb-3">
                <div className="text-sm font-medium text-gray-700 mb-1">Email:</div>
                <p className="text-sm text-gray-600 break-all">
                  {school.email_id}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default function ShowSchools({ schools, error, debugInfo }) {
  let content;
  
  if (error) {
    content = (
      <div className="text-center text-red-600 mt-8 p-6 bg-red-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Error Loading Schools</h3>
        <p className="mb-4">{error}</p>
        {debugInfo && (
          <details className="text-left text-sm">
            <summary className="cursor-pointer text-blue-600 hover:text-blue-800">
              Debug Information
            </summary>
            <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto">
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          </details>
        )}
        <div className="mt-4 space-y-2">
          <a 
            href="/api/testDb" 
            target="_blank" 
            className="block text-blue-600 hover:text-blue-800 underline"
          >
            Test Database Connection
          </a>
          <a 
            href="/api/getSchools" 
            target="_blank" 
            className="block text-blue-600 hover:text-blue-800 underline"
          >
            Test API Route Directly
          </a>
        </div>
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-2">Trying Client-Side Fallback...</h4>
          <ClientSideSchools />
        </div>
      </div>
    );
  } else if (!Array.isArray(schools)) {
    content = (
      <div className="text-center text-red-600 mt-8 p-6 bg-red-50 rounded-lg">
        Could not load schools. Please try again later.
        {debugInfo && (
          <details className="text-left text-sm mt-2">
            <summary className="cursor-pointer text-blue-600 hover:text-blue-800">
              Debug Information
            </summary>
            <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto">
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          </details>
        )}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-2">Trying Client-Side Fallback...</h4>
          <ClientSideSchools />
        </div>
      </div>
    );
  } else if (schools.length === 0) {
    content = (
      <div className="text-center text-gray-600 mt-8 p-6 bg-gray-50 rounded-lg">
        <p className="mb-4">No schools found. Add a new one to get started!</p>
        {debugInfo && (
          <details className="text-left text-sm">
            <summary className="cursor-pointer text-blue-600 hover:text-blue-800">
              Debug Information
            </summary>
            <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto">
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          </details>
        )}
      </div>
    );
  } else {
    content = (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {schools.map((school) => (
          <div
            key={school.id}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden border border-gray-200"
          >
            {/* Image Section */}
            <div className="w-full bg-gray-100">
              {school.image && school.image.trim() !== "" ? (
                <img
                  src={school.image}
                  alt={school.name || "School image"}
                  className="w-full h-auto object-contain"
                  style={{ minHeight: '200px' }}
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                <div className="w-full h-48 flex items-center justify-center text-gray-400 bg-gray-100">
                  <span className="text-sm">No Image</span>
                </div>
              )}
            </div>

            {/* Content Section - All Database Fields */}
            <div className="p-6">
              {/* ID and Name */}
              <div className="mb-4">
                <div className="text-xs text-gray-500 mb-1">ID: {school.id}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {school.name}
                </h3>
              </div>

              {/* Address */}
              <div className="mb-3">
                <div className="text-sm font-medium text-gray-700 mb-1">Address:</div>
                <p className="text-sm text-gray-600">
                  {school.address}
                </p>
              </div>

              {/* City and State */}
              <div className="mb-3">
                <div className="text-sm font-medium text-gray-700 mb-1">Location:</div>
                <p className="text-sm text-gray-600">
                  {school.city}, {school.state}
                </p>
              </div>

              {/* Contact */}
              <div className="mb-3">
                <div className="text-sm font-medium text-gray-700 mb-1">Contact:</div>
                <p className="text-sm text-gray-600">
                  {school.contact}
                </p>
              </div>

              {/* Email */}
              <div className="mb-3">
                <div className="text-sm font-medium text-gray-700 mb-1">Email:</div>
                <p className="text-sm text-gray-600 break-all">
                  {school.email_id}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-100">
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
                className="px-4 py-2 text-gray-700 hover:text-indigo-600 font-medium transition-colors border-b-2 border-transparent hover:border-indigo-600"
              >
                Add School
              </a>
              <a
                href="/showSchools"
                className="px-4 py-2 text-indigo-600 font-medium border-b-2 border-indigo-600"
              >
                View Schools
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">
            School Directory
          </h2>
          <p className="text-gray-600">
            Complete information for all registered schools
          </p>
          {debugInfo && debugInfo.source === 'direct_database_query' && (
            <p className="text-sm text-green-600 mt-2">
              ✅ Data loaded directly from database ({debugInfo.recordCount} schools)
            </p>
          )}
        </div>
        
        {content}
      </main>
    </div>
  );
}
