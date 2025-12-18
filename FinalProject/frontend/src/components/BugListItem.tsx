import type { Bug } from '../mockData';

interface BugListItemProps {
  item: Bug;
  onEdit: () => void;
}

export default function BugListItem({ item, onEdit }: BugListItemProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-semibold">{item.title}</h3>
          <p className="text-gray-600 mt-2">{item.description}</p>
          <div className="flex gap-4 mt-3">
            <span
              className={`px-2 py-1 rounded text-sm ${
                item.status === 'Open' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
              }`}
            >
              {item.status}
            </span>
            <span
              className={`px-2 py-1 rounded text-sm ${
                item.priority === 'High' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
              }`}
            >
              {item.priority}
            </span>
          </div>
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