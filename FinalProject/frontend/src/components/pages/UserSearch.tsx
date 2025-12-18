import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Select } from '../ui/select'
import { useState } from 'react'
import { Search } from 'lucide-react'

function UserSearch() {
  const [keywords, setKeywords] = useState('')
  const [role, setRole] = useState('')
  const [maxAge, setMaxAge] = useState('')
  const [minAge, setMinAge] = useState('')
  const [sortBy, setSortBy] = useState('name')

  return (
    <div className="p-4 max-w-2xl">
      {/* Keywords Search */}
      <div className="flex w-full max-w-sm items-center space-x-2 mb-4">
        <Input 
          placeholder="Keywords" 
          value={keywords} 
          onChange={(e) => setKeywords(e.target.value)} 
        />
        <Button>
          <Search className="mr-2 h-4 w-4" /> Search
        </Button>
      </div>

      {/* Role Filter */}
      <div>
        <Label>Role</Label>
        <Select onValueChange={setRole} value={role}>
          <option value="">All</option>
          {/* Add roles options */}
          <option value="admin">Admin</option>
          <option value="user">User</option>
        </Select>
      </div>

      {/* Age Filters */}
      <div className="flex space-x-2 mt-2">
        <div>
          <Label>Max Age (days)</Label>
          <Input 
            type="number" 
            value={maxAge} 
            onChange={(e) => setMaxAge(e.target.value)} 
          />
        </div>
        <div>
          <Label>Min Age (days)</Label>
          <Input 
            type="number" 
            value={minAge} 
            onChange={(e) => setMinAge(e.target.value)} 
          />
        </div>
      </div>

      {/* Sort By */}
      <div className="mt-2">
        <Label>Sort By</Label>
        <Select onValueChange={setSortBy} value={sortBy}>
          <option value="name">Given Name</option>
          <option value="role">Role</option>
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
        </Select>
      </div>
    </div>
  )
}

export default UserSearch