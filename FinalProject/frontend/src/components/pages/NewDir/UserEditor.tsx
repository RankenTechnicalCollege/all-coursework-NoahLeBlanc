import { useState, useEffect } from 'react';
import { z } from 'zod';

export interface UserData {
  name: string;
  email: string;
  role: 'Developer' | 'QA' | 'Manager';
}

export interface UserEditorProps {
  userId?: string; // optional if creating new user
  onSave: (data: UserData) => void;
  onCancel: () => void;
}

const roleOptions = ['Developer', 'QA', 'Manager'] as const;

export default function UserEditor({ userId, onSave, onCancel }: UserEditorProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'Developer' | 'QA' | 'Manager'>('Developer');
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});

  useEffect(() => {
    if (userId) {
      // Load user data from API or mock
      const user = { id: userId, name: 'Sample', email: 'sample@example.com', role: 'Developer' };
      setName(user.name);
      setEmail(user.email);
      setRole(user.role as 'Developer' | 'QA' | 'Manager');
    }
  }, [userId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'name') setName(value);
    if (name === 'email') setEmail(value);
    if (name === 'role') setRole(value as 'Developer' | 'QA' | 'Manager');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation with Zod
    const schema = z.object({
      name: z.string().min(2, 'Name must be at least 2 characters'),
      email: z.string().email('Invalid email'),
      role: z.enum(roleOptions)
    });

    const result = schema.safeParse({ name, email, role });

    if (!result.success) {
      const flattened = result.error.flatten();
      const fieldErrors: Record<string, string | undefined> = {};
      Object.entries(flattened.fieldErrors).forEach(([field, messages]) => {
        if (messages && messages.length > 0) fieldErrors[field] = messages[0];
      });
      setErrors(fieldErrors);
      return;
    }

    // Call onSave prop with validated data
    onSave({ name, email, role });
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">{userId ? 'Edit User' : 'New User'}</h2>
      <form onSubmit={handleSubmit}>
        {/* Name */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Name</label>
          <input
            type="text"
            name="name"
            value={name}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>
        {/* Email */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Email</label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>
        {/* Role */}
        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Role</label>
          <select
            name="role"
            value={role}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {roleOptions.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
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
            onClick={onCancel}
            className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
