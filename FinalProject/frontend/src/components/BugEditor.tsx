import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { bugSchema } from '../schemas/bugSchema';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function BugEditor() {
  const { bugId } = useParams<{ bugId: string }>();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'Open',
    priority: 'Medium',
  });

  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [backendError, setBackendError] = useState('');
  const [loading, setLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:2025/api';

  // Load existing bug data if editing
  useEffect(() => {
    if (bugId) {
      loadBug();
    }
  }, [bugId]);

  const loadBug = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/bugs/${bugId}`, {
        withCredentials: true,
      });
      setFormData(response.data);
      setBackendError('');
    } catch (err: any) {
      setBackendError(err.response?.data?.error || 'Failed to load bug');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: undefined });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form with Zod
    const result = bugSchema.safeParse(formData);
    if (!result.success) {
      const flattenedErrors = result.error.flatten();
      const fieldErrors: Record<string, string | undefined> = {};
      Object.entries(flattenedErrors.fieldErrors).forEach(([field, messages]) => {
        if (messages && messages.length > 0) fieldErrors[field] = messages[0];
      });
      setErrors(fieldErrors);
      return;
    }

    try {
      if (bugId) {
        // Update existing bug
        await axios.put(`${API_URL}/bugs/${bugId}`, formData, {
          withCredentials: true,
        });
        toast.success('Bug updated successfully!');
      } else {
        // Create new bug
        await axios.post(`${API_URL}/bugs`, formData, {
          withCredentials: true,
        });
        toast.success('Bug created successfully!');
      }
      navigate('/bug/list');
    } catch (err: any) {
      setBackendError(err.response?.data?.error || 'Failed to save bug');
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading bug...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
      <ToastContainer position="top-right" autoClose={3000} />
      <h2 className="text-2xl font-bold mb-6">{bugId ? 'Edit Bug' : 'Create Bug'}</h2>

      {backendError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {backendError}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Title */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.title ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.description ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
        </div>

        {/* Status */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Closed">Closed</option>
          </select>
        </div>

        {/* Priority */}
        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Priority</label>
          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Critical">Critical</option>
          </select>
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            Save
          </button>
          <button
            type="button"
            onClick={() => navigate('/bug/list')}
            className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
