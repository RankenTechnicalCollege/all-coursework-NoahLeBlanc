import { useState, useEffect } from 'react';
import axios from 'axios';
import BugListItem from './BugListItem';

export default function BugList() {
  const [bugs, setBugs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Environment-aware API URL
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:2025/api';

  useEffect(() => {
    loadBugs();
  }, []);

  const loadBugs = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/bugs`, {
        withCredentials: true, // include cookies if your backend uses auth
      });
      setBugs(response.data);
      setError('');
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Failed to load bugs';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading bugs...</div>;
  }

  if (error) {
    return <div className="text-red-600 text-center py-8">{error}</div>;
  }

  if (bugs.length === 0) {
    return <div className="text-center py-8">No bugs found.</div>;
  }

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Bug List</h2>
      {bugs.map((bug) => (
        <BugListItem key={bug.id} item={bug} onEdit={() => {}} />
      ))}
    </div>
  );
}
