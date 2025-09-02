import React, { useState, useEffect } from "react";

export default function DebugPage() {
  const [testResults, setTestResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const testDatabase = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const res = await fetch('/api/testDb');
      const data = await res.json();
      setTestResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const testGetSchools = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const res = await fetch('/api/getSchools');
      const data = await res.json();
      setTestResults({ type: 'getSchools', data });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">🔍 Database Debug Page</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <button
            onClick={testDatabase}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test Database Connection'}
          </button>
          
          <button
            onClick={testGetSchools}
            disabled={loading}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test Get Schools API'}
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <strong>Error:</strong> {error}
          </div>
        )}

        {testResults && (
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Test Results:</h2>
            <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
              {JSON.stringify(testResults, null, 2)}
            </pre>
          </div>
        )}

        <div className="mt-8 bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Environment Check:</h2>
          <div className="space-y-2 text-sm">
            <div><strong>Current URL:</strong> {typeof window !== 'undefined' ? window.location.href : 'Server side'}</div>
            <div><strong>API Base:</strong> {typeof window !== 'undefined' ? window.location.origin : 'Server side'}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
