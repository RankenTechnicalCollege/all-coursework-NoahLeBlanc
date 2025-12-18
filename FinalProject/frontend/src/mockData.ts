export interface Bug {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  assignedTo?: string;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export const mockBugs: Bug[] = [
  {
    id: '1',
    title: 'Login button not working',
    description: 'The login button does not respond when clicked',
    status: 'Open',
    priority: 'High',
    assignedTo: 'John Doe',
    createdAt: '2024-12-01'
  },
  {
    id: '2',
    title: 'UI layout breaks on mobile',
    description: 'The navigation bar overlaps content on mobile devices',
    status: 'In Progress',
    priority: 'Medium',
    createdAt: '2024-12-05'
  }
];

export const mockUsers: User[] = [
  { id: '1', name: 'John Doe', email: 'john@example.com', role: 'Developer' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'QA' }
];