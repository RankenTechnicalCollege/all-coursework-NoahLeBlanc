import { useState, useEffect } from 'react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Select } from '../ui/select'
import { Label } from '../ui/label'
import { Search } from 'lucide-react'

// Dummy fetch functions – replace with your API calls
const fetchComments = async (bugId) => {
  // fetch comments sorted oldest to newest
  return [
    { id: 1, text: 'Initial comment', date: '2023-10-01' },
    { id: 2, text: 'Follow-up comment', date: '2023-10-02' },
  ]
}

const updateBugField = async (bugId, field, value) => {
  // API call to update bug
}

function BugEditor({ bugId }) {
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const [classification, setClassification] = useState('UI') // example initial
  const [assignedUser, setAssignedUser] = useState('user1') // example
  const [status, setStatus] = useState('Open') // or 'Closed'

  useEffect(() => {
    fetchComments(bugId).then(setComments)
  }, [bugId])

  const handlePostComment = () => {
    // Call API to post comment
    // Refresh comments after posting
  }

  const handleUpdateClassification = () => {
    updateBugField(bugId, 'classification', classification)
  }

  const handleAssignUser = () => {
    updateBugField(bugId, 'assignedTo', assignedUser)
  }

  const handleStatusToggle = () => {
    const newStatus = status === 'Open' ? 'Closed' : 'Open'
    updateBugField(bugId, 'status', newStatus)
    setStatus(newStatus)
  }

  return (
    <div className="p-4 space-y-4">
      {/* Comments List */}
      <div>
        <h3 className="text-lg mb-2">Comments</h3>
        <div className="border p-2 max-h-64 overflow-y-auto">
          {comments.map((comment) => (
            <div key={comment.id} className="mb-2">
              <p>{comment.text}</p>
              <small>{comment.date}</small>
            </div>
          ))}
        </div>
      </div>

      {/* Post Comment */}
      <div className="flex space-x-2">
        <Input 
          placeholder="Add a comment" 
          value={newComment} 
          onChange={(e) => setNewComment(e.target.value)} 
        />
        <Button onClick={handlePostComment}>Post</Button>
      </div>

      {/* Classify Bug */}
      <div className="flex items-center space-x-2">
        <Select 
          value={classification} 
          onValueChange={setClassification}
        >
          <option value="UI">UI</option>
          <option value="Backend">Backend</option>
          <option value="Performance">Performance</option>
        </Select>
        <Button onClick={handleUpdateClassification}>Update</Button>
      </div>

      {/* Assign User */}
      <div className="flex items-center space-x-2">
        <Select 
          value={assignedUser} 
          onValueChange={setAssignedUser}
        >
          <option value="user1">User 1</option>
          <option value="user2">User 2</option>
        </Select>
        <Button onClick={handleAssignUser}>Assign</Button>
      </div>

      {/* Status Toggle */}
      <div className="flex items-center space-x-2">
        <Select 
          value={status} 
          onValueChange={(val) => setStatus(val)}
        >
          <option value="Open">Open</option>
          <option value="Closed">Closed</option>
        </Select>
        <Button onClick={handleStatusToggle}>Update</Button>
      </div>
    </div>
  )
}

export default BugEditor