import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { Button } from '../ui/button'
import { useState } from 'react'

function ReportBug() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const handleSubmit = () => {
    // Handle form submission, call your API here
  }

  return (
    <div className="p-4">
      <h2 className="text-xl mb-4">Report a New Bug</h2>
      <div className="mb-2">
        <label>Title</label>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>
      <div className="mb-2">
        <label>Description</label>
        <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
      <Button onClick={handleSubmit}>Submit Bug</Button>
    </div>
  )
}

export default ReportBug