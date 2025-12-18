import type { User } from '../mockData';

interface UserListItemProps {
  item: User;
  onEdit: () => void;
}

export default function UserListItem({ item, onEdit }: UserListItemProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-semibold">{item.name}</h3>
          <p className="text-gray-600">{item.email}</p>
          <span className="inline-block mt-2 px-2 py-1 bg-green-100 text-green-800 rounded text-sm">
            {item.role}
          </span>
        </div>
        <button
          onClick={onEdit}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Edit
        </button>
      </div>
    </div>
  );
}