import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DoorOpen, DoorClosed, Save } from 'lucide-react';
import axios from 'axios';

interface Bug {
  _id: string;
  title: string;
  classification: string;
  assignedTo?: string;
  closed: boolean;
}

interface Comment {
  _id: string;
  text: string;
  bugId: string;
}

interface User {
  _id: string;
  givenName: string;
}

export default function BugEditor() {
  const { bugId } = useParams<{ bugId: string }>();
  const [bug, setBug] = useState<Bug | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState<string>('');
  const [classification, setClassification] = useState<string>('');
  const [assignedTo, setAssignedTo] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const bugRes = await axios.get<Bug>(`http://localhost:8080/api/bugs/${bugId}`);
      setBug(bugRes.data);
      setClassification(bugRes.data.classification);
      setAssignedTo(bugRes.data.assignedTo || '');
      setStatus(bugRes.data.closed ? 'Closed' : 'Open');
      
      const commentsRes = await axios.get<Comment[]>(`http://localhost:8080/api/comments?bugId=${bugId}&sort=oldest`);
      setComments(commentsRes.data);
      
      const usersRes = await axios.get<User[]>('http://localhost:8080/api/users');
      setUsers(usersRes.data);
    };
    fetchData();
  }, [bugId]);

  const postComment = async () => {
    await axios.post('http://localhost:8080/api/comments', { bugId, text: newComment });
    setNewComment('');
    const res = await axios.get<Comment[]>(`http://localhost:8080/api/comments?bugId=${bugId}&sort=oldest`);
    setComments(res.data);
  };

  const updateClassification = async () => {
    await axios.put(`http://localhost:8080/api/bugs/${bugId}`, { classification });
  };

  const assignUser = async () => {
    await axios.put(`http://localhost:8080/api/bugs/${bugId}`, { assignedTo });
  };

  const updateStatus = async () => {
    await axios.put(`http://localhost:8080/api/bugs/${bugId}`, { closed: status === 'Closed' });
  };

  if (!bug) return <div>Loading...</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">{bug.title}</h1>
      
      <div className="space-y-4 mb-8">
        <div className="flex items-center space-x-2">
          <Select value={classification} onValueChange={setClassification}>
            <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="unclassified">Unclassified</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="unapproved">Unapproved</SelectItem>
              <SelectItem value="duplicate">Duplicate</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={updateClassification}>Update</Button>
        </div>

        <div className="flex items-center space-x-2">
          <Select value={assignedTo} onValueChange={setAssignedTo}>
            <SelectTrigger className="w-48"><SelectValue placeholder="Assign to..." /></SelectTrigger>
            <SelectContent>
              {users.map(user => (
                <SelectItem key={user._id} value={user._id}>{user.givenName}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={assignUser}>Assign</Button>
        </div>

        <div className="flex items-center space-x-2">
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Open"><DoorOpen className="inline mr-2 h-4 w-4" />Open</SelectItem>
              <SelectItem value="Closed"><DoorClosed className="inline mr-2 h-4 w-4" />Closed</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={updateStatus}>Update</Button>
        </div>
      </div>

      <h2 className="text-xl font-bold mb-4">Comments</h2>
      <div className="flex items-center space-x-2 mb-4">
        <Input placeholder="Add comment..." value={newComment} onChange={(e) => setNewComment(e.target.value)} />
        <Button onClick={postComment}><Save className="mr-2 h-4 w-4" />Post</Button>
      </div>

      <div className="space-y-2">
        {comments.map(comment => (
          <div key={comment._id} className="border p-4 rounded">{comment.text}</div>
        ))}
      </div>
    </div>
  );
}

