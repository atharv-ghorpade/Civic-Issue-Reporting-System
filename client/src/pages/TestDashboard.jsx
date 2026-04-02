import { useState, useEffect } from 'react';
import issueService from '../services/issueService';

export default function TestDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const testApi = async () => {
      console.log("Calling getMyIssues()...");
      try {
        setLoading(true);
        const result = await issueService.getMyIssues();
        console.log("API Response:", result);
        setData(result);
        setError(null);
      } catch (err) {
        console.error("API Error:", err);
        setError(err.message || "Failed to fetch issues");
      } finally {
        setLoading(false);
      }
    };

    testApi();
  }, []);

  return (
    <div className="p-8 max-w-4xl mx-auto bg-white rounded-2xl shadow-lg mt-10">
      <h1 className="text-3xl font-bold text-primary mb-6 border-b pb-4">API Verification Dashboard</h1>
      
      <div className="space-y-6">
        <section className="bg-gray-50 p-6 rounded-xl border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-2">Connection Status</h2>
          {loading ? (
            <p className="text-blue-500 font-medium pb-2">Checking connection... 🔄</p>
          ) : error ? (
            <div className="p-4 bg-red-50 text-red-600 rounded-lg border border-red-100">
              <p className="font-bold">Connection Failed ❌</p>
              <p className="text-sm font-mono mt-1">{error}</p>
            </div>
          ) : (
            <div className="p-4 bg-green-50 text-green-600 rounded-lg border border-green-100">
              <p className="font-bold">Successfully Connected ✅</p>
              <p className="text-sm mt-1">Backend responded with {Array.isArray(data) ? data.length : 0} issues.</p>
            </div>
          )}
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-4">Raw Response Data</h2>
          <div className="bg-gray-900 text-green-400 p-6 rounded-xl overflow-auto max-h-[400px] font-mono text-sm">
            {loading ? (
              <p className="animate-pulse">Waiting for response...</p>
            ) : (
              <pre>{JSON.stringify(data, null, 2)}</pre>
            )}
          </div>
        </section>

        <section className="bg-accent/5 p-6 rounded-xl border border-accent/20">
          <h2 className="text-lg font-bold text-accent mb-2">Instructions</h2>
          <ul className="list-disc list-inside text-sm text-gray-600 space-y-2">
            <li>Ensure the backend is running at <code className="bg-gray-100 px-1 rounded text-red-500">http://localhost:8000</code></li>
            <li>Check the browser console (F12) for detailed logs of the API request and response.</li>
            <li>If you see a 401 error, you need to log in first to set the JWT token in localStorage.</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
