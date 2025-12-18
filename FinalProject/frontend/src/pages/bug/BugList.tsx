import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Search } from 'lucide-react';
import axios from 'axios';

interface Bug {
  _id: string;
  title: string;
  classification: string;
  closed: boolean;
}

export default function BugList() {
  const [bugs, setBugs] = useState<Bug[]>([]);
  const [keywords, setKeywords] = useState<string>('');
  const [classification, setClassification] = useState<string>('');
  const [minAge, setMinAge] = useState<string>('');
  const [maxAge, setMaxAge] = useState<string>('');
  const [closed, setClosed] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>('newest');

  const searchBugs = async () => {
    const params = { keywords, classification, minAge, maxAge, closed, sortBy };
    const res = await axios.get<Bug[]>('http://localhost:8080/api/bugs', { params });
    setBugs(res.data);
  };

  useEffect(() => { searchBugs(); }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Bug Search</h1>
      
      <div className="space-y-4 mb-8 max-w-md">
        <div className="flex w-full max-w-sm items-center space-x-2">
          <Input placeholder="Keywords" value={keywords} onChange={(e) => setKeywords(e.target.value)} />
          <Button onClick={searchBugs}><Search className="mr-2 h-4 w-4" />Search</Button>
        </div>

        <Select value={classification} onValueChange={setClassification}>
          <SelectTrigger><SelectValue placeholder="Classification" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="unclassified">Unclassified</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="unapproved">Unapproved</SelectItem>
            <SelectItem value="duplicate">Duplicate</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex space-x-2">
          <Input type="number" placeholder="Min Age" value={minAge} onChange={(e) => setMinAge(e.target.value)} />
          <Input type="number" placeholder="Max Age" value={maxAge} onChange={(e) => setMaxAge(e.target.value)} />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox id="closed" checked={closed} onCheckedChange={(checked) => setClosed(checked as boolean)} />
          <Label htmlFor="closed">Include Closed</Label>
        </div>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="oldest">Oldest</SelectItem>
            <SelectItem value="title">Title</SelectItem>
            <SelectItem value="classification">Classification</SelectItem>
            <SelectItem value="assignedTo">Assigned To</SelectItem>
            <SelectItem value="createdBy">Reported By</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        {bugs.map(bug => (
          <div key={bug._id} className="border p-4 rounded">{bug.title}</div>
        ))}
      </div>
    </div>
  );
}

