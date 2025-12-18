import { useState } from 'react';
import type { FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Save } from 'lucide-react';
import axios from 'axios';

export default function ReportBug() {
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await axios.post('http://localhost:8080/api/bugs', { title, description });
    setTitle('');
    setDescription('');
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Report Bug</h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <Textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
        <Button type="submit"><Save className="mr-2 h-4 w-4" />Submit</Button>
      </form>
    </div>
  );
}

