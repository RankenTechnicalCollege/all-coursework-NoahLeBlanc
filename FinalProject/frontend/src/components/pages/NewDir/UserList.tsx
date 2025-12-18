import { mockUsers } from '../mockData';
import UserListItem from './UserListItem';

interface UserListProps {
  onEditUser: (id: string) => void;
}

export default function UserList({ onEditUser }: UserListProps) {
  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">User List</h2>
      {mockUsers.length === 0 ? (
        <p className="text-gray-600">No users found.</p>
      ) : (
        mockUsers.map((user) => (
          <UserListItem key={user.id} item={user} onEdit={() => onEditUser(user.id)} />
        ))
      )}
    </div>
  );
}