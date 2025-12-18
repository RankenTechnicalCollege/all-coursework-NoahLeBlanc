import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, User } from 'lucide-react';
import axios from 'axios';

interface UserType {
  _id: string;
  givenName: string;
  role: string;
}

export default function UserList() {
  const [users, setUsers] = useState<UserType[]>([]);
  const [keywords, setKeywords] = useState<string>('');
  const [role, setRole] = useState<string>('');
  const [minAge, setMinAge] = useState<string>('');
  const [maxAge, setMaxAge] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('name');

  const searchUsers = async () => {
    const params = { keywords, role, minAge, maxAge, sortBy };
    const res = await axios.get<UserType[]>('http://localhost:8080/api/users', { params });
    setUsers(res.data);
  };

  useEffect(() => { searchUsers(); }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4"><User className="inline mr-2" />User Search</h1>
      
      <div className="space-y-4 mb-8 max-w-md">
        <div className="flex w-full items-center space-x-2">
          <Input placeholder="Keywords" value={keywords} onChange={(e) => setKeywords(e.target.value)} />
          <Button onClick={searchUsers}><Search className="mr-2 h-4 w-4" />Search</Button>
        </div>

        <Select value={role} onValueChange={setRole}>
          <SelectTrigger><SelectValue placeholder="Role" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="developer">Developer</SelectItem>
            <SelectItem value="tester">Tester</SelectItem>
            <SelectItem value="manager">Manager</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex space-x-2">
          <Input type="number" placeholder="Min Age" value={minAge} onChange={(e) => setMinAge(e.target.value)} />
          <Input type="number" placeholder="Max Age" value={maxAge} onChange={(e) => setMaxAge(e.target.value)} />
        </div>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Given Name</SelectItem>
            <SelectItem value="role">Role</SelectItem>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="oldest">Oldest</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        {users.map(user => (
          <div key={user._id} className="border p-4 rounded">{user.givenName}</div>
        ))}
      </div>
    </div>
  );
}

